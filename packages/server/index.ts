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
	credentials: true,
};

app.use(cors(corsOptions));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);
console.log("Routes registered");

app._router.stack.forEach((r: any) => {
	if (r.route) console.log(r.route.path);
	else if (r.name === "router") {
		r.handle.stack.forEach((layer: any) => {
			if (layer.route) console.log("/api" + layer.route.path);
		});
	}
});

app.listen(port, "0.0.0.0", () => {
	console.log(`ACH Server listening on port ${port}`);
});
