import { Router } from "express";
import mentorshipModRouter from "./mentorship";
import toolModRouter from "./tools";

const router = Router();

router.use("/tools", toolModRouter);
router.use("/mentorship", mentorshipModRouter);

export default router;
