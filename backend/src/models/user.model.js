const pool = require("../config/database");

class User {
  async findAll(limit, offset, filters = {}) {
    const queryStr = Object.entries(filters)
      .filter(([_, value]) => value !== void 0)
      .map(([key, value]) => {
        value = typeof value === "number" ? value : `"${value}"`;
        return `${key} = ${value}`;
      })
      .join(" AND ");
    console.log(queryStr);

    const [rows] = await pool.query(
      `SELECT * FROM users ${queryStr ? ` WHERE ${queryStr}` : ""} LIMIT ${limit} OFFSET ${offset};`,
    );

    console.log(
      `SELECT * FROM posts ${queryStr ? `where ${queryStr}` : ""} LIMIT ${limit} OFFSET ${offset};`,
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

  async createNewUser(
    email,
    password,
    first_name = null,
    last_name = null,
    role = "user",
  ) {
    const [{ insertId }] = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, role) 
     VALUES (?, ?, ?, ?, ?)`,
      [email, password, first_name, last_name, role],
    );
    return insertId;
  }

  async update(id, data) {
    const { first_name, last_name, email, role } = data;

    let updates = [];
    let params = [];

    if (first_name !== undefined) {
      updates.push("first_name = ?");
      params.push(first_name);
    }
    if (last_name !== undefined) {
      updates.push("last_name = ?");
      params.push(last_name);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      params.push(email);
    }
    if (role !== undefined) {
      updates.push("role = ?");
      params.push(role);
    }

    if (updates.length === 0) return 0;

    const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
    params.push(id);

    const [{ affectedRows }] = await pool.query(query, params);
    return affectedRows;
  }

  async delete(id) {
    const [{ affectedRows }] = await pool.query(
      `DELETE FROM users WHERE id = ?`,
      [id],
    );
    return affectedRows;
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
