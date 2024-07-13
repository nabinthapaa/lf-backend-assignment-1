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

const router = express();

router.post("/", routeHandler([createUser]));
router.get("/", routeHandler([authenticate, authorize, getUserInfo]));
router.put("/", routeHandler([authenticate, authorize, updateUser]));
router.delete("/", routeHandler([authenticate, authorize, deleteUser]));

export default router;
