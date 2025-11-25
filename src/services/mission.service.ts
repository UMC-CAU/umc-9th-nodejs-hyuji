import {
  responseFromMission,
  responseFromMissions,
} from "../dtos/mission.dto.js";
import * as missionRepository from "../repositories/mission.repository.js";
import * as userMissionRepository from "../repositories/userMission.repository.js";
import {
  responseFromUserMissions,
  responseFromUserMission,
} from "../dtos/userMission.dto.js";
import {
  ValidationError,
  MissionNotFoundError,
  AlreadyAssignedError,
  StoreMismatchError,
  UserMissionNotFoundError,
  UnauthorizedError,
  InvalidStatusError,
} from "../errors.js";

interface MissionDto {
  title?: string;
  body?: string;
}

export const createMissionForStore = async (
  storeId: number,
  missionDto: MissionDto
) => {
  if (!storeId) throw new ValidationError("storeId가 필요합니다.");
  if (!missionDto.title) throw new ValidationError("미션 제목이 필요합니다.");
  if (!missionDto.body) throw new ValidationError("미션 내용이 필요합니다.");

  try {
    const mission = await missionRepository.insertMissionForStore(storeId, {
      title: missionDto.title,
      body: missionDto.body,
    });
    return responseFromMission(mission);
  } catch (err) {
    throw new Error(
      `미션 생성 실패: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
};

interface AssignData {
  userId: number;
  missionId: number;
  storeId?: number;
}

export const assignMission = async ({ userId, missionId, storeId }: AssignData) => {
  const verdict = await missionRepository.checkAssignable({
    missionId,
    storeId,
  });

  if (!verdict.ok) {
    if (verdict.reason === "MISSION_NOT_FOUND") {
      throw new MissionNotFoundError("존재하지 않는 미션입니다.");
    }
    if (verdict.reason === "STORE_MISMATCH") {
      throw new StoreMismatchError();
    }
  }

  const existing = await userMissionRepository.findByUserAndMission(
    userId,
    missionId
  );
  if (existing) throw new AlreadyAssignedError();

  const created = await userMissionRepository.create({
    userId,
    missionId,
    status: "ASSIGNED",
    createdAt: new Date(),
  });

  return created;
};

interface StartData {
  userMissionId: number;
  userId: number;
}

export const startUserMission = async ({ userMissionId, userId }: StartData) => {
  const userMission = await userMissionRepository.findById(userMissionId);
  
  if (!userMission) {
    throw new UserMissionNotFoundError();
  }

  if (userMission.userId !== userId) {
    throw new UnauthorizedError();
  }

  if (userMission.status === "DONE" || userMission.status === "COMPLETED") {
    throw new InvalidStatusError("이미 완료된 미션입니다.");
  }
  
  if (userMission.status !== "ASSIGNED") {
    throw new InvalidStatusError("시작할 수 없는 상태의 미션입니다.");
  }

  const updated = await userMissionRepository.startIfAssigned({
    userMissionId,
    userId,
  });
  
  if (!updated) {
    throw new ValidationError("미션 시작 처리에 실패했습니다.");
  }

  return { message: "미션이 시작되었습니다." };
};

export const listStoreMissions = async (storeId: number, cursor: number = 0) => {
  if (!storeId) throw new ValidationError("storeId가 필요합니다.");
  const missions = await missionRepository.getStoreMissions(storeId, cursor);
  return responseFromMissions(missions);
};

export const listInProgressUserMissions = async (
  userId: number,
  cursor: number = 0,
  limit: number = 10
) => {
  if (!userId) throw new ValidationError("userId가 필요합니다.");
  const rows = await userMissionRepository.getInProgressByUser(
    userId,
    cursor,
    limit
  );
  return responseFromUserMissions(rows);
};

interface CompleteData {
  userMissionId: number;
  userId: number;
}

export const completeUserMission = async ({
  userMissionId,
  userId,
}: CompleteData) => {
  const userMission = await userMissionRepository.findById(userMissionId);
  
  if (!userMission) throw new UserMissionNotFoundError();

  if (userMission.userId !== userId) throw new UnauthorizedError();

  const doneLike = ["DONE"];
  if (doneLike.includes(userMission.status)) {
    throw new InvalidStatusError("이미 완료된 미션입니다.");
  }
  
  if (userMission.status !== "IN_PROGRESS") {
    throw new InvalidStatusError("완료할 수 없는 상태의 미션입니다.");
  }

  const ok = await userMissionRepository.completeIfInProgress({
    userMissionId,
    userId,
  });
  
  if (!ok) throw new ValidationError("미션 완료 처리에 실패했습니다.");

  const detail = await userMissionRepository.getDetail(userMissionId);
  return responseFromUserMission(detail);
};