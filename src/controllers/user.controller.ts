import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req: Request, res: Response) => {
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);

    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).json({ result: user });
  } catch (err) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: `회원가입 중 오류: ${err instanceof Error ? err.message : "Unknown error"}`,
    });
  }
};