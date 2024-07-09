import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controller/todo";
import { auth } from "../middleware/auth";

const router = express();

router.get("/", auth, getTodos);
router.post("/", auth, createTodo);
router.put("/:id", auth, updateTodo);
router.delete("/:id", auth, deleteTodo);

export default router;
