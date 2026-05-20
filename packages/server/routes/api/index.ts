import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import { insertToolSubmission } from "../../db";
import { rateLimitMiddleware } from "../../middleware/rateLimiter";

const formHandler = multer();
const app = Router();

app.use("/", rateLimitMiddleware);

// app.get("/api/example", (req, res) => {
//     res.send("Hello!")
// });

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
			const result = await insertToolSubmission(req.body);
			if (!result) {
				return res.status(502);
			}
			return res.status(201).send("Success");
		} catch (_err) {
			return res.status(500);
		}
	},
);

export default app;
