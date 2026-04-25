import type { RequestHandler } from "express";
import { auth } from "../auth";

export const rateLimitMiddleware: RequestHandler = async (req, res, next) => {
	const result = await auth.api.checkRateLimit({
		headers: req.headers,
		body: { path: req.path },
	});

	if (!result.success) {
		return res
			.json({
				error: "Too many requests",
				retryAfter: result.retryAfter,
			})
			.status(429);
	} else {
		next();
	}
};
