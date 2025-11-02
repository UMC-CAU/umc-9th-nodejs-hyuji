import { createReviewByUserMissionId } from "../services/review.service.js";

export const handleCreateMyPageReview = async (req, res) => {
  try {
    const userMissionId = Number(req.params.userMissionId);
    if (!userMissionId) return res.status(400).json({ message: "userMissionId path param required." });

    const created = await createReviewByUserMissionId(userMissionId, bodyToReview(req.body));
    return res.status(201).json(created);
  } catch (err) {
    if (err.code === "REVIEW_EXISTS") return res.status(409).json({ message: "이미 작성된 리뷰가 있습니다." });
    return res.status(400).json({ message: `오류가 발생했어요. ${err.message}` });
  }
};