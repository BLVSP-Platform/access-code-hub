import { Router } from "express";
import volunteerAdminRouter from "./volunteer";

const router = Router();

router.use("/volunteer", volunteerAdminRouter);

export default router;
