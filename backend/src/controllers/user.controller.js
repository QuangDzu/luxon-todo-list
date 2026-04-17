const userModel = require("../models/user.model");
const userService = require("../services/user.service");

const getAll = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const result = await userService.pagination(page, limit);

    // console.log(req.query.user_id);

    res.paginate(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { email, password, first_name, last_name, role = "user" } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email và password là bắt buộc" });
    }

    const insertId = await userModel.createNewUser(
      email,
      password,
      first_name,
      last_name,
      role,
    );

    res.status(201).json({
      success: true,
      message: "Tạo user thành công",
      data: { id: insertId },
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await userModel.update(id, req.body);

    if (affected === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });
    }

    res.json({ success: true, message: "Cập nhật user thành công" });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affected = await userModel.delete(id);

    if (affected === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });
    }

    res.json({ success: true, message: "Xóa user thành công" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, create, update, remove };
