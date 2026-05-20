import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import { auth } from "../../auth";
import { insertMentorshipRequest } from "../../schema/mentorship";
import { insertThread } from "../../schema/thread";
import {
	addToolBookmark,
	getToolBookmarksForUser,
	getToolBySlug,
	insertToolSubmission,
	removeToolBookmark,
	ToolBookmarkModel,
	ToolFormModel,
} from "../../schema/tool";
import { insertVolunteerApplication } from "../../schema/volunteer";

const formHandler = multer();
const app = Router();

app.get("/health", (_req, res) => {
	res.status(200).send("OK");
});

app.post(
	"/thread",
	formHandler.none(),
	body("title").trim().isString().escape(),
	body("topic").trim().isString().escape(),
	body("content").trim().isString().escape(),
	body("tags").trim().isString().escape(),
	async (req, res) => {
		try {
			const session = await auth.api.getSession({
				headers: req.headers,
			});

			if (!session) {
				return res.status(401).send("Unauthorized");
			}

			const result = await insertThread({ ...req.body, userId: session.user.id });
			if (!result) {
				return res.status(502);
			}
			return res.status(201).send("Success");
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

app.post(
	"/mentorship",
	body("mentorshipRole").trim().isString().escape(),
	body("tags").isArray({ min: 1 }),
	body("tags.*").trim().isString().escape(),

	async (req, res) => {
		try {
			const session = await auth.api.getSession({
				headers: req.headers,
			});

			if (!session) {
				return res.status(401).send("Unauthorized");
			}

			const result = await insertMentorshipRequest({
				userId: session.user.id,
				email: session.user.email,
				mentorshipRole: req.body.mentorshipRole,
				tags: req.body.tags,
			});

			if (!result) {
				return res.status(502);
			}
			return res.status(201).send("Success");
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

app.post(
	"/volunteer",
	formHandler.none(),
	body("shortAnswer").trim().isString().escape(),
	body("email").trim().isEmail().normalizeEmail(),
	async (req, res) => {
		try {
			const session = await auth.api.getSession({
				headers: req.headers,
			});

			if (!session) {
				return res.status(401).send("Unauthorized");
			}

			const result = await insertVolunteerApplication({ ...req.body, userId: session.user.id });

			if (!result) {
				return res.status(502);
			}
			return res.status(201).send("Success");
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

app.post(
	"/tool",
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
			const session = await auth.api.getSession({
				headers: req.headers,
			});

			if (!session) {
				return res.status(401).send("Unauthorized");
			}

			const result = await insertToolSubmission({ ...req.body, userId: session.user.id });

			if (!result) {
				return res.status(502);
			}
			return res.status(201).send("Success");
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

app.get("/tools", async (_req, res) => {
	try {
		const tools = await ToolFormModel.find().sort({ createdAt: -1 });

		return res.status(200).json(tools);
	} catch (err) {
		return res.status(500).send(err);
	}
});

app.get("/tools/last-updated", async (_req, res) => {
	try {
		const latest = await ToolFormModel.findOne().sort({ updatedAt: -1 }).select("updatedAt");
		return res.status(200).json({ lastUpdated: latest?.updatedAt ?? null });
	} catch (err) {
		return res.status(500).send(err);
	}
});

app.get("/tools/:slug", async (req, res) => {
	try {
		const { slug } = req.params;

		const tool = await getToolBySlug(slug);

		if (!tool) {
			return res.status(404).json({ message: "Tool not found" });
		}

		res.status(200).json(tool);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

app.post("/tools/:toolId/bookmark", async (req, res) => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		});

		if (!session) {
			return res.status(401).send("Unauthorized");
		}

		const { toolId } = req.params;

		await addToolBookmark(session.user.id, toolId);

		return res.status(201).json({
			message: "Bookmarked",
		});
	} catch (err: any) {
		if (err.code === 11000) {
			return res.status(409).json({
				message: "Already bookmarked",
			});
		}

		return res.status(500).send(err);
	}
});

app.delete("/tools/:toolId/bookmark", async (req, res) => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		});

		if (!session) {
			return res.status(401).send("Unauthorized");
		}

		const { toolId } = req.params;

		await removeToolBookmark(session.user.id, toolId);

		return res.status(200).json({
			message: "Bookmark removed",
		});
	} catch (err) {
		return res.status(500).send(err);
	}
});

app.get("/tools/:toolId/bookmark/status", async (req, res) => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		});

		if (!session) {
			return res.status(401).json({ bookmarked: false });
		}

		const { toolId } = req.params;

		const exists = await ToolBookmarkModel.exists({
			userId: session.user.id,
			toolId,
		});

		return res.json({ bookmarked: !!exists });
	} catch (err) {
		return res.status(500).send(err);
	}
});

app.get("/tools/bookmarks/me", async (req, res) => {
	try {
		const session = await auth.api.getSession({
			headers: req.headers,
		});

		if (!session) {
			return res.status(401).send("Unauthorized");
		}

		const bookmarks = await getToolBookmarksForUser(session.user.id);

		return res.status(200).json(bookmarks);
	} catch (err) {
		return res.status(500).send(err);
	}
});

export default app;
