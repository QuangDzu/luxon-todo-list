const pool = require("../config/database");

class Task {
  async findAll(limit, offset) {
    const [rows] = await pool.query(`SELECT * FROM tasks LIMIT ? OFFSET ?`, [
      limit,
      offset,
    ]);
    return rows;
  }

  async findOne(id) {
    const [rows] = await pool.query(`SELECT * FROM tasks WHERE id = ?`, [id]);
    return rows[0];
  }

  async create(user_id, text) {
    const [{ insertId }] = await pool.query(
      `INSERT INTO tasks (user_id, text) VALUES (?, ?)`,
      [user_id, text],
    );
    return insertId;
  }

  async update(id, text) {
    const [{ affectedRows }] = await pool.query(
      `UPDATE tasks SET text = ? WHERE id = ?`,
      [text, id],
    );
    return affectedRows;
  }

  async delete(id) {
    const [{ affectedRows }] = await pool.query(
      `DELETE FROM tasks WHERE id = ?`,
      [id],
    );
    return affectedRows;
  }

  async toggleDone(id) {
    const [{ affectedRows }] = await pool.query(
      `UPDATE tasks SET done = IF(done = 'true', 'false', 'true') WHERE id = ?`,
      [id],
    );
    return affectedRows;
  }

  async findByUser(user_id) {
    const [rows] = await pool.query(`SELECT * FROM tasks WHERE user_id = ? `, [
      user_id,
    ]);
    return rows;
  }
}

module.exports = new Task();
