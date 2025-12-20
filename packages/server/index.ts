import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { body } from "express-validator";
import multer from "multer";
import { ToolFormModel, type ToolFormParameters } from "./schema/tool";

const app = express();
const port = 8000;
const formHandler = multer();

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api/test", (req, res) => {
    res.send("Hello!")
})
app.post("/api/tool",
    formHandler.none(),
    body("email").trim().isEmail().normalizeEmail(),
    body("link").trim().isURL().escape(),
    body("description").isString().trim().escape(),
    body("compatability").optional().trim().escape(),
    body("videos").optional().trim().escape(),
    body("guidelines").optional().trim().escape(),
    body("limits").optional().trim().escape(),
    body("comments").optional().trim().escape(),
    body("isCreator").isBoolean(),
    async (req, res) => {
        try {
            await ToolFormModel.create(req.body as ToolFormParameters);
            return res.status(201).send("Success");
        } catch (err) {
            return res.status(500);
        }
    });

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});