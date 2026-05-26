import { Router } from "express";
import { body } from "express-validator";
import { MongoServerError } from "mongodb";
import multer from "multer";
import { auth } from "../../auth";
import {
	addToolBookmark,
	getToolBookmarksForUser,
	getToolBySlug,
	insertToolSubmission,
	removeToolBookmark,
	ToolBookmarkModel,
	ToolFormModel,
} from "../../schema/tool";

const formHandler = multer();
const router = Router();

router.post(
	"/",
	formHandler.none(),
	body("email").trim().isEmail().normalizeEmail(),
	body("name").isString().trim().escape(),
	body("link").trim().isURL().escape(),
	body("description").isString().trim().escape(),
	body("compatibility").optional().trim().escape(),
	body("videos").optional().trim().escape(),
	body("guidelines").optional().trim().escape(),
	body("limits").optional().trim().escape(),
	body("comments").optional().trim().escape(),
	body("isCreator").isBoolean(),
	async (req, res) => {
		try {
			const session = await auth.api.getSession({ headers: req.headers });
			if (!session) return res.status(401).send("Unauthorized");

			const result = await insertToolSubmission({ ...req.body, userId: session.user.id });
			if (!result) return res.status(502);
			return res.status(201).send("Success");
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

router.get("/", async (_req, res) => {
	try {
		const tools = await ToolFormModel.find().sort({ createdAt: -1 });
		return res.status(200).json(tools);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/last-updated", async (_req, res) => {
	try {
		const latest = await ToolFormModel.findOne().sort({ updatedAt: -1 }).select("updatedAt");
		return res.status(200).json({ lastUpdated: latest?.updatedAt ?? null });
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/bookmarks/me", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		const bookmarks = await getToolBookmarksForUser(session.user.id);
		return res.status(200).json(bookmarks);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/:slug", async (req, res) => {
	try {
		const { slug } = req.params;
		const tool = await getToolBySlug(slug);

		if (!tool) return res.status(404).json({ message: "Tool not found" });

		const session = await auth.api.getSession({ headers: req.headers });

		let bookmarked = false;
		if (session) {
			bookmarked = !!(await ToolBookmarkModel.exists({
				userId: session.user.id,
				toolId: tool._id,
			}));
		}

		return res.status(200).json({ ...tool, bookmarked });
	} catch (error) {
		console.error("GET /tools/:slug error:", error);
		return res.status(500).json({ message: "Server error" });
	}
});

router.post("/:toolId/bookmark", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		await addToolBookmark(session.user.id, req.params.toolId);
		return res.status(201).json({ message: "Bookmarked" });
	} catch (err: unknown) {
		if (err instanceof MongoServerError && err.code === 11000) {
			return res.status(409).json({ message: "Already bookmarked" });
		}
		return res.status(500).send(err);
	}
});

router.delete("/:toolId/bookmark", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		await removeToolBookmark(session.user.id, req.params.toolId);
		return res.status(200).json({ message: "Bookmark removed" });
	} catch (err) {
		return res.status(500).send(err);
	}
});

export default router;
