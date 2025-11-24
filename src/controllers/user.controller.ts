import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

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