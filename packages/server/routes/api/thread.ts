import { Router } from "express";
import { body } from "express-validator";
import { MongoServerError } from "mongodb";
import multer from "multer";
import { auth } from "../../auth";
import {
	addThreadBookmark,
	deleteComment,
	getCommentsForThread,
	getThreadBookmarksForUser,
	insertComment,
	insertThread,
	removeThreadBookmark,
	ThreadBookmarkModel,
	ThreadFormModel,
} from "../../schema/thread";

const formHandler = multer();
const router = Router();

router.post(
	"/",
	formHandler.none(),
	body("title").trim().isString().escape(),
	body("topic").trim().isString().escape(),
	body("content").trim().isString().escape(),
	body("tags").trim().isString().escape(),
	async (req, res) => {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		try {
			const session = await auth.api.getSession({ headers: req.headers });
			if (!session) return res.status(401).send("Unauthorized");

			const result = await insertThread({ ...req.body, userId: session.user.id, username: session.user.name });
			if (!result) return res.status(502);
			return res.status(201).json({ id: result });
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

router.get("/", async (_req, res) => {
	try {
		const threads = await ThreadFormModel.find().sort({ createdAt: -1 });
		return res.status(200).json(threads);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/bookmarks/me", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		const bookmarks = await getThreadBookmarksForUser(session.user.id);
		return res.status(200).json(bookmarks);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/last-updated", async (_req, res) => {
	try {
		const latest = await ThreadFormModel.findOne().sort({ updatedAt: -1 }).select("updatedAt");
		return res.status(200).json({ lastUpdated: latest?.updatedAt ?? null });
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const thread = await ThreadFormModel.findById(id);

		if (!thread) return res.status(404).json({ message: "Thread not found" });

		const session = await auth.api.getSession({ headers: req.headers });

		let bookmarked = false;
		if (session) {
			bookmarked = !!(await ThreadBookmarkModel.exists({
				userId: session.user.id,
				threadId: thread._id,
			}));
		}

		return res.status(200).json({ ...thread.toObject(), bookmarked });
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.post("/:threadId/bookmark", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		await addThreadBookmark(session.user.id, req.params.threadId);
		return res.status(201).json({ message: "Bookmarked" });
	} catch (err: unknown) {
		if (err instanceof MongoServerError && err.code === 11000) {
			return res.status(409).json({ message: "Already bookmarked" });
		}
		return res.status(500).send(err);
	}
});

router.delete("/:threadId/bookmark", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		await removeThreadBookmark(session.user.id, req.params.threadId);
		return res.status(200).json({ message: "Bookmark removed" });
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.get("/:threadId/comments", async (req, res) => {
	try {
		const comments = await getCommentsForThread(req.params.threadId);
		return res.status(200).json(comments);
	} catch (err) {
		return res.status(500).send(err);
	}
});

router.post(
	"/:threadId/comments",
	formHandler.none(),
	body("content").trim().isString().notEmpty().escape(),
	async (req, res) => {
		try {
			const session = await auth.api.getSession({ headers: req.headers });
			if (!session) return res.status(401).send("Unauthorized");

			const { threadId } = req.params as { threadId: string };
			const content = req.body.content as string | undefined;
			if (!content) return res.status(400).json({ message: "Content is required" });

			const comment = await insertComment({
				threadId,
				userId: session.user.id,
				username: session.user.name,
				content,
			});
			return res.status(201).json(comment);
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

router.delete("/:threadId/comments/:commentId", async (req, res) => {
	try {
		const session = await auth.api.getSession({ headers: req.headers });
		if (!session) return res.status(401).send("Unauthorized");

		const result = await deleteComment(req.params.commentId, session.user.id);
		if (result.deletedCount === 0) return res.status(404).json({ message: "Comment not found or not yours" });

		return res.status(200).json({ message: "Comment deleted" });
	} catch (err) {
		return res.status(500).send(err);
	}
});

export default router;
