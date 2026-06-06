import { Router } from "express";
import { approveTool, getToolsByApprovalStatus, rejectTool } from "../../../schema/tool";
import { requireAdmin } from "./middleware";

const router = Router();

router.use(requireAdmin);

router.get("/pending", async (_req, res) => {
	try {
		const tools = await getToolsByApprovalStatus(null);
		return res.status(200).json(tools);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.post("/:slug/approve", async (req, res) => {
	try {
		const tool = await approveTool(req.params.slug);
		if (!tool) return res.status(404).json({ message: "Tool not found" });
		return res.status(200).json(tool);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.post("/:slug/reject", async (req, res) => {
	try {
		const tool = await rejectTool(req.params.slug);
		if (!tool) return res.status(404).json({ message: "Tool not found" });
		return res.status(200).json(tool);
	} catch (err) {
		return res.status(500).send(err);
	}
});

export default router;
