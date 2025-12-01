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
  createMissionForStore,
  assignMission,  startUserMission,
  handleListStoreMissions,
  handleListMyInProgressMissions,
  completeUserMission,
} from "./controllers/mission.controller.js";

dotenv.config();

declare global {
  namespace Express {
    interface Response {
      success: (data: any) => void;
      error: (err: {
        errorCode: string;
        reason: string | null;
        data?: any;
      }) => void;
    }

    interface Request {
      user?: any;
    }
  }
}

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = (data: any) => {
    res.json({
      resultType: "SUCCESS",
      error: null,
      success: data,
    });
  };

  res.error = (err: { errorCode: string; reason: string | null; data?: any }) => {
    res.json({
      resultType: "FAIL",
      error: {
        errorCode: err.errorCode,
        reason: err.reason,
        data: err.data ?? null,
      },
      success: null,
    });
  };

  next();
});

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

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req: Request, res: Response) => {
    const user = req.user as any;

    const jwt = require("jsonwebtoken");

    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    res.redirect("/mypage");
  }
);

// Swagger 설정
if (process.env.NODE_ENV !== "production") {
  const swagger = swaggerAutogen();

  const generateDocs = async () => {
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
                description: "에러 코드 (예: VALIDATION_ERROR)",
              },
              reason: {
                type: "string",
                description: "에러 발생 원인 메시지",
              },
              data: {
                type: "object",
                nullable: true,
                description: "에러와 관련된 추가 데이터 (선택 사항)",
              },
            },
          },
          CommonErrorResponse: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                $ref: "#/components/schemas/ErrorResponse",
              },
              success: {
                nullable: true,
                example: null,
              },
            },
          },
        },
      },
    };

    try {
      await swagger(outputFile, routes, doc);
    } catch (error) {
      console.error("Swagger documentation generation failed:", error);
    }
  };

  generateDocs().catch((err) => console.error(err));
}

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

  try {
    const swaggerDoc = await swaggerAutogen(options)();
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDoc);
  } catch (error) {
    next(error);
  }
});

// 테스트용 쿠키 생성 API
app.get("/setcookie", (req: Request, res: Response) => {
  res.cookie("userId", "12345", {
    httpOnly: true,
    maxAge: 3600000,
  });

  res.cookie("theme", "dark", {
    maxAge: 3600000,
  });

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
      data: null,
    });
  }
});

app.get("/clearcookie", (req: Request, res: Response) => {
  res.clearCookie("userId");
  res.clearCookie("theme");
  res.status(200).success({ message: "모든 쿠키가 삭제되었습니다!" });
});

app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/mypage/:userMissionId", isLogin, handleCreateMyPageReview);
app.post(
  "/api/v1/missions/:missionId/assign",
  isLogin,
  assignMission
);
app.post(
  "/api/v1/missions/:userMissionId/start",
  isLogin,
  startUserMission
);

app.get(
  "/api/v1/users/reviews",
  isLogin,
  handleListMyReviews
);
app.get(
  "/api/v1/users/missions/in-progress",
  isLogin,
  handleListMyInProgressMissions
);
app.post(
  "/api/v1/missions/:userMissionId/done",
  isLogin,
  completeUserMission
);
app.post(
  "/api/v1/stores/:storeId/missions",
  isLogin,
  createMissionForStore
);
app.get(
  "/api/v1/stores/:storeId/reviews",
  isLogin,
  handleListStoreReviews
);
app.get(
  "/api/v1/stores/:storeId/missions",
  isLogin,
  handleListStoreMissions
);

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
