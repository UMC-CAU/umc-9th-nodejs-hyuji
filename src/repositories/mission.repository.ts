import { prisma } from "../db.config.js";

interface MissionCreateData {
  title: string;
  body: string;
}

export const findById = async (missionId: number) => {
  return await prisma.mission.findUnique({
    where: { missionId },
  });
};

export const insertMissionForStore = async (
  storeId: number,
  { title, body }: MissionCreateData
) => {
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
    throw new Error(
      `DB 오류: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }
};

interface CheckResult {
  ok: boolean;
  reason?: string;
  mission?: any;
}

export const checkAssignable = async ({
  missionId,
  storeId,
}: {
  missionId: number;
  storeId?: number;
}): Promise<CheckResult> => {
  const mission = await prisma.mission.findUnique({
    where: { missionId },
  });

  if (!mission) return { ok: false, reason: "MISSION_NOT_FOUND" };
  if (storeId && mission.storeId !== storeId) {
    return { ok: false, reason: "STORE_MISMATCH" };
  }
  return { ok: true, mission };
};

export const getStoreMissions = async (
  storeId: number,
  cursor: number = 0
) => {
  const limit = 10;

  return await prisma.mission.findMany({
    select: {
      missionId: true,
      storeId: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
    },
    where: {
      storeId,
      missionId: { gt: cursor },
    },
    orderBy: { missionId: "asc" },
    take: limit,
  });
};