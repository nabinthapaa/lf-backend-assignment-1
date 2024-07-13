import express from "express";
import todoRouter from "./todo";
import userRouter from "./user";
import authRouter from "./auth";
import adminRouter from "./admin";

const router = express();
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/todos", todoRouter);
router.use("/users", userRouter);

export default router;
