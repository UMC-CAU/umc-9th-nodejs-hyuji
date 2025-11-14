// import { prisma } from "../db.config.js";

// export const insertReview = async ({ body, score, userMissionId }) => {
//   const exist = await prisma.review.findFirst({
//     where: { userMissionId }
//   });
  
//   if (exist) {
//     const err = new Error("이미 해당 userMission에 대한 리뷰가 존재합니다.");
//     err.code = "REVIEW_EXISTS";
//     throw err;
//   }

//   const created = await prisma.review.create({
//     data: { 
//       body,       
//       score,
//       userMissionId
//     }
//   });
//   return created.reviewId;
// };

// export const insertReviewImages = async (reviewId, imageUrls = []) => {
//   if (!Array.isArray(imageUrls) || imageUrls.length === 0) return [];

//   await prisma.reviewImage.createMany({
//     data: imageUrls.map(url => ({
//       pictureUrl: url,
//       reviewId
//     }))
//   });

//   return await prisma.reviewImage.findMany({
//     where: { reviewId },
//     orderBy: { reviewImageId: 'asc' }
//   });
// };

// export const getReviewWithImages = async (reviewId) => {
//   const review = await prisma.review.findUnique({
//     where: { reviewId }
//   });
  
//   if (!review) return null;

//   const images = await prisma.reviewImage.findMany({
//     where: { reviewId }
//   });

//   return { review, images };
// };

// export const getAllStoreReviews = async (storeId, cursor) => {
//   return await prisma.review.findMany({
//     select: {
//       reviewId: true,
//       body: true,
//       userMissionId: true,
//       createdAt: true,
//       updatedAt: true,
//       userMission: {
//         select: {
//           userId: true,
//           user: {
//             select: { 
//               userId: true, 
//               nickname: true, 
//               name: true 
//             }
//           },
//           mission: {
//             select: {
//               missionId: true,
//               storeId: true,
//               store: { 
//                 select: { 
//                   storeId: true, 
//                   name: true 
//                 }
//               },
//             },
//           },
//         },
//       },
//     },
//     where: { 
//       userMission: { 
//         mission: { storeId } 
//       },
//       reviewId: { gt: cursor }
//     },
//     orderBy: { reviewId: "asc" },
//     take: 5,
//   });
// };

// // 내 리뷰 목록
// export const getAllUserReviews = async (userId, cursor) => {
//   return await prisma.review.findMany({
//     select: {
//       reviewId: true,
//       body: true,
//       userMissionId: true,
//       createdAt: true,
//       updatedAt: true,
//       userMission: {
//         select: {
//           userId: true,
//           user: { select: { userId: true, nickname: true, name: true } },
//           mission: {
//             select: {
//               missionId: true,
//               storeId: true,
//               store: { select: { storeId: true, name: true } },
//             },
//           },
//         },
//       },
//     },
//     where: { 
//       userMission: { userId },  
//       reviewId: { gt: cursor }
//     },
//     orderBy: { reviewId: "asc" },
//     take: 5,
//   });
// };