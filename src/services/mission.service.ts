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

interface MissionDto {
  title?: string;
  body?: string;
}

export const createMissionForStore = async (
  storeId: number,
  missionDto: MissionDto
) => {
  if (!storeId) throw new Error("storeId가 필요합니다.");
  if (!missionDto.title) throw new Error("미션 제목이 필요합니다.");
  if (!missionDto.body) throw new Error("미션 내용이 필요합니다.");

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
  if (!verdict.ok) throw new Error(verdict.reason);

  const existing = await userMissionRepository.findByUserAndMission(
    userId,
    missionId
  );
  if (existing) throw new Error("이미 할당된 미션입니다.");

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
    throw new Error("NOT_FOUND");
  }

  if (userMission.userId !== userId) {
    throw new Error("UNAUTHORIZED");
  }

  if (userMission.status === "COMPLETED") {
    throw new Error("ALREADY_DONE");
  }
  if (userMission.status !== "ASSIGNED") {
    throw new Error("INVALID_STATUS");
  }

  const updated = await userMissionRepository.startIfAssigned({
    userMissionId,
    userId,
  });
  if (!updated) {
    throw new Error("UPDATE_FAILED");
  }

  return { message: "미션이 시작되었습니다." };
};

export const listStoreMissions = async (storeId: number, cursor: number = 0) => {
  if (!storeId) throw new Error("storeId가 필요합니다.");
  const missions = await missionRepository.getStoreMissions(storeId, cursor);
  return responseFromMissions(missions);
};

export const listInProgressUserMissions = async (
  userId: number,
  cursor: number = 0,
  limit: number = 10
) => {
  if (!userId) throw new Error("userId가 필요합니다.");
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
  if (!userMission) throw new Error("NOT_FOUND");

  if (userMission.userId !== userId) throw new Error("UNAUTHORIZED");

  const doneLike = ["DONE", "COMPLETED"];
  if (doneLike.includes(userMission.status)) throw new Error("ALREADY_DONE");
  if (userMission.status !== "IN_PROGRESS")
    throw new Error("INVALID_STATUS");

  const ok = await userMissionRepository.completeIfInProgress({
    userMissionId,
    userId,
  });
  if (!ok) throw new Error("UPDATE_FAILED");

  const detail = await userMissionRepository.getDetail(userMissionId);
  return responseFromUserMission(detail);
};