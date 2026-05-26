import { Router } from "express";
import mentorshipRouter from "./mentorship";
import threadRouter from "./thread";
import toolRouter from "./tool";
import volunteerRouter from "./volunteer";

const app = Router();

app.get("/health", (_req, res) => {
	res.status(200).send("OK");
});

app.use("/thread", threadRouter);
app.use("/tools", toolRouter);
app.use("/mentorship", mentorshipRouter);
app.use("/volunteer", volunteerRouter);

export default app;
