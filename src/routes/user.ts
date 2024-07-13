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
import { validateUserQuery, validateUserBody } from "../middleware/validator";
import {
  createUserBodySchema,
  getUserQuerySchema,
  updateUserSchema,
} from "../schema/user";

const router = express();

router.post(
  "/",
  routeHandler([validateUserBody(createUserBodySchema), createUser]),
);
router.get(
  "/",
  routeHandler([
    authenticate,
    authorize,
    validateUserQuery(getUserQuerySchema),
    getUserInfo,
  ]),
);
router.put(
  "/",
  routeHandler([
    authenticate,
    authorize,
    validateUserQuery(getUserQuerySchema),
    validateUserBody(updateUserSchema),
    updateUser,
  ]),
);
router.delete(
  "/",
  routeHandler([
    authenticate,
    authorize,
    validateUserQuery(getUserQuerySchema),
    deleteUser,
  ]),
);

export default router;
