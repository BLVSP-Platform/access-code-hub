import express from "express";
import { auth } from "../../../auth";
import { VolunteerFormModel } from "../../../schema/volunteer";
import { requireAdmin } from "./middleware";

const router = express.Router();

router.use(requireAdmin);

router.get("/", async (_req, res) => {
	try {
		const submissions = await VolunteerFormModel.find({ status: "pending" }).sort({ createdAt: -1 });
		res.json(submissions);
	} catch (err) {
		console.error("Failed to fetch volunteer submissions:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/:id/approve", async (req, res) => {
	try {
		const submission = await VolunteerFormModel.findByIdAndUpdate(
			req.params.id,
			{ status: "approved" },
			{ new: true },
		);
		if (!submission) return res.status(404).json({ error: "Submission not found" });

		const userList = await auth.api.listUsers({
			headers: req.headers,
			query: { searchValue: submission.email, searchField: "email" },
		});

		const targetUser = userList.users[0];
		if (!targetUser) return res.status(404).json({ error: "No account found for that email" });

		await auth.api.setRole({
			headers: new Headers(req.headers as Record<string, string>),
			body: {
				userId: targetUser.id,
				role: "moderator",
			},
		});

		res.json({ success: true });
	} catch (err) {
		console.error("Failed to approve volunteer:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

router.post("/:id/reject", async (req, res) => {
	try {
		const submission = await VolunteerFormModel.findByIdAndUpdate(
			req.params.id,
			{ status: "rejected" },
			{ new: true },
		);
		if (!submission) return res.status(404).json({ error: "Submission not found" });

		res.json({ success: true });
	} catch (err) {
		console.error("Failed to reject volunteer:", err);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
