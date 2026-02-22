import { body } from "express-validator";
import multer from "multer";
import { Router } from "express";
import { insertToolSubmission } from "../../db";

const formHandler = multer();
const app = Router();

app.post("/thread",
    formHandler.none(),
    body("title").trim().isString().escape(),
    body("topic").trim().isString().escape(),
    body("content").trim().isString().escape(),
    body("tags").trim().isString().escape(),
    async (req, res) => {

    }
);

app.post("/volunteer",
    formHandler.none(),
    body("description").trim().isString().escape(),
    body("email").trim().isEmail().normalizeEmail(),
    async (req, res) => {

    }
)

app.post("/tool",
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
            const result = await insertToolSubmission(req.body);
            if (!result) {
                return res.status(502);
            }
            return res.status(201).send("Success");
        } catch (err) {
            return res.status(500);
        }
    }
);

export default app;