import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import {
  createReviewByUserMissionId,
  listStoreReviews,
  listUserReviews,
} from "../services/review.service.js";
import { InvalidParameterError } from "../errors.js";

export const handleCreateMyPageReview = async (req: Request, res: Response) => {
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
      required: true
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false
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
                        body: {
                          type: "string",
                          example: "흑석 고기집 후기 - 맛있어요!"
                        },
                        score: { type: "number", example: 4.5 },
                        userMissionId: { type: "integer", example: 4 },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          example: "2025-11-09T08:28:11.795Z"
                        },
                        updatedAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          example: "2025-11-09T08:28:11.795Z"
                        },
                        userMission: {
                          type: "object",
                          nullable: true,
                          properties: {
                            userId: { type: "integer", example: 4 },
                            user: {
                              type: "object",
                              nullable: true,
                              properties: {
                                userId: { type: "integer", example: 4 },
                                nickname: {
                                  type: "string",
                                  nullable: true,
                                  example: "유저4"
                                },
                                name: {
                                  type: "string",
                                  nullable: true,
                                  example: "사용자4"
                                }
                              }
                            },
                            mission: {
                              type: "object",
                              nullable: true,
                              properties: {
                                missionId: { type: "integer", example: 1 },
                                storeId: { type: "integer", example: 1 },
                                store: {
                                  type: "object",
                                  nullable: true,
                                  properties: {
                                    storeId: {
                                      type: "integer",
                                      example: 1
                                    },
                                    name: {
                                      type: "string",
                                      example: "흑석 고기집"
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: {
                        type: "integer",
                        nullable: true,
                        example: 10,
                        description:
                          "다음 페이지 조회를 위한 마지막 리뷰 ID (더 없으면 null)"
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
      description: "상점 리뷰 목록 조회 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    example: "STORE_REVIEWS_LIST_FAILED"
                  },
                  reason: {
                    type: "string",
                    nullable: true,
                    example: "유효하지 않은 storeId 입니다."
                  },
                  data: { nullable: true }
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
    const storeId = parseInt(req.params.storeId);
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
  try {
    const userId = Number(req.params.userId) || ((req as any).user?.id ?? 1);
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