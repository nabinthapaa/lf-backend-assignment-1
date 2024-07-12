import express from "express";
import {
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/user";
import { auth } from "../middleware/auth";

const router = express();

router.get("/", auth, getUserInfo);
router.post("/", createUser);
router.put("/", updateUser);
router.delete("/", deleteUser);

export default router;
