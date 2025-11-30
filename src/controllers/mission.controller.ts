import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as missionService from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { InvalidParameterError } from "../errors.js";

export const createMissionForStore = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '가게 미션 생성 API'
    #swagger.tags = ['Mission']

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: '미션을 생성할 가게 ID'
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["title", "body"],
            properties: {
              title: { type: "string", example: "첫 방문 리뷰 남기기" },
              body: { type: "string", example: "흑석 고기집에 방문 후 리뷰를 작성하면 포인트를 드립니다." }
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "가게 미션 생성 성공 응답",
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
                  id: { type: "integer", example: 1 },
                  storeId: { type: "integer", example: 1 },
                  title: { type: "string", example: "첫 방문 리뷰 남기기" },
                  body: { type: "string", example: "흑석 고기집에 방문 후 리뷰를 작성하면 포인트를 드립니다." },
                  createdAt: { type: "string", format: "date-time", nullable: true },
                  updatedAt: { type: "string", format: "date-time", nullable: true }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "가게 미션 생성 실패 응답 (검증 실패)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "VALIDATION_ERROR",
              reason: "미션 제목이 필요합니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */
  try {
    const storeId = parseInt(req.params.storeId);
    if (!storeId)
      throw new InvalidParameterError("storeId path param required.");

    const created = await missionService.createMissionForStore(
      storeId,
      bodyToMission(req.body)
    );
    return res.status(StatusCodes.CREATED).success(created);
  } catch (err) {
    const error = err as any;
    return res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "MISSION_CREATE_FAILED",
      reason: error.reason || error.message || "Unknown error",
      data: error.data || null,
    });
  }
};

export const assignMission = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '미션 할당 API'
    #swagger.tags = ['Mission']

    #swagger.parameters['missionId'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: '할당할 미션 ID'
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "integer", nullable: true, example: 1 },
              storeId: { type: "integer", nullable: true, example: 1 }
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "미션 할당 성공 응답",
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
                  userMissionId: { type: "integer", example: 10 },
                  userId: { type: "integer", example: 1 },
                  missionId: { type: "integer", example: 1 },
                  status: { type: "string", example: "ASSIGNED" },
                  createdAt: { type: "string", format: "date-time", nullable: true },
                  updatedAt: { type: "string", format: "date-time", nullable: true }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "미션 할당 실패 (존재하지 않는 미션 – M001)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "M001",
              reason: "존재하지 않는 미션입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "미션 할당 실패 (이미 할당되었거나 가게 불일치 – M002/M003)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          examples: {
            alreadyAssigned: {
              value: {
                resultType: "FAIL",
                error: {
                  errorCode: "M002",
                  reason: "이미 할당된 미션입니다.",
                  data: null
                },
                success: null
              }
            },
            storeMismatch: {
              value: {
                resultType: "FAIL",
                error: {
                  errorCode: "M003",
                  reason: "이 미션은 해당 매장과 일치하지 않습니다.",
                  data: null
                },
                success: null
              }
            }
          }
        }
      }
    }
  */
  try {
    const missionId = Number(req.params.missionId);
    const userId = (req as any).user?.id ?? req.body.userId ?? 1;
    const { storeId } = req.body;

    const result = await missionService.assignMission({
      userId,
      missionId,
      storeId,
    });
    return res.status(StatusCodes.CREATED).success(result);
  } catch (error) {
    const err = error as any;
    const statusMap: Record<string, number> = {
      M001: StatusCodes.NOT_FOUND,
      M003: StatusCodes.CONFLICT,
      M002: StatusCodes.CONFLICT,
    };
    const statusCode = statusMap[err.errorCode] || StatusCodes.BAD_REQUEST;
    return res.status(statusCode).error({
      errorCode: err.errorCode || "MISSION_ASSIGN_FAILED",
      reason: err.reason || err.message || "Unknown error",
      data: err.data || null,
    });
  }
};

export const startUserMission = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '미션 시작 API'
    #swagger.tags = ['Mission']

    #swagger.parameters['userMissionId'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: '시작할 userMission ID'
    }

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: { type: "integer", nullable: true, example: 1 }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "미션 시작 성공 응답",
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
                  message: { type: "string", example: "미션이 시작되었습니다." }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "미션 시작 실패 (존재하지 않는 userMission – UM001)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "UM001",
              reason: "사용자 미션을 찾을 수 없습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[403] = {
      description: "미션 시작 실패 (권한 없음 – AUTH001)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "AUTH001",
              reason: "권한이 없습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "미션 시작 실패 (이미 완료되었거나 시작 불가 상태 – STATUS001)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "STATUS001",
              reason: "이미 완료된 미션입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */
  try {
    const userMissionId = Number(req.params.userMissionId);
    const userId = (req as any).user?.id ?? req.body.userId ?? 1;

    const result = await missionService.startUserMission({
      userMissionId,
      userId,
    });
    return res.status(StatusCodes.OK).success(result);
  } catch (error) {
    const err = error as any;
    const statusMap: Record<string, number> = {
      UM001: StatusCodes.NOT_FOUND,
      STATUS001: StatusCodes.CONFLICT,
      AUTH001: StatusCodes.FORBIDDEN,
    };
    const statusCode = statusMap[err.errorCode] || StatusCodes.BAD_REQUEST;
    return res.status(statusCode).error({
      errorCode: err.errorCode || "MISSION_START_FAILED",
      reason: err.reason || err.message || "Unknown error",
      data: err.data || null,
    });
  }
};

