import type { NextFunction, Request, Response } from "express";
import { auth } from "../../../auth";

export const requireModerator = async (req: Request, res: Response, next: NextFunction) => {
	const session = await auth.api.getSession({ headers: req.headers });
	if (!session) return res.status(401).send("Unauthorized");

	const role = session.user.role as string;
	if (!["admin", "moderator"].includes(role)) return res.status(403).send("Forbidden");

	next();
};
