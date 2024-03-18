import express from "express";
const router = express.Router();
import { userAuth } from "../middleware/user.middleware";
const { postTasks,getTasks,updateTasks,deleteTasks } = require('../controllers/task.controller');

router.use(userAuth);

//tasks
router.post("/posttasks", postTasks);
router.get("/gettasks", getTasks);
router.patch("/updatetasks/:id", updateTasks);
router.delete("/deletetasks/:id", deleteTasks);


module.exports = router;