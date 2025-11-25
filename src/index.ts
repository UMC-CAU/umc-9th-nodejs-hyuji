import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
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

/* 
  #swagger.components = {
    schemas: {
      CommonErrorResponse: {
        $resultType: "FAIL",
        error: {
          $errorCode: "ERROR_CODE",
          reason: "에러 사유 메시지입니다.",
          data: null
        },
        success: null
      }
    }
  }
*/


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

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
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
        // 공통 에러 스키마
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

        // --- User 관련 ---
        UserSignUpSuccess: {
          type: "object",
          properties: {
            email: { type: "string", example: "test@example.com" },
            name: { type: "string", nullable: true, example: "UMC 사용자" },
            preferCategory: {
              type: "array",
              items: { type: "string" },
              example: ["한식", "치킨"],
            },
          },
        },

        // --- Review 관련 ---
        ReviewItem: {
          type: "object",
          properties: {
            reviewId: { type: "integer", example: 1 },
            body: { type: "string", example: "맛있어요!" },
            userMissionId: { type: "integer", example: 4 },
            createdAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            userMission: {
              type: "object",
              properties: {
                userId: { type: "integer", example: 4 },
                user: {
                  type: "object",
                  properties: {
                    userId: { type: "integer", example: 4 },
                    nickname: { type: "string", example: "유저4" },
                    name: { type: "string", example: "사용자4" },
                  },
                },
                mission: {
                  type: "object",
                  properties: {
                    missionId: { type: "integer", example: 1 },
                    storeId: { type: "integer", example: 1 },
                    store: {
                      type: "object",
                      properties: {
                        storeId: { type: "integer", example: 1 },
                        name: { type: "string", example: "흑석 고기집" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ReviewListSuccess: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/ReviewItem" },
            },
            pagination: {
              type: "object",
              properties: {
                cursor: {
                  type: "integer",
                  nullable: true,
                  example: 10,
                },
              },
            },
          },
        },
        ReviewCreateSuccess: {
          type: "object",
          properties: {
            reviewId: { type: "integer", example: 1 },
            body: { type: "string", example: "맛있어요!" },
            userMissionId: { type: "integer", example: 4 },
            createdAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
        },

        // --- Mission / UserMission 관련 ---
        Mission: {
          type: "object",
          properties: {
            missionId: { type: "integer", example: 1 },
            storeId: { type: "integer", example: 1 },
            title: { type: "string", example: "리뷰 작성 미션" },
            body: {
              type: "string",
              nullable: true,
              example: "해당 가게 리뷰를 작성하면 포인트 지급",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
        },
        MissionListSuccess: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Mission" },
            },
            pagination: {
              type: "object",
              properties: {
                cursor: {
                  type: "integer",
                  nullable: true,
                  example: 10,
                },
              },
            },
          },
        },

        UserMission: {
          type: "object",
          properties: {
            userMissionId: { type: "integer", example: 1 },
            userId: { type: "integer", example: 1 },
            missionId: { type: "integer", example: 1 },
            areaId: { type: "integer", nullable: true, example: 1 },
            status: {
              type: "string",
              example: "IN_PROGRESS",
              description: "READY / IN_PROGRESS / DONE",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
        },
        UserMissionListSuccess: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/UserMission" },
            },
            pagination: {
              type: "object",
              properties: {
                cursor: {
                  type: "integer",
                  nullable: true,
                  example: 10,
                },
              },
            },
          },
        },
        UserMissionDetailSuccess: {
          $ref: "#/components/schemas/UserMission",
        },

        SimpleMessageSuccess: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "미션이 시작되었습니다.",
            },
          },
        },
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
app.get("/api/v1/users/:userId/missions/in-progress", handleListMyInProgressMissions);
app.post("/api/v1/missions/:userMissionId/done", completeUserMission);

// 전역 오류를 처리하기 위한 미들웨어
app.use((err, req, res, next) => {
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