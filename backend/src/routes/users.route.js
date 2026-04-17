const express = require("express");
const userController = require("../controllers/user.controller");
const authRequired = require("../middlewares/authRequired");

const router = express.Router();

// [GET] /api/users
router.get("/", authRequired, userController.getAll);

// [POST] /api/users
router.post("/", authRequired, userController.create);

// [PUT] /api/users
router.put("/:id", authRequired, userController.update);

// [DELETE] /api/users
router.delete("/:id", authRequired, userController.remove);

module.exports = router;
