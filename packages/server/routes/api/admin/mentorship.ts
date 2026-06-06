import { Router } from "express";
import { MentorshipFormModel } from "../../../schema/mentorship";
import { requireAdmin } from "./middleware";

const router = Router();

router.use(requireAdmin);

router.get("/", async (_req, res) => {
	try {
		const submissions = await MentorshipFormModel.find().sort({ _id: -1 }).lean();
		return res.status(200).json(submissions);
	} catch (err) {
		return res.status(500).send(err);
	}
});

export default router;
