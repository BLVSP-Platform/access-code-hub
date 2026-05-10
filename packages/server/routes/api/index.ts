import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import { insertThread } from "../../schema/thread";
import { getToolBySlug, insertToolSubmission, ToolFormModel } from "../../schema/tool";
import { insertVolunteerApplication } from "../../schema/volunteer";

const formHandler = multer();
const app = Router();

app.post(
	"/thread",
	formHandler.none(),
	body("title").trim().isString().escape(),
	body("topic").trim().isString().escape(),
	body("content").trim().isString().escape(),
	body("tags").trim().isString().escape(),
	async (req, res) => {
		try {
			const result = await insertThread(req.body);
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
			const result = await insertVolunteerApplication(req.body);
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
			const result = await insertToolSubmission(req.body);
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

export default app;
