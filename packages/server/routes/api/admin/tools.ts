import { Router } from "express";
import { auth } from "../../../auth";
import { approveTool, getToolsByApprovalStatus, rejectTool } from "../../../schema/tool";

const router = Router();

router.use(async (req, res, next) => {
	const session = await auth.api.getSession({ headers: req.headers });
	if (!session) return res.status(401).send("Unauthorized");

	const role = session.user.role as string;
	if (!["admin", "moderator"].includes(role)) return res.status(403).send("Forbidden");

	next();
});

router.get("/tools/pending", async (_req, res) => {
	try {
		const tools = await getToolsByApprovalStatus(null);
		return res.status(200).json(tools);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.post("/tools/:slug/approve", async (req, res) => {
	try {
		const tool = await approveTool(req.params.slug);
		if (!tool) return res.status(404).json({ message: "Tool not found" });
		return res.status(200).json(tool);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.post("/tools/:slug/reject", async (req, res) => {
	try {
		const tool = await rejectTool(req.params.slug);
		if (!tool) return res.status(404).json({ message: "Tool not found" });
		return res.status(200).json(tool);
	} catch (err) {
		return res.status(500).send(err);
	}
});

export default router;
