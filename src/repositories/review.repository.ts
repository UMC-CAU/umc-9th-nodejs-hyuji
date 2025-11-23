import { prisma } from "../db.config.js";

export const insertReview = async ({
  body,
  score,
  userMissionId,
}: {
  body: string;
  score: number;
  userMissionId: number;
}): Promise<number> => {
  const exist = await prisma.review.findFirst({
    where: { userMissionId },
  });

  if (exist) {
    const err = new Error(
      "이미 해당 userMission에 대한 리뷰가 존재합니다."
    );
    (err as any).code = "REVIEW_EXISTS";
    throw err;
  }

  const created = await prisma.review.create({
    data: {
      body,
      score,
      userMissionId,
    },
  });
  return created.reviewId;
};

export const insertReviewImages = async (
  reviewId: number,
  imageUrls: string[] = []
) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return [];

  await prisma.reviewImage.createMany({
    data: imageUrls.map((url) => ({
      pictureUrl: url,
      reviewId,
    })),
  });

  return await prisma.reviewImage.findMany({
    where: { reviewId },
    orderBy: { reviewImageId: "asc" },
  });
};

export const getReviewWithImages = async (reviewId: number) => {
  const review = await prisma.review.findUnique({
    where: { reviewId },
  });

  if (!review) return null;

  const images = await prisma.reviewImage.findMany({
    where: { reviewId },
  });

  return { review, images };
};

export const getAllStoreReviews = async (storeId: number, cursor: number) => {
  return await prisma.review.findMany({
    select: {
      reviewId: true,
      body: true,
      userMissionId: true,
      createdAt: true,
      updatedAt: true,
      userMission: {
        select: {
          userId: true,
          user: {
            select: {
              userId: true,
              nickname: true,
              name: true,
            },
          },
          mission: {
            select: {
              missionId: true,
              storeId: true,
              store: {
                select: {
                  storeId: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      userMission: {
        mission: { storeId },
      },
      reviewId: { gt: cursor },
    },
    orderBy: { reviewId: "asc" },
    take: 5,
  });
};

export const getAllUserReviews = async (userId: number, cursor: number) => {
  return await prisma.review.findMany({
    select: {
      reviewId: true,
      body: true,
      userMissionId: true,
      createdAt: true,
      updatedAt: true,
      userMission: {
        select: {
          userId: true,
          user: { select: { userId: true, nickname: true, name: true } },
          mission: {
            select: {
              missionId: true,
              storeId: true,
              store: { select: { storeId: true, name: true } },
            },
          },
        },
      },
    },
    where: {
      userMission: { userId },
      reviewId: { gt: cursor },
    },
    orderBy: { reviewId: "asc" },
    take: 5,
  });
};