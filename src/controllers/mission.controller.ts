import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as missionService from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { InvalidParameterError } from "../errors.js";

export const createMissionForStore = async (req: Request, res: Response) => {
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

export const handleListMyInProgressMissions = async (
  req: Request,
  res: Response
) => {
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