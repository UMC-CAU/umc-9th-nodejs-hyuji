import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { handleUserSignUp } from "./controllers/user.controller.js";
import {
  handleCreateMyPageReview,
  handleListStoreReviews,
  handleListMyReviews,
} from "./controllers/review.controller.js";
import {
  assignMission,
  startUserMission,
  createMissionForStore,
  handleListStoreMissions,
  handleListMyInProgressMissions,
  completeUserMission,
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
  }
}

const app: Express = express();
const port = process.env.PORT || 3000;

// ✅ 로깅 미들웨어 (morgan)
app.use(morgan("dev"));

// ✅ 쿠키 파싱 미들웨어
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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// ✅ 쿠키 테스트 라우터
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
app.get("/api/v1/users/:userId/missions/in-progress", handleListMyInProgressMissions);
app.post("/api/v1/missions/:userMissionId/done", completeUserMission);

// 전역 오류를 처리하기 위한 미들웨어
app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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