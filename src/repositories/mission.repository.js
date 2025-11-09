import { pool } from "../db.config.js";

// 미션 조회
export const findById = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT mission_id, store_id, title, body, created_at, updated_at
       FROM mission
       WHERE mission_id = ?
       LIMIT 1;`,
      [missionId]
    );
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
};

// 가게에 미션 추가
export const insertMissionForStore = async (storeId, { title, body }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO mission (store_id, title, body) VALUES (?, ?, ?);`,
      [storeId, title, body]
    );

    const [rows] = await conn.query(
      `SELECT mission_id, store_id, title, body, created_at, updated_at
       FROM mission
       WHERE mission_id = ?;`,
      [result.insertId]
    );
    return rows[0];
  } finally {
    conn.release();
  }
};

// 할당 가능 여부
export const checkAssignable = async ({ missionId, storeId }) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT mission_id, store_id
       FROM mission
       WHERE mission_id = ?
       LIMIT 1;`,
      [missionId]
    );
    const mission = rows[0];
    if (!mission) return { ok: false, reason: "MISSION_NOT_FOUND" };
    if (storeId && Number(storeId) !== Number(mission.store_id)) {
      return { ok: false, reason: "STORE_MISMATCH" };
    }
    return { ok: true, mission };
  } finally {
    conn.release();
  }
};
