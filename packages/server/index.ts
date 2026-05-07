import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./auth";
import apiRouter from "./routes/api";
import "dotenv/config";
import cors from "cors";
import { initializeDatabase } from "./db";

await initializeDatabase();

const app = express();
const port = Number(process.env.PORT);

const corsOptions = {
	origin: ["http://localhost:5173", "https://ach-frontend-production.up.railway.app"],
	redentials: true,
};

app.use(cors(corsOptions));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.listen(port, "0.0.0.0", () => {
	console.log(`ACH Server listening on port ${port}`);
});
