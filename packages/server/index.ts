import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./auth";
import { initializeMongoose } from "./db";
import apiRouter from "./routes/api";

await initializeMongoose();

const app = express();
const port = 8000; // TODO: Use port defined in project root env

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.listen(port, () => {
	console.log(`Better Auth app listening on port ${port}`);
});
