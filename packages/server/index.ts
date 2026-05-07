import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./auth";
import apiRouter from "./routes/api";
import "dotenv/config";
import { initializeDatabase } from "./db";

await initializeDatabase();

const app = express();
const port = Number(process.env.PORT);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.listen(port, "0.0.0.0", () => {
	console.log(`ACH Server listening on port ${port}`);
});
