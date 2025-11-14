import { prisma } from "../db.config.js";

export const findByUserAndMission = async (userId: number, missionId: number) => {
  return await prisma.userMission.findFirst({
    where: { userId, missionId },
    orderBy: { createdAt: "desc" },
  });
};

export const findById = async (userMissionId: number) => {
  return await prisma.userMission.findUnique({
    where: { userMissionId },
  });
};

interface UserMissionCreateData {
  userId: number;
  missionId: number;
  status?: string;
  createdAt?: Date;
}

export const create = async ({
  userId,
  missionId,
  status = "ASSIGNED",
  createdAt = new Date(),
}: UserMissionCreateData) => {
  return await prisma.userMission.create({
    data: { userId, missionId, status, createdAt },
  });
};

export const startIfAssigned = async ({
  userMissionId,
  userId,
}: {
  userMissionId: number;
  userId: number;
}): Promise<boolean> => {
  const updated = await prisma.userMission.updateMany({
    where: {
      userMissionId,
      userId,
      status: "ASSIGNED",
    },
    data: {
      status: "IN_PROGRESS",
      updatedAt: new Date(),
    },
  });
  return updated.count === 1;
};

export const getInProgressByUser = async (
  userId: number,
  cursor: number = 0,
  take: number = 10
) => {
  const limit = Math.max(1, Math.min(50, Number(take) || 10));
  return await prisma.userMission.findMany({
    select: {
      userMissionId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      mission: {
        select: {
          missionId: true,
          storeId: true,
          title: true,
          body: true,
          store: { select: { storeId: true, name: true } },
        },
      },
    },
    where: {
      userId,
      status: "IN_PROGRESS",
      userMissionId: { gt: cursor },
    },
    orderBy: { userMissionId: "asc" },
    take: limit,
  });
};

export const completeIfInProgress = async ({
  userMissionId,
  userId,
}: {
  userMissionId: number;
  userId: number;
}): Promise<boolean> => {
  const updated = await prisma.userMission.updateMany({
    where: { userMissionId, userId, status: "IN_PROGRESS" },
    data: { status: "DONE", updatedAt: new Date() },
  });
  return updated.count === 1;
};

export const getDetail = async (userMissionId: number) => {
  return await prisma.userMission.findUnique({
    where: { userMissionId },
    select: {
      userMissionId: true,
      userId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      mission: {
        select: {
          missionId: true,
          storeId: true,
          title: true,
          body: true,
          store: { select: { storeId: true, name: true } },
        },
      },
    },
  });
};