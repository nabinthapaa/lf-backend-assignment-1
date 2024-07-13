import express from "express";
import {
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/user";
import { routeHandler, requestWrapper } from "../utils/requestWrapper";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";
import {
  validateRequestQuery,
  validateRequestBody,
} from "../middleware/validator";
import {
  createUserBodySchema,
  getUserQuerySchema,
  updateUserSchema,
} from "../schema/user";

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
