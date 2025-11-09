import { prisma } from "../db.config.js";

// 미션 조회
export const findById = async (missionId) => {
  return await prisma.mission.findUnique({
    where: { missionId },
  });
};

// 가게에 미션 추가
export const insertMissionForStore = async (storeId, { title, body }) => {
  try {
    const mission = await prisma.mission.create({
      data: {
        storeId,
        title,
        body,
      },
      select: {
        missionId: true,
        storeId: true,
        title: true,
        body: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return mission;
  } catch (err) {
    throw new Error(`DB 오류: ${err.message}`);
  }
};

// 할당 가능 여부
export const checkAssignable = async ({ missionId, storeId }) => {
  const mission = await prisma.mission.findUnique({
    where: { missionId },
  });

  if (!mission) return { ok: false, reason: "MISSION_NOT_FOUND" };
  if (storeId && mission.storeId !== storeId) {
    return { ok: false, reason: "STORE_MISMATCH" };
  }
  return { ok: true, mission };
};
