import express from "express";
import {
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/user";
import { routeHandler, requestWrapper } from "../utils/requestWrapper";
import { auth } from "../middleware/auth";
import { authorize } from "../middleware/authorize";

const router = express();

router.post("/", routeHandler([createUser]));
router.get("/", routeHandler([auth, authorize("id"), getUserInfo]));
router.put("/", routeHandler([auth, authorize("id"), updateUser]));
router.delete("/", routeHandler([auth, authorize("id"), deleteUser]));

export default router;
