import { body } from "express-validator";
import multer from "multer";
import { ToolFormModel, type ToolFormParameters } from "../../schema/tool";
import { Router } from "express";

const formHandler = multer();
const app = Router();

// app.get("/api/example", (req, res) => {
//     res.send("Hello!")
// });

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
    }
);

export default app;