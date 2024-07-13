import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controller/todo";
import { authenticate } from "../middleware/authenticate";
import { routeHandler } from "../utils/requestWrapper";

const router = express();

router.get("/", routeHandler([authenticate, getTodos]));
router.post("/", routeHandler([authenticate, createTodo]));
router.put("/:id", routeHandler([authenticate, updateTodo]));
router.delete("/:id", routeHandler([authenticate, deleteTodo]));

export default router;
