import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controller/todo";
import { authenticate } from "../middleware/authenticate";
import { routeHandler } from "../utils/requestWrapper";
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from "../middleware/validator";
import {
  createTodoSchema,
  queryTodo,
  updateTodoQuerySchema,
  updateTodoDataSchema,
} from "../schema/todo";

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
