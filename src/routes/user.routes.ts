import express from "express";
import {
  createUser,
  deleteUser,
  getUserInfo,
  updateUser,
} from "../controller/user.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import {
  validateRequestBody,
  validateRequestQuery,
} from "../middleware/validator";
import {
  createUserBodySchema,
  getUserQuerySchema,
  updateUserSchema,
} from "../schema/user.schema";
import { routeHandler } from "../utils/requestWrapper";

const router = express();

router.post(
  "/",
  routeHandler([validateRequestBody(createUserBodySchema), createUser]),
);
router.get(
  "/",
  routeHandler([
    authenticate,
    authorize,
    validateRequestQuery(getUserQuerySchema),
    getUserInfo,
  ]),
);
router.put(
  "/",
  routeHandler([
    authenticate,
    authorize,
    validateRequestQuery(getUserQuerySchema),
    validateRequestBody(updateUserSchema),
    updateUser,
  ]),
);
router.delete(
  "/",
  routeHandler([
    authenticate,
    authorize,
    validateRequestQuery(getUserQuerySchema),
    deleteUser,
  ]),
);

export default router;
