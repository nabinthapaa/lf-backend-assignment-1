import express from "express";
import {
  getUserInfo,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/user";

const router = express();

router.get("/", getUserInfo);
router.post("/", createUser);
router.put("/", updateUser);
router.delete("/", deleteUser);

export default router;
