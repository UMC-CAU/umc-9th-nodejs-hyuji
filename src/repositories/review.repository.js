import { pool } from "../db.config.js";

export const insertReview = async ({ body, score, userMissionId }) => {
  const conn = await pool.getConnection();
  try {
    // 중복 검사: 완료된 미션당 리뷰 하나 unique 제약
    const [exist] = await conn.query(
      `SELECT review_id FROM review WHERE user_mission_id = ? LIMIT 1;`,
      [userMissionId]
    );
    if (exist.length) {
      const err = new Error("이미 해당 userMission에 대한 리뷰가 존재합니다.");
      err.code = "REVIEW_EXISTS";
      throw err;
    }

    const [result] = await conn.query(
      `INSERT INTO review (body, score, user_mission_id) VALUES (?, ?, ?);`,
      [body, score, userMissionId]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};

export const insertReviewImages = async (reviewId, imageUrls = []) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return [];

  const conn = await pool.getConnection();
  try {
    const values = imageUrls.map((url) => [url, reviewId]); 
    await conn.query(
      `INSERT INTO review_image (picture_url, review_id) VALUES ?;`,
      [values]
    );
    const [rows] = await conn.query(
      `SELECT review_image_id, picture_url FROM review_image WHERE review_id = ? ORDER BY review_image_id ASC;`,
      [reviewId]
    );
    return rows;
  } finally {
    conn.release();
  }
};

export const getReviewWithImages = async (reviewId) => {
  const conn = await pool.getConnection();
  try {
    const [rRows] = await conn.query(`SELECT * FROM review WHERE review_id = ?;`, [reviewId]);
    const review = rRows[0] ?? null;
    if (!review) return null;
    const [images] = await conn.query(`SELECT review_image_id, picture_url FROM review_image WHERE review_id = ?;`, [reviewId]);
    return { review, images };
  } finally {
    conn.release();
  }
};