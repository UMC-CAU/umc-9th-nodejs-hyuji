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