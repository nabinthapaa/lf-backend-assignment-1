import express from "express";
import { routeHandler } from "../utils/requestWrapper";
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
} from "../controller/admin";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = express();

router.post(
  "/user",
  routeHandler([authenticate, authorize("users.create"), createUser]),
);
router.get(
  "/user",
  routeHandler([authenticate, authorize("users.get"), getUsers]),
);
router.put(
  "/user",
  routeHandler([authenticate, authorize("users.update"), updateUser]),
);
router.delete(
  "/user",
  routeHandler([authenticate, authorize("users.delete"), deleteUser]),
);

export default router;
