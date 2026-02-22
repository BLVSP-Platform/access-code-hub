import mongoose, { type InferSchemaType } from "mongoose";

export const threadFormSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: String, required: true },
});

export const ThreadFormModel = mongoose.model("thread", threadFormSchema);

export type ThreadFormParameters = InferSchemaType<typeof threadFormSchema>;
