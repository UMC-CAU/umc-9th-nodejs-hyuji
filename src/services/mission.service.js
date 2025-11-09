import { responseFromMission, responseFromMissions } from "../dtos/mission.dto.js";
import * as missionRepository from "../repositories/mission.repository.js";
import * as userMissionRepository from "../repositories/userMission.repository.js";

// 가게에 미션 추가
export const createMissionForStore = async (storeId, missionDto) => {
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
    throw new Error(`미션 생성 실패: ${err.message}`);
  }
};

// 미션 할당 (ASSIGNED 상태 생성)
export const assignMission = async ({ userId, missionId, storeId }) => {
  // 미션 유효성 검사
  const verdict = await missionRepository.checkAssignable({ missionId, storeId });
  if (!verdict.ok) throw new Error(verdict.message);

  // 이미 할당된 미션인지 확인
  const existing = await userMissionRepository.findByUserAndMission(userId, missionId);
  if (existing) throw new Error("이미 할당된 미션입니다.");

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
  // 유저 미션 존재 여부 확인
  const userMission = await userMissionRepository.findById(userMissionId);
  if (!userMission) {
    throw new Error("NOT_FOUND");
  }

  // 유저 권한 확인
  if (userMission.userId !== userId) {
    throw new Error("UNAUTHORIZED");
  }

  // 미션 상태 확인
  if (userMission.status === 'COMPLETED') {
    throw new Error("ALREADY_DONE");
  }
  if (userMission.status !== 'ASSIGNED') {
    throw new Error("INVALID_STATUS");
  }

  // 상태 업데이트
  const updated = await userMissionRepository.startIfAssigned({ userMissionId, userId });
  if (!updated) {
    throw new Error("UPDATE_FAILED");
  }

  return { message: "미션이 시작되었습니다." };
};

// 특정 가게 미션 목록
export const listStoreMissions = async (storeId, cursor = 0, limit = 10) => {
  if (!storeId) throw new Error("storeId가 필요합니다.");
  const missions = await missionRepository.getStoreMissions(storeId, cursor, limit);
  return responseFromMissions(missions);
};