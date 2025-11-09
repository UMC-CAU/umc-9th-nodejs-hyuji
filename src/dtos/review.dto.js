export const bodyToReview = (body = {}) => {
  return {
    content: body.body ?? body.content ?? null,
    score: typeof body.score === "number" ? body.score : (body.score ? Number(body.score) : null),
    images: Array.isArray(body.images) ? body.images : (Array.isArray(body.imageUrls) ? body.imageUrls : []),
  };
};

export const responseFromReview = ({ review = null, images = [] } = {}) => {
  if (!review) return null;

  return {
    id: review.review_id,
    body: review.body,
    score: review.score,
    userMissionId: review.user_mission_id,
    images: images.map(img => ({ id: img.review_image_id, url: img.picture_url })),
    createdAt: review.created_at ?? undefined,
    updatedAt: review.updated_at ?? undefined,
  };
};

export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].reviewId : null,
    },
  };
};