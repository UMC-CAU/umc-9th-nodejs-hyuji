interface ReviewBody {
  content?: string | null;
  score?: number | null;
  images?: string[];
}

interface ReviewData {
  content?: string | null;
  score?: number | null;
  images: string[];
}

interface ReviewInfo {
  reviewId: number;
  body: string;
  score: number;
  userMissionId: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface ReviewImageInfo {
  reviewImageId: number;
  pictureUrl: string;
}

interface ReviewResponse {
  id: number;
  body: string;
  score: number;
  userMissionId: number;
  images: { id: number; url: string }[];
  createdAt: string | null;
  updatedAt: string | null;
}

export const bodyToReview = (body: ReviewBody = {}): ReviewData => {
  return {
    content: body.content ?? null,
    score: body.score ?? null,
    images: body.images ?? [],
  };
};

export const responseFromReview = ({
  review,
  images = [],
}: {
  review: ReviewInfo | null | undefined;
  images?: ReviewImageInfo[];
}): ReviewResponse | null => {
  if (!review) return null;

  return {
    id: review.reviewId,
    body: review.body,
    score: review.score,
    userMissionId: review.userMissionId,
    images: images.map((img) => ({
      id: img.reviewImageId,
      url: img.pictureUrl,
    })),
    createdAt: review.createdAt ? new Date(review.createdAt).toISOString()
      : null,
    updatedAt: review.updatedAt ? new Date(review.updatedAt).toISOString()
      : null,
  };
};

export const responseFromReviews = (reviews: any[] = []) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].reviewId : null,
    },
  };
};

interface ReviewListRow {
  reviewId: number;
  body: string;
  userMissionId: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  userMission: {
    userId: number;
    user: {
      userId: number;
      nickname: string | null;
      name: string | null;
    } | null;
    mission: {
      missionId: number;
      storeId: number;
      store: {
        storeId: number;
        name: string;
      } | null;
    } | null;
  } | null;
}
