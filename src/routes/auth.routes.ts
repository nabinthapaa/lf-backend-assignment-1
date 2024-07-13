import express from "express";
import { login, refresh } from "../controller/auth.controller";
import { requestWrapper } from "../utils/requestWrapper";

const router = express();
router.post("/login", requestWrapper(login));
router.get("/refresh", requestWrapper(refresh));

export default router;
