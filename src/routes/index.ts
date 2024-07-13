import express from "express";
import adminRouter from "./admin.routes";
import authRouter from "./auth.routes";
import todoRouter from "./todo.routes";
import userRouter from "./user.routes";

const router = express();
router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/todos", todoRouter);
router.use("/users", userRouter);

export default router;
