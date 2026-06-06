import { Router } from "express";
import mentorshipAdminRouter from "./mentorship";
import toolAdminRouter from "./tools";

const router = Router();

router.use("/tools", toolAdminRouter);
router.use("/mentorship", mentorshipAdminRouter);

export default router;
