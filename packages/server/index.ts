import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();
const port = 8000;

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.get("/api/test", (req, res) => {
    res.send("Hello test")
});

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});