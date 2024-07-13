import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controller/todo.controller";
import { authenticate } from "../middleware/authenticate";
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from "../middleware/validator";
import {
  createTodoSchema,
  queryTodo,
  updateTodoDataSchema,
  updateTodoQuerySchema,
} from "../schema/todo.schema";
import { routeHandler } from "../utils/requestWrapper";

const router = express();

router.get("/", routeHandler([authenticate, getTodos]));
router.post(
  "/",
  routeHandler([
    authenticate,
    validateRequestBody(createTodoSchema),
    createTodo,
  ]),
);
router.put(
  "/:id",
  routeHandler([
    authenticate,
    validateRequestQuery(updateTodoQuerySchema),
    validateRequestParams(queryTodo),
    validateRequestBody(updateTodoDataSchema),
    updateTodo,
  ]),
);
router.delete(
  "/:id",
  routeHandler([authenticate, validateRequestParams(queryTodo), deleteTodo]),
);

export default router;
