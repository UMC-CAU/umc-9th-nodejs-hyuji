import { pool } from "../db.config.js";

export const addUser = async (data) => {
  const conn = await pool.getConnection();
  try {
    // 이메일 중복 확인
    const [confirm] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) AS isExistEmail;`,
      [data.email]
    );

    if (confirm[0].isExistEmail) {
      return null; 
    }

    const [result] = await conn.query(
      `INSERT INTO user (email, password, name, gender, birthday, address, phone, area_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.password,
        data.name,
        data.gender,
        data.birthday,
        data.address,
        data.phone,
        data.areaId,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(`유저 등록 중 오류 발생: ${err.message}`);
  } finally {
    conn.release();
  }
};

export const getUser = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM user WHERE user_id = ?;`, [userId]);
    return rows[0] ?? null;
  } finally {
    conn.release();
  }
};

export const setPreference = async (userId, foodTypeId) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `INSERT INTO preferred_food_type (user_id, food_type_id)
       VALUES (?, ?);`,
      [userId, foodTypeId]
    );
  } catch (err) {
    throw new Error(`선호 카테고리 매핑 중 오류 발생: ${err.message}`);
  } finally {
    conn.release();
  }
};

export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [preferences] = await conn.query(
      `SELECT p.prefered_food_type_id AS id,
              p.user_id,
              p.food_type_id,
              f.name AS food_type_name
       FROM preferred_food_type p
       JOIN food_type f ON p.food_type_id = f.food_type_id
       WHERE p.user_id = ?
       ORDER BY p.food_type_id ASC;`,
      [userId]
    );
    return preferences;
  } finally {
    conn.release();
  }
};
