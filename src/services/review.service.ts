import {
  responseFromReview,
  responseFromReviews,
} from "../dtos/review.dto.js";
import {
  insertReview,
  insertReviewImages,
  getReviewWithImages,
  getAllStoreReviews,
  getAllUserReviews,
} from "../repositories/review.repository.js";

interface ReviewDto {
  content?: string | null;
  score?: number | null;
  images: string[];
}

export const createReviewByUserMissionId = async (
  userMissionId: number,
  reviewDto: ReviewDto
) => {
  if (!userMissionId) throw new Error("userMissionId가 필요합니다.");
  if (!reviewDto.content) throw new Error("리뷰 내용이 필요합니다.");
  if (reviewDto.score == null || Number.isNaN(reviewDto.score))
    throw new Error("score(숫자)가 필요합니다.");

  const reviewId = await insertReview({
    body: reviewDto.content,
    score: reviewDto.score,
    userMissionId,
  });

  await insertReviewImages(reviewId, reviewDto.images);

  const data = await getReviewWithImages(reviewId);

  return responseFromReview({ review: data?.review, images: data?.images });
};

export const listStoreReviews = async (storeId: number, cursor: number = 0) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const listUserReviews = async (userId: number, cursor: number = 0) => {
  const reviews = await getAllUserReviews(userId, cursor);
  return responseFromReviews(reviews);
};