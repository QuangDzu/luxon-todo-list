const userService = require("../services/user.service");

const getAll = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const result = await userService.pagination(page);

    res.paginate(result);
  } catch (error) {
    next(error);
  }
};
// const getOne = async (req, res) => {
//   const [rows] = await pool.query(
//     `SELECT id, email, first_name, last_name, created_at, updated_at FROM users WHERE id = ${id}`,
//   );
//   return rows[0];
// };
const create = (req, res) => {};
const toggle = (req, res) => {};

module.exports = { getAll };
