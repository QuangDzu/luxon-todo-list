const pool = require("../config/database");

class Queue {
  async findAllPending() {
    const [rows] = await pool.query(
      `SELECT * FROM queues WHERE status = "pending";`,
    );
    return rows;
  }

  async findOnePending() {
    const [rows] = await pool.query(
      `SELECT * FROM queues WHERE status = ? LIMIT 1;`,
      ["pending"],
    );
    return rows[0];
  }

  async create(type, payload) {
    const [{ insertId }] = await pool.query(
      `INSERT INTO queues (type, payload) VALUES (?, ?);`,
      [type, payload],
    );
    return insertId;
  }

  async updateStatus(id, status) {
    const [{ affectRows }] = await pool.query(
      `UPDATE queues SET status = ? WHERE id = ?;`,
      [status, id],
    );
    return affectRows;
  }
}

module.exports = new Queue();
