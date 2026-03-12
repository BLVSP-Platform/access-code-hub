import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./auth";
import apiRouter from "./routes/api"
import "dotenv/config";

const app = express();
const port = process.env.SERVER_PORT;

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.listen(port, () => {
	console.log(`Better Auth app listening on port ${port}`);
});
