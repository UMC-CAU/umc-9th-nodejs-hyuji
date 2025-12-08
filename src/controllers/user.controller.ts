import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToUserUpdate } from "../dtos/user.dto.js";
import { userSignUp, updateMyInfo } from "../services/user.service.js";
import { InvalidParameterError } from "../errors.js";

export const handleUserSignUp = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '회원 가입 API'
    #swagger.tags = ['User']

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password"],
            properties: {
              email: {
                type: "string",
                format: "email",
                example: "test@example.com"
              },
              password: {
                type: "string",
                example: "test1234!"
              },
              name: {
                type: "string",
                nullable: true,
                example: "UMC 사용자"
              },
              gender: {
                type: "string",
                nullable: true,
                example: "여성"
              },
              birthday: {
                type: "string",
                format: "date",
                nullable: true,
                example: "2000-01-01"
              },
              address: {
                type: "string",
                nullable: true,
                example: "서울시 UMC구 챌린저동 화이팅아파트"
              },
              phone: {
                type: "string",
                nullable: true,
                example: "010-1234-5678"
              },
              areaId: {
                type: "integer",
                nullable: true,
                example: 1
              },
              preferences: {
                type: "array",
                nullable: true,
                items: { type: "integer", example: 1 },
                example: [1, 2]
              }
            }
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "회원 가입 성공 응답",
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
                  email: {
                    type: "string",
                    nullable: true,
                    example: "test@example.com"
                  },
                  name: {
                    type: "string",
                    nullable: true,
                    example: "UMC 사용자"
                  },
                  preferCategory: {
                    type: "array",
                    items: { type: "string" },
                    example: ["한식", "치킨"]
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "회원 가입 실패 응답 (이메일 중복)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "U001",
              reason: "이미 존재하는 이메일입니다.",
              data: { email: "test@example.com" }
            },
            success: null
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "회원 가입 실패 응답 (검증 실패)",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" },
          example: {
            resultType: "FAIL",
            error: {
              errorCode: "VALIDATION_ERROR",
              reason: "이메일은 필수입니다.",
              data: null
            },
            success: null
          }
        }
      }
    }
  */
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);

    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.CREATED).success(user);
  } catch (err) {
    const error = err as any;
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "SIGNUP_FAILED",
      reason: error.reason || error.message || "Unknown error",
      data: error.data || null,
    });
  }
};

export const handleUpdateMyInfo = async (req: Request, res: Response) => {
  /*
    #swagger.summary = '내 정보 수정 API'
    #swagger.tags = ['User']
    #swagger.description = '로그인한 사용자가 자신의 프로필 정보를 수정합니다.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "UMC 사용자" },
              gender: { type: "string", example: "여성" },
              birthday: { type: "string", example: "2000-01-01" },
              address: { type: "string", example: "서울시 동작구 흑석동" },
              phone: { type: "string", example: "010-1234-5678" },
              areaId: { type: "integer", example: 1 },
              preferences: {
                type: "array",
                items: { type: "integer" },
                example: [1, 2, 3]
              }
            }
          }
        }
      }
    }

    #swagger.responses[200] = {
      description: "내 정보 수정 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                $ref: "#/components/schemas/UserResponse"
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "내 정보 수정 실패",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CommonErrorResponse" }
        }
      }
    }
  */

  try {
    const authUser = (req as any).user;
    const userId = authUser?.userId ?? authUser?.id;

    if (!userId) {
      throw new InvalidParameterError("인증된 사용자 정보가 필요합니다.");
    }

    const updated = await updateMyInfo(userId, bodyToUserUpdate(req.body));
    res.status(StatusCodes.OK).success(updated);
  } catch (err) {
    const error = err as any;
    res.status(StatusCodes.BAD_REQUEST).error({
      errorCode: error.errorCode || "USER_UPDATE_FAILED",
      reason: error.reason || error.message || "Unknown error",
      data: error.data || null,
    });
  }
};
