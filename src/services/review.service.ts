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
import {
  ReviewAlreadyExistsError,
  ValidationError,
} from "../errors.js";

interface ReviewDto {
  content?: string | null;
  score?: number | null;
  images: string[];
}

export const createReviewByUserMissionId = async (
  userMissionId: number,
  reviewDto: ReviewDto
) => {
  if (!userMissionId) throw new ValidationError("userMissionId가 필요합니다.");
  if (!reviewDto.content) throw new ValidationError("리뷰 내용이 필요합니다.");
  if (reviewDto.score == null || Number.isNaN(reviewDto.score))
    throw new ValidationError("score(숫자)가 필요합니다.");

  try {
    const reviewId = await insertReview({
      body: reviewDto.content,
      score: reviewDto.score,
      userMissionId,
    });

    await insertReviewImages(reviewId, reviewDto.images);

    const data = await getReviewWithImages(reviewId);

    return responseFromReview({ review: data?.review, images: data?.images });
  } catch (err: any) {
    if (err.code === "REVIEW_EXISTS") {
      throw new ReviewAlreadyExistsError();
    }
    throw err;
  }
};

export const listStoreReviews = async (storeId: number, cursor: number = 0) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

export const listUserReviews = async (userId: number, cursor: number = 0) => {
  const reviews = await getAllUserReviews(userId, cursor);
  return responseFromReviews(reviews);
};