const express = require("express");
const taskController = require("../controllers/task.controller");
const authRequired = require("../middlewares/authRequired");

const router = express.Router();

router.use(authRequired);

// [GET]/api/tasks
router.get("/", taskController.getAll);

// [POST]/api/tasks
router.post("/", taskController.create);

// [PUT]/api/tasks/:id
router.put("/:id", taskController.update);

// [PATCH]/api/tasks/:id/toggle
router.patch("/:id/toggle", taskController.toggle);

// [DELETE]/api/tasks/:id
router.delete("/:id", taskController.remove);

module.exports = router;
