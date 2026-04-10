const pool = require("../config/database");

class User {
  async findAll(limit, offset) {
    const [rows] = await pool.query(
      `SELECT * FROM users LIMIT ${limit} OFFSET ${offset};`,
    );
    return rows;
  }

  async count() {
    const [rows] = await pool.query(`SELECT count(*) AS count FROM users;`);
    return rows[0].count;
  }

  async countNewUser() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const prev = currentDate.toISOString().slice(0, 10);

    const [rows] = await pool.query(
      `SELECT count(*) AS count FROM users WHERE created_at BETWEEN ? AND ?;`,
      [`${prev} 00:00:00`, `${prev} 23:59:59`],
    );
    return rows[0].count;
  }

  async findOne(id) {
    const [rows] = await pool.query(
      `SELECT id, email, first_name, last_name, verified_at, created_at FROM users WHERE id = ${id}`,
    );
    return rows[0];
  }

  async create(email, password) {
    const [{ insertId }] = await pool.query(
      `INSERT INTO users (email, password) VALUES ("${email}", "${password}");`,
    );
    return insertId;
  }

  async findByEmail(email) {
    const query = `SELECT id, email, password, first_name, last_name, verified_at FROM users WHERE email = ?;`;
    const [rows] = await pool.query(query, [email]);
    return rows[0];
  }

  async updateRefreshToken(id, token, ttl) {
    const query = `UPDATE users SET refresh_token = ?, refresh_expires_at = ? WHERE id = ?`;
    const [{ affectedRows }] = await pool.query(query, [token, ttl, id]);
    return affectedRows;
  }

  async verifyEmail(id) {
    const query = `UPDATE users SET verified_at =now() WHERE id =?;`;
    const [{ affectedRows }] = await pool.query(query, [id]);
    return affectedRows;
  }

  async findRefreshToken(token) {
    const query = `SELECT * FROM users WHERE refresh_token = ? AND refresh_expires_at >= now()`;
    const [rows] = await pool.query(query, [token]);
    return rows[0];
  }
}

module.exports = new User();
