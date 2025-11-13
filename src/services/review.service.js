import { responseFromReview, responseFromReviews } from "../dtos/review.dto.js";
import {
  insertReview,
  insertReviewImages,
  getReviewWithImages,
  getAllStoreReviews,
  getAllUserReviews 
} from "../repositories/review.repository.js";

// 리뷰 생성
export const createReviewByUserMissionId = async (userMissionId, reviewDto) => {
  if (!userMissionId) throw new Error("userMissionId가 필요합니다.");
  if (!reviewDto.content) throw new Error("리뷰 내용이 필요합니다.");
  if (reviewDto.score == null || Number.isNaN(reviewDto.score))
    throw new Error("score(숫자)가 필요합니다.");

  // 리뷰 삽입
  const reviewId = await insertReview({
    body: reviewDto.content,    // content를 body로 변환
    score: reviewDto.score,
    userMissionId,
  });

  // 이미지 삽입
  await insertReviewImages(reviewId, reviewDto.images);

  // 최종 리뷰 조회
  const data = await getReviewWithImages(reviewId);

  // 출력 DTO 변환
  return responseFromReview({ review: data.review, images: data.images });
};

export const listStoreReviews = async (storeId, cursor = 0) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};


// 내 리뷰 목록
export const listUserReviews = async (userId, cursor = 0) => {
  const reviews = await getAllUserReviews(userId, cursor);
  return responseFromReviews(reviews);
};