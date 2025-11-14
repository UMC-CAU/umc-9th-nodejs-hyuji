// import { StatusCodes } from 'http-status-codes';
// import { bodyToReview } from '../dtos/review.dto.js';
// import { createReviewByUserMissionId, listStoreReviews, listUserReviews } from "../services/review.service.js";

// export const handleCreateMyPageReview = async (req, res) => {
//   try {
//     const userMissionId = Number(req.params.userMissionId);
//     if (!userMissionId) return res.status(400).json({ message: "userMissionId path param required." });

//     const created = await createReviewByUserMissionId(userMissionId, bodyToReview(req.body));
//     return res.status(201).json(created);
//   } catch (err) {
//     if (err.code === "REVIEW_EXISTS") return res.status(409).json({ message: "이미 작성된 리뷰가 있습니다." });
//     return res.status(400).json({ message: `오류가 발생했어요. ${err.message}` });
//   }
// };

// export const handleListStoreReviews = async (req, res, next) => {
//   try {
//     const reviews = await listStoreReviews(
//       parseInt(req.params.storeId),
//       typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
//     );
//     res.status(StatusCodes.OK).json(reviews);
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
//       message: `리뷰 목록 조회 중 오류가 발생했습니다: ${err.message}` 
//     });
//   }
// };

// // 내가 작성한 리뷰 목록
// export const handleListMyReviews = async (req, res) => {
//   try {
//     const userId = Number(req.params.userId) || (req.user?.id ?? 1);
//     const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

//     const reviews = await listUserReviews(userId, cursor);
//     res.status(StatusCodes.OK).json(reviews);
//   } catch (err) {
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: `내 리뷰 목록 조회 중 오류가 발생했습니다: ${err.message}`
//     });
//   }
// };