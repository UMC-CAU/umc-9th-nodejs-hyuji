import * as missionRepository from "../repositories/mission.repository.js";
import * as userMissionRepository from "../repositories/userMission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";

// 가게에 미션 추가
export const createMissionForStore = async (storeId, missionDto) => {
  if (!storeId) throw new Error("STORE_ID_REQUIRED");
  if (!missionDto.title) throw new Error("TITLE_REQUIRED");
  if (!missionDto.body) throw new Error("BODY_REQUIRED");

  const mission = await missionRepository.insertMissionForStore(storeId, {
    title: missionDto.title,
    body: missionDto.body,
  });

  return responseFromMission(mission);
};

// 미션 할당 (ASSIGNED 상태 생성)
export const assignMission = async ({ userId, missionId, storeId }) => {
  // 미션 유효성 검사
  const verdict = await missionRepository.checkAssignable({ missionId, storeId });
  if (!verdict.ok) throw new Error(verdict.reason);

  // 이미 할당된 미션인지 확인
  const existing = await userMissionRepository.findByUserAndMission(userId, missionId);
  if (existing) throw new Error("ALREADY_ASSIGNED");

  const created = await userMissionRepository.create({
    userId,
    missionId,
    status: "ASSIGNED",
    createdAt: new Date(),
  });

  return created;
};

// 미션 시작 (IN_PROGRESS 전환)
export const startUserMission = async ({ userMissionId, userId }) => {
  const userMission = await userMissionRepository.findById(userMissionId);

  if (!userMission || userMission.user_id !== userId) throw new Error("NOT_FOUND");
  if (userMission.status === "DONE") throw new Error("ALREADY_DONE");

  // 상태 전환
  const ok = await userMissionRepository.startIfAssigned({ userMissionId, userId });
  if (!ok) {
    const cur = await userMissionRepository.findById(userMissionId);
    if (cur?.status === "IN_PROGRESS") return cur; 
    throw new Error("INVALID_STATUS");
  }

  return await userMissionRepository.findById(userMissionId);
};
