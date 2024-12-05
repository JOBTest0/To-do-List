import express from "express";
import {
    getAllTodos,
    getTodo,
    updateTodo,
    deleteTodo,
    addTodo,
    rewardUser,
    getCompletedTasks,
} from "../controllers/todo.js";
import { verifyToken } from "../utils/verify.js";

const router = express.Router();

// Route สำหรับดึง Completed Tasks
router.get("/completed", verifyToken, getCompletedTasks);

// Route สำหรับ Todo เดียว
router.get("/:id", verifyToken, getTodo);
router.put("/:id", verifyToken, updateTodo);

// Route อื่นๆ
router.get("/", verifyToken, getAllTodos);
router.post("/", verifyToken, addTodo);
router.delete("/:id", verifyToken, deleteTodo);
router.post("/reward", verifyToken, rewardUser);

export default router;
