const { ERROR_MESSAGES, HTTP_STATUS } = require("../config/constants");
const taskModel = require("../models/task.model");

const getAll = async (req, res) => {
  try {
    const user_id = req.user.id;
    const tasks = await taskModel.findByUser(user_id);
    res.success(tasks);
  } catch (error) {
    res.error(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const create = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.error(ERROR_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST);
    }

    const insertId = await taskModel.create(user_id, text);
    const newTask = await taskModel.findOne(insertId);

    res.success(newTask, HTTP_STATUS.CREATED);
  } catch (error) {
    res.error(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const update = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.error(ERROR_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST);
    }

    const task = await taskModel.findOne(req.params.id);
    if (!task) {
      return res.error(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await taskModel.update(req.params.id, text);
    const updatedTask = await taskModel.findOne(req.params.id);

    res.success(updatedTask);
  } catch (error) {
    res.error(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const toggle = async (req, res) => {
  try {
    const task = await taskModel.findOne(req.params.id);
    if (!task) {
      return res.error(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await taskModel.toggleDone(req.params.id);
    const updatedTask = await taskModel.findOne(req.params.id);

    res.success(updatedTask);
  } catch (error) {
    res.error(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

const remove = async (req, res) => {
  try {
    const task = await taskModel.findOne(req.params.id);
    if (!task) {
      return res.error(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    await taskModel.delete(req.params.id);

    res.success({ message: "Task deleted successfully" });
  } catch (error) {
    res.error(error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAll,
  create,
  update,
  toggle,
  remove,
};
