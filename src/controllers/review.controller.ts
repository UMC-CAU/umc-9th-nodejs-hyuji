import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import {
  createReviewByUserMissionId,
  listStoreReviews,
  listUserReviews,
} from "../services/review.service.js";
import { InvalidParameterError } from "../errors.js";

const resolveUserId = (req: Request): number => {
  const authUser = (req as any).user;
  const authUserId =
    typeof authUser?.userId === "number" ? authUser.userId : authUser?.id;

  if (typeof authUserId === "number" && !Number.isNaN(authUserId)) {
    return authUserId;
  }

  throw new InvalidParameterError("인증된 사용자 정보가 필요합니다.");
};

export const handleCreateMyPageReview = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '마이페이지 리뷰 작성 API'
    #swagger.tags = ['Review']

    #swagger.parameters['userMissionId'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: '리뷰를 작성할 userMission ID'
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["content", "score"],
            properties: {
              content: { type: "string", example: "너무 맛있었어요!" },
              score: { type: "number", example: 4.5 },
              images: {
                type: "array",
                nullable: true,
                items: { type: "string", format: "uri" },
                example: ["https://example.com/review1.jpg"]
              }
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "리뷰 작성 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  reviewId: { type: "integer", example: 1 },
                  body: { type: "string", example: "너무 맛있었어요!" },
                  score: { type: "number", example: 4.5 },
                  userMissionId: { type: "integer", example: 4 },
                  createdAt: { type: "string", format: "date-time", nullable: true },
                  updatedAt: { type: "string", format: "date-time", nullable: true },
                  images: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        reviewImageId: { type: "integer", example: 1 },
                        pictureUrl: { type: "string", example: "https://example.com/review1.jpg" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "리뷰 작성 실패 응답 (검증 실패)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "VALIDATION_ERROR" },
                  reason: { type: "string", example: "content와 score는 필수입니다." },
                  data: { nullable: true, example: null }
                }
              },
              success: { nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "리뷰 작성 실패 (이미 리뷰가 존재 – R001)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R001" },
                  reason: { type: "string", example: "이미 해당 userMission에 대한 리뷰가 존재합니다." },
                  data: { nullable: true, example: null }
                }
              },
              success: { nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const userMissionId = Number(req.params.userMissionId);
    if (!userMissionId)
      throw new InvalidParameterError("userMissionId path param required.");

    const created = await createReviewByUserMissionId(
      userMissionId,
      bodyToReview(req.body)
    );
    return res.status(StatusCodes.CREATED).success(created);
  } catch (err) {
    const error = err as any;
    const statusMap: Record<string, number> = {
      R001: StatusCodes.CONFLICT,
      INVALID_PARAMS: StatusCodes.BAD_REQUEST,
      VALIDATION_ERROR: StatusCodes.BAD_REQUEST,
    };
    const statusCode = statusMap[error.errorCode] || StatusCodes.BAD_REQUEST;
    return res.status(statusCode).error({
      errorCode: error.errorCode || "REVIEW_CREATE_FAILED",
      reason: error.reason || error.message || "Unknown error",
      data: error.data || null,
    });
  }
};

export const handleListStoreReviews = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API'
    #swagger.tags = ['Review']

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: '리뷰를 조회할 상점 ID'
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      schema: { type: 'integer' },
      description: '페이징을 위한 마지막 리뷰 ID'
    }

    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        reviewId: { type: "integer", example: 1 },
                        body: { type: "string", example: "흑석 고기집 후기 - 맛있어요!" },
                        score: { type: "number", example: 4.5 },
                        userMissionId: { type: "integer", example: 4 },
                        createdAt: { type: "string", format: "date-time", nullable: true },
                        updatedAt: { type: "string", format: "date-time", nullable: true },
                        images: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              reviewImageId: { type: "integer", example: 1 },
                              pictureUrl: { type: "string", example: "https://example.com/review1.jpg" }
                            }
                          }
                        },
                        user: {
                          type: "object",
                          properties: {
                            userId: { type: "integer", example: 1 },
                            nickname: { type: "string", example: "배달러" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "integer", nullable: true, example: 10 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "상점 리뷰 목록 조회 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "STORE_REVIEWS_LIST_FAILED" },
                  reason: { type: "string", example: "리뷰 조회에 실패했습니다." },
                  data: { nullable: true, example: null }
                }
              },
              success: { nullable: true, example: null }
            }
          }
        }
      }
    }
  */

  try {
    const storeId = Number(req.params.storeId);
    if (!storeId)
      throw new InvalidParameterError("storeId path param required.");

    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);
    return res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    const error = err as any;
    return res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "STORE_REVIEWS_LIST_FAILED",
      reason: error.reason || error.message || "Unknown error",
      data: error.data || null,
    });
  }
};

export const handleListMyReviews = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '내 리뷰 목록 조회 API'
    #swagger.description = '로그인한 사용자의 리뷰 목록을 조회합니다.'
    #swagger.tags = ['Review']

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      schema: { type: 'integer' },
      description: '페이징을 위한 마지막 리뷰 ID'
    }

    #swagger.responses[200] = {
      description: "내 리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        reviewId: { type: "integer", example: 1 },
                        body: { type: "string", example: "흑석 고기집 후기 - 맛있어요!" },
                        score: { type: "number", example: 4.5 },
                        userMissionId: { type: "integer", example: 4 },
                        createdAt: { type: "string", format: "date-time", nullable: true },
                        updatedAt: { type: "string", format: "date-time", nullable: true },
                        store: {
                          type: "object",
                          properties: {
                            storeId: { type: "integer", example: 1 },
                            name: { type: "string", example: "흑석 고기집" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "integer", nullable: true, example: 10 }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "내 리뷰 목록 조회 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "USER_REVIEWS_LIST_FAILED" },
                  reason: { type: "string", example: "리뷰 조회에 실패했습니다." },
                  data: { nullable: true, example: null }
                }
              },
              success: { nullable: true, example: null }
            }
          }
        }
      }
    }
  */

  try {
    const userId = resolveUserId(req);
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listUserReviews(userId, cursor);
    return res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    const error = err as any;
    return res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "USER_REVIEWS_LIST_FAILED",
      reason: error.reason || error.message || "Unknown error",
      data: error.data || null,
    });
  }
};
