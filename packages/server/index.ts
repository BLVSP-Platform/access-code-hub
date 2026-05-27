import { toNodeHandler } from "better-auth/node";
import express from "express";
import pinoHttp from "pino-http";
import { auth } from "./auth";
import apiRouter from "./routes/api";
import "dotenv/config";
import cors from "cors";
import { initializeDatabase } from "./db";

if (!process.env.CLIENT_URL) throw new Error("CLIENT_URL not provided");

await initializeDatabase();

const app = express();
const port = Number(process.env.PORT);

const logger = pinoHttp({
	transport: {
		target: "pino-pretty",
		options: { colorize: true },
	},
	redact: ["headers.cookie"],
});

app.use(logger);

const corsOptions = {
	origin: [process.env.CLIENT_URL],
	credentials: true,
};

app.use(cors(corsOptions));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.listen(port, "0.0.0.0", () => {
	console.log(`ACH Server listening on port ${port}`);
});
