// import { prisma } from "../db.config.js";

// // 유저가 동일 미션을 이미 보유 중인지 확인
// export const findByUserAndMission = async (userId, missionId) => {
//   return await prisma.userMission.findFirst({
//     where: { userId, missionId },
//     orderBy: { createdAt: 'desc' }
//   });
// };

// export const findById = async (userMissionId) => {
//   return await prisma.userMission.findUnique({
//     where: { userMissionId }
//   });
// };

// // ASSIGNED 생성
// export const create = async ({ userId, missionId, status = "ASSIGNED", createdAt = new Date() }) => {
//   return await prisma.userMission.create({
//     data: { userId, missionId, status, createdAt }
//   });
// };

// // IN_PROGRESS 전환
// export const startIfAssigned = async ({ userMissionId, userId }) => {
//   const updated = await prisma.userMission.updateMany({
//     where: {
//       userMissionId,
//       userId,
//       status: 'ASSIGNED'
//     },
//     data: { 
//       status: 'IN_PROGRESS',
//       updatedAt: new Date()
//     }
//   });
//   return updated.count === 1;
// };

// // 진행 중(IN_PROGRESS) 미션 목록
// export const getInProgressByUser = async (userId, cursor = 0, take = 10) => {
//   const limit = Math.max(1, Math.min(50, Number(take) || 10));
//   return await prisma.userMission.findMany({
//     select: {
//       userMissionId: true,
//       status: true,
//       createdAt: true,
//       updatedAt: true,
//       mission: {
//         select: {
//           missionId: true,
//           storeId: true,
//           title: true,
//           body: true,
//           store: { select: { storeId: true, name: true } },
//         },
//       },
//     },
//     where: {
//       userId,
//       status: 'IN_PROGRESS',
//       userMissionId: { gt: cursor },
//     },
//     orderBy: { userMissionId: 'asc' },
//     take: limit,
//   });
// };

// // DONE 전환 (IN_PROGRESS -> DONE)
// export const completeIfInProgress = async ({ userMissionId, userId }) => {
//   const updated = await prisma.userMission.updateMany({
//     where: { userMissionId, userId, status: 'IN_PROGRESS' },
//     data: { status: 'DONE', updatedAt: new Date() }
//   });
//   return updated.count === 1;
// };

// // 단건 상세 조회(미션/가게 포함)
// export const getDetail = async (userMissionId) => {
//   return await prisma.userMission.findUnique({
//     where: { userMissionId },
//     select: {
//       userMissionId: true,
//       userId: true,
//       status: true,
//       createdAt: true,
//       updatedAt: true,
//       mission: {
//         select: {
//           missionId: true,
//           storeId: true,
//           title: true,
//           body: true,
//           store: { select: { storeId: true, name: true } },
//         },
//       },
//     },
//   });
// };