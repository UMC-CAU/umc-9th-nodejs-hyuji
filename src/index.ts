import express, {Express, Request, Response, NextFunction,
} from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";
import { handleUserSignUp } from "./controllers/user.controller.js";
import {
  handleCreateMyPageReview,
  handleListStoreReviews, handleListMyReviews,
} from "./controllers/review.controller.js";
import {
  assignMission, startUserMission, createMissionForStore,
  handleListStoreMissions,
  handleListMyInProgressMissions, completeUserMission,
} from "./controllers/mission.controller.js";

dotenv.config();

// Express Response에 커스텀 메서드 타입 정의
declare global {
  namespace Express {
    interface Response {
      success: (data: any) => Response;
      error: (errorObj: {
        errorCode?: string;
        reason?: string | null;
        data?: any;
      }) => Response;
    }

    // passport-jwt로 인증된 유저 타입 (Prisma User 기준으로 맞춤)
    interface User {
      userId: number;
      email: string | null;
      name: string | null;
    }
  }
}


// Google OAuth 콜백에서 req.user에 실릴 토큰 타입
interface JwtTokens {
  accessToken: string;
  refreshToken: string;
}

const app: Express = express();
const port = process.env.PORT || 3000;

// 로깅 미들웨어 (morgan)
app.use(morgan("dev"));

// 쿠키 파싱 미들웨어
app.use(cookieParser());

// 공통 응답을 사용할 수 있는 헬퍼 함수 등록
app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = (success: any) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };
  res.error = ({
    errorCode = "unknown",
    reason = null,
    data = null,
  }: {
    errorCode?: string;
    reason?: string | null;
    data?: any;
  }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };
  next();
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Passport 초기화 & Strategy 등록
passport.use(googleStrategy);
passport.use(jwtStrategy);
app.use(passport.initialize());

// JWT 인증 미들웨어
const isLogin = passport.authenticate("jwt", { session: false });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// 로그인한 유저만 접근 가능한 마이페이지
app.get("/mypage", isLogin, (req: Request, res: Response) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});

// Google OAuth 로그인 시작
app.get(
  "/oauth2/login/google",
  passport.authenticate("google", {
    session: false,
  })
);

// Google OAuth 콜백
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login-failed",
  }),
  (req: Request, res: Response) => {
    const tokens = req.user as JwtTokens;

    res.status(200).success({
      message: "Google 로그인 성공!",
      tokens, // { accessToken: "...", refreshToken: "..." }
    });
  }
);

// 실패 리다이렉트용 (없으면 404라 하나 만들어둠)
app.get("/login-failed", (req: Request, res: Response) => {
  res.status(401).error({
    errorCode: "AUTH_FAILED",
    reason: "Google 로그인에 실패했습니다.",
  });
});

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: "/openapi.json",
      },
    }
  )
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.ts"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
    components: {
      schemas: {
        // 공통 에러 스키마 (여러 컨트롤러에서 사용하므로 유지)
        ErrorResponse: {
          type: "object",
          properties: {
            errorCode: {
              type: "string",
              example: "U001",
              description: "에러 코드",
            },
            reason: {
              type: "string",
              nullable: true,
              example: "이미 존재하는 이메일입니다.",
            },
            data: {
              nullable: true,
              description: "추가 디버깅 정보(선택)",
            },
          },
        },
        CommonErrorResponse: {
          type: "object",
          properties: {
            resultType: {
              type: "string",
              example: "FAIL",
            },
            error: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            success: {
              nullable: true,
              example: null,
            },
          },
        },
        // 나머지 도메인별(Mission, Review, User) 스키마는 각 Controller로 이동되었습니다.
      },
    },
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

app.get("/setcookie", (req: Request, res: Response) => {
  // userId라는 이름으로 쿠키 생성 (1시간 유효)
  res.cookie("userId", "123", { maxAge: 3600000, httpOnly: true });
  res.cookie("theme", "dark", { maxAge: 3600000 });
  res.status(200).success({ message: "쿠키가 생성되었습니다!" });
});

app.get("/getcookie", (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log("요청 쿠키:", cookies);

  if (Object.keys(cookies).length > 0) {
    res.status(200).success({
      message: "쿠키 조회 성공",
      cookies: cookies,
    });
  } else {
    res.status(200).error({
      errorCode: "NO_COOKIES",
      reason: "저장된 쿠키가 없습니다.",
    });
  }
});

app.get("/clearcookie", (req: Request, res: Response) => {
  res.clearCookie("userId");
  res.clearCookie("theme");
  res.status(200).success({ message: "모든 쿠키가 삭제되었습니다!" });
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/mypage/:userMissionId", handleCreateMyPageReview);
app.post("/api/v1/stores/:storeId/missions", createMissionForStore);
app.post("/api/v1/missions/:missionId/assign", assignMission);
app.post("/api/v1/missions/:userMissionId/start", startUserMission);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/users/:userId/reviews", handleListMyReviews);
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);
app.get(
  "/api/v1/users/:userId/missions/in-progress",
  handleListMyInProgressMissions
);
app.post("/api/v1/missions/:userMissionId/done", completeUserMission);

// 전역 오류를 처리하기 위한 미들웨어
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.statusCode || 500).error({
      errorCode: err.errorCode || "unknown",
      reason: err.reason || err.message || null,
      data: err.data || null,
    });
  }
);

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
