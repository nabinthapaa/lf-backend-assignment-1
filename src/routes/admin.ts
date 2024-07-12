import express from "express";
import { routeHandler } from "../utils/requestWrapper";
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
} from "../controller/admin";
import { auth } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = express();

router.post(
  "/user",
  routeHandler([auth, authorize("users.create"), createUser]),
);
router.get("/user", routeHandler([auth, authorize("users.get"), getUsers]));
router.put(
  "/user",
  routeHandler([auth, authorize("users.update"), updateUser]),
);
router.delete(
  "/user",
  routeHandler([auth, authorize("users.delete"), deleteUser]),
);

export default router;
