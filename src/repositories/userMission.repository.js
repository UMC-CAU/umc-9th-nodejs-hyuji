import { pool } from "../db.config.js";

// 유저가 동일 미션을 이미 보유 중인지 확인
export const findByUserAndMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT user_mission_id, user_id, mission_id, status, end_date, reward, created_at
       FROM user_mission
       WHERE user_id = ? AND mission_id = ?
       ORDER BY created_at DESC
       LIMIT 1;`,
      [userId, missionId]
    );
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
};

export const findById = async (userMissionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT user_mission_id, user_id, mission_id, status, end_date, reward, created_at
       FROM user_mission
       WHERE user_mission_id = ?
       LIMIT 1;`,
      [userMissionId]
    );
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
};

// ASSIGNED 생성
export const create = async ({ userId, missionId, status = "ASSIGNED", createdAt = new Date() }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user_mission (user_id, mission_id, status, created_at)
       VALUES (?, ?, ?, ?);`,
      [userId, missionId, status, createdAt]
    );
    return {
      userMissionId: result.insertId,
      userId,
      missionId,
      status,
      createdAt,
    };
  } finally {
    conn.release();
  }
};

// IN_PROGRESS 전환
export const startIfAssigned = async ({ userMissionId, userId }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `UPDATE user_mission
       SET status = 'IN_PROGRESS'
       WHERE user_mission_id = ?
         AND user_id = ?
         AND status = 'ASSIGNED';`,
      [userMissionId, userId]
    );
    return result.affectedRows === 1;
  } finally {
    conn.release();
  }
};
