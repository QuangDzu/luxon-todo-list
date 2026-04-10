const express = require("express");
const userController = require("../controllers/user.controller");
const authRequired = require("../middlewares/authRequired");

const router = express.Router();

// [GET] /api/users
router.get("/", authRequired, userController.getAll);


module.exports = router;
