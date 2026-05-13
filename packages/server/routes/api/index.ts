import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import { auth } from "../../auth";
import { insertThread } from "../../schema/thread";
import { insertToolSubmission } from "../../schema/tool";
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
	body("link").trim().isURL().escape(),
	body("description").isString().trim().escape(),
	body("compatability").optional().trim().escape(),
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

export default app;
