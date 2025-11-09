import { prisma } from "../db.config.js";

// 유저가 동일 미션을 이미 보유 중인지 확인
export const findByUserAndMission = async (userId, missionId) => {
  return await prisma.userMission.findFirst({
    where: { userId, missionId },
    orderBy: { createdAt: 'desc' }
  });
};

export const findById = async (userMissionId) => {
  return await prisma.userMission.findUnique({
    where: { userMissionId }
  });
};

// ASSIGNED 생성
export const create = async ({ userId, missionId, status = "ASSIGNED", createdAt = new Date() }) => {
  return await prisma.userMission.create({
    data: { userId, missionId, status, createdAt }
  });
};

// IN_PROGRESS 전환
export const startIfAssigned = async ({ userMissionId, userId }) => {
  const updated = await prisma.userMission.updateMany({
    where: {
      userMissionId,
      userId,
      status: 'ASSIGNED'
    },
    data: { 
      status: 'IN_PROGRESS',
      updatedAt: new Date()
    }
  });
  return updated.count === 1;
};
