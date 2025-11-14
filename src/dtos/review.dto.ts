interface ReviewBody {
  body?: string;
  content?: string;
  score?: number | string;
  images?: string[];
  imageUrls?: string[];
}

interface ReviewData {
  content?: string | null;
  score?: number | null;
  images: string[];
}

interface ReviewInfo {
  reviewId?: number;
  body?: string;
  score?: number;
  userMissionId?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

interface ReviewImageInfo {
  reviewImageId?: number;
  pictureUrl?: string;
}

interface ReviewResponse {
  id?: number;
  body?: string;
  score?: number;
  userMissionId?: number;
  images: { id?: number; url?: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export const bodyToReview = (body: ReviewBody = {}): ReviewData => {
  return {
    content: body.body ?? body.content ?? null,
    score:
      typeof body.score === "number"
        ? body.score
        : body.score
        ? Number(body.score)
        : null,
    images: Array.isArray(body.images)
      ? body.images
      : Array.isArray(body.imageUrls)
      ? body.imageUrls
      : [],
  };
};

export const responseFromReview = ({
  review,
  images,
}: {
  review?: ReviewInfo | null;
  images?: ReviewImageInfo[];
} = {}): ReviewResponse | null => {
  if (!review) return null;

  return {
    id: review.reviewId,
    body: review.body,
    score: review.score,
    userMissionId: review.userMissionId,
    images: (images || []).map((img) => ({
      id: img.reviewImageId,
      url: img.pictureUrl,
    })),
    createdAt: review.createdAt ?? undefined,
    updatedAt: review.updatedAt ?? undefined,
  };
};

export const responseFromReviews = (reviews: any[]) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].reviewId : null,
    },
  };
};