export const handleListStoreMissions = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '가게 미션 목록 조회 API'
    #swagger.tags = ['Mission']

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: '미션을 조회할 가게 ID'
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      schema: { type: 'integer' },
      description: '페이징을 위한 마지막 미션 ID'
    }

    #swagger.responses[200] = {
      description: "가게 미션 목록 조회 성공 응답",
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
                        missionId: { type: "integer", example: 1 },
                        storeId: { type: "integer", example: 1 },
                        title: { type: "string", example: "리뷰 작성 미션" },
                        body: { type: "string", nullable: true, example: "해당 가게 리뷰를 작성하면 포인트 지급" },
                        createdAt: { type: "string", format: "date-time", nullable: true },
                        updatedAt: { type: "string", format: "date-time", nullable: true }
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
      description: "가게 미션 목록 조회 실패 (잘못된 storeId)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "INVALID_PARAMS" },
                  reason: { type: "string", example: "storeId path param required." },
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
    const storeId = parseInt(req.params.storeId);
    if (!storeId)
      throw new InvalidParameterError("storeId path param required.");

    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const result = await missionService.listStoreMissions(storeId, cursor);
    return res.status(StatusCodes.OK).success(result);
  } catch (err) {
    const error = err as any;
    return res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "MISSION_LIST_FAILED",
      reason: error.reason || error.message || "Unknown error",
      data: error.data || null,
    });
  }
};

export const handleListMyInProgressMissions = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '사용자 진행 중 미션 목록 조회 API'
    #swagger.tags = ['Mission']

    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: '진행 중 미션을 조회할 사용자 ID'
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      schema: { type: 'integer' },
      description: '페이징을 위한 마지막 userMission ID'
    }

    #swagger.parameters['limit'] = {
      in: 'query',
      required: false,
      schema: { type: 'integer', default: 10 },
      description: '한 번에 조회할 미션 개수'
    }

    #swagger.responses[200] = {
      description: "사용자 진행 중 미션 목록 조회 성공 응답",
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
                        userMissionId: { type: "integer", example: 1 },
                        userId: { type: "integer", example: 1 },
                        missionId: { type: "integer", example: 1 },
                        areaId: { type: "integer", nullable: true, example: 1 },
                        status: { type: "string", example: "IN_PROGRESS", description: "READY / IN_PROGRESS / DONE" },
                        createdAt: { type: "string", format: "date-time", nullable: true },
                        updatedAt: { type: "string", format: "date-time", nullable: true }
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
      description: "사용자 진행 중 미션 목록 조회 실패",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "IN_PROGRESS_MISSIONS_LIST_FAILED" },
                  reason: { type: "string", example: "진행 중인 미션 목록 조회에 실패했습니다." },
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
    const userId =
      Number(req.params.userId) || ((req as any).user?.id ?? 1);
    const cursor =
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;
    const limit =
      typeof req.query.limit === "string" ? parseInt(req.query.limit) : 10;

    const result = await missionService.listInProgressUserMissions(
      userId,
      cursor,
      limit
    );
    return res.status(StatusCodes.OK).success(result);
  } catch (err) {
    const error = err as any;
    return res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "IN_PROGRESS_MISSIONS_LIST_FAILED",
      reason: error.reason || error.message || "Unknown error",
      data: error.data || null,
    });
  }
};

export const completeUserMission = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '사용자 미션 완료 처리 API'
    #swagger.tags = ['Mission']

    #swagger.parameters['userMissionId'] = {
      in: 'path',
      required: true,
      schema: { type: 'integer' },
      description: '완료 처리할 userMission ID'
    }

    #swagger.requestBody = {
      required: false,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: {
                type: "integer",
                nullable: true,
                example: 1,
                description: "미션을 완료할 사용자 ID"
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "사용자 미션 완료 성공 응답",
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
                  userMissionId: { type: "integer", example: 10 },
                  userId: { type: "integer", example: 1 },
                  missionId: { type: "integer", example: 1 },
                  status: { type: "string", example: "DONE" },
                  createdAt: { type: "string", format: "date-time", nullable: true },
                  updatedAt: { type: "string", format: "date-time", nullable: true }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "사용자 미션 완료 실패 응답 (잘못된 요청/검증 실패 등)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "VALIDATION_ERROR",
              reason: "미션 완료 처리에 실패했습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[403] = {
      description: "사용자 미션 완료 실패 응답 (권한 없음 – AUTH001)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "AUTH001",
              reason: "권한이 없습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "사용자 미션 완료 실패 응답 (존재하지 않는 userMission – UM001)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "UM001",
              reason: "사용자 미션을 찾을 수 없습니다.",
              data: null
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "사용자 미션 완료 실패 응답 (이미 완료된 미션 등 상태 오류 – STATUS001)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "STATUS001",
              reason: "이미 완료된 미션입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */
 
  try {
    const userMissionId = Number(req.params.userMissionId);
    const userId = (req as any).user?.id ?? req.body.userId ?? 1;

    const result = await missionService.completeUserMission({
      userMissionId,
      userId,
    });
    return res.status(StatusCodes.OK).success(result);
  } catch (error) {
    const err = error as any;
    const statusMap: Record<string, number> = {
      UM001: StatusCodes.NOT_FOUND,
      STATUS001: StatusCodes.CONFLICT,
      AUTH001: StatusCodes.FORBIDDEN,
    };
    const statusCode = statusMap[err.errorCode] || StatusCodes.BAD_REQUEST;
    return res.status(statusCode).error({
      errorCode: err.errorCode || "MISSION_COMPLETE_FAILED",
      reason: err.reason || err.message || "Unknown error",
      data: err.data || null,
    });
  }
};