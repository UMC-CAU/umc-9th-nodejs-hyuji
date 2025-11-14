// export const bodyToReview = (body = {}) => {
//   return {
//     content: body.body ?? body.content ?? null,  // 이 부분을 수정
//     score: typeof body.score === "number" ? body.score : (body.score ? Number(body.score) : null),
//     images: Array.isArray(body.images) ? body.images : (Array.isArray(body.imageUrls) ? body.imageUrls : []),
//   };
// };

// export const responseFromReview = ({ review = null, images = [] } = {}) => {
//   if (!review) return null;

//   return {
//     id: review.reviewId,
//     body: review.body,
//     score: review.score,
//     userMissionId: review.userMissionId,
//     images: images.map(img => ({ id: img.reviewImageId, url: img.pictureUrl })),
//     createdAt: review.createdAt ?? undefined,
//     updatedAt: review.updatedAt ?? undefined,
//   };
// };

// export const responseFromReviews = (reviews) => {
//   return {
//     data: reviews,
//     pagination: {
//       cursor: reviews.length ? reviews[reviews.length - 1].reviewId : null,
//     },
//   };
// };