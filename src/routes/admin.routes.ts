import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controller/admin.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import { validateRequestBody } from "../middleware/validator";
import {
  createUserBodySchema,
  getUserQuerySchema,
  updateUserSchema,
} from "../schema/admin.schema";
import { getUserQuerySchema as deleteUserQuerySchema } from "../schema/user.schema";
import { routeHandler } from "../utils/requestWrapper";

const router = express();

router.post(
  "/user",
  routeHandler([
    authenticate,
    authorize("users.create"),
    validateRequestBody(createUserBodySchema),
    createUser,
  ]),
);
router.get(
  "/user",
  routeHandler([
    authenticate,
    authorize("users.get"),
    validateRequestBody(getUserQuerySchema),
    getUsers,
  ]),
);
router.put(
  "/user",
  routeHandler([
    authenticate,
    authorize("users.update"),
    validateRequestBody(updateUserSchema),
    updateUser,
  ]),
);
router.delete(
  "/user",
  routeHandler([
    authenticate,
    authorize("users.delete"),
    validateRequestBody(deleteUserQuerySchema),
    deleteUser,
  ]),
);

export default router;
