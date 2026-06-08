import { Router } from "express";
import { body } from "express-validator";
import { MongoServerError } from "mongodb";
import multer from "multer";
import { auth } from "../../auth";
import {
	addToolBookmark,
	getReviewsForTool,
	getToolBookmarksForUser,
	getToolBySlug,
	getToolsWithRatings,
	insertToolSubmission,
	removeToolBookmark,
	removeToolReview,
	ToolBookmarkModel,
	ToolFormModel,
	ToolReviewModel,
	upsertToolReview,
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
			// Check if err is duplicate key error from mongoose insert operation
			if (
				err &&
				typeof err === "object" &&
				"errorResponse" in err &&
				err.errorResponse &&
				typeof err.errorResponse === "object" &&
				"code" in err.errorResponse &&
				err.errorResponse.code === 11000
			) {
				return res.status(400).send("A tool with that name already exists.");
			}
			return res.status(500).send(err);
		}
	},
);

router.get("/", async (_req, res) => {
	try {
		const tools = await getToolsWithRatings();
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

router.get("/:toolId/reviews", async (req, res) => {
	try {
		const reviews = await getReviewsForTool(req.params.toolId);
		return res.status(200).json(reviews);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.put(
	"/:toolId/reviews",
	body("rating").isInt({ min: 1, max: 5 }),
	body("body").optional().isString().trim().escape(),
	async (req, res) => {
		try {
			const session = await auth.api.getSession({ headers: req.headers });
			if (!session) return res.status(401).send("Unauthorized");

			const { rating, body } = req.body;
			const review = await upsertToolReview(session.user.id, req.params?.toolId, rating, body);
			return res.status(200).json(review);
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

router.delete("/:toolId/reviews", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		await removeToolReview(session.user.id, req.params.toolId);
		return res.status(200).json({ message: "Review removed" });
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/submissions/me", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		const tools = await getToolsWithRatings("all", session.user.id);
		return res.status(200).json(tools);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/reviews/me", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		const reviews = await ToolReviewModel.aggregate([
			{ $match: { userId: session.user.id } },
			{ $sort: { updatedAt: -1 } },
			{
				$lookup: {
					from: "tools",
					localField: "toolId",
					foreignField: "_id",
					as: "tool",
				},
			},
			{
				$addFields: {
					toolName: { $arrayElemAt: ["$tool.name", 0] },
					toolSlug: { $arrayElemAt: ["$tool.slug", 0] },
				},
			},
			{ $unset: "tool" },
			{ $match: { toolName: { $exists: true } } },
		]);

		return res.status(200).json(reviews);
	} catch (err) {
		return res.status(500).send(err);
	}
});

export default router;
