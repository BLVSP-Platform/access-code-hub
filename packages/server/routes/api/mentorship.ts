import { Router } from "express";
import { body } from "express-validator";
import { auth } from "../../auth";
import { insertMentorshipRequest } from "../../schema/mentorship";

const router = Router();

router.post(
	"/",
	body("mentorshipRole").trim().isString().escape(),
	body("tags").isArray({ min: 1 }),
	body("tags.*").trim().isString().escape(),
	async (req, res) => {
		try {
			const session = await auth.api.getSession({ headers: req.headers });
			if (!session) return res.status(401).send("Unauthorized");

			const result = await insertMentorshipRequest({
				userId: session.user.id,
				email: session.user.email,
				mentorshipRole: req.body.mentorshipRole,
				tags: req.body.tags,
			});

			if (!result) return res.status(502);
			return res.status(201).send("Success");
		} catch (err) {
			return res.status(500).send(err);
		}
	},
);

export default router;
