import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  updateTodoStatus,
} from "../controller/todo";

const router = express();

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.put("/:id", updateTodoStatus);
router.delete("/", deleteTodo);

export default router;
