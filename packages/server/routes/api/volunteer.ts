import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import { auth } from "../../auth";
import { insertVolunteerApplication } from "../../schema/volunteer";

const formHandler = multer();
const router = Router();

router.post(
	"/",
	formHandler.none(),
	body("shortAnswer").trim().isString().escape(),
	body("email").trim().isEmail().normalizeEmail(),
	async (req, res) => {
		try {
			const session = await auth.api.getSession({ headers: req.headers });
			if (!session) return res.status(401).send("Unauthorized");

			const result = await insertVolunteerApplication({ ...req.body, userId: session.user.id });
			if (!result) return res.status(502);
			return res.status(201).send("Success");
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

export default router;
