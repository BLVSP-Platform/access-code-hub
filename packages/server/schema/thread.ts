import mongoose, { type InferSchemaType } from "mongoose";

export const threadFormSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		title: { type: String, required: true },
		topic: { type: String, required: true },
		content: { type: String, required: true },
		tags: { type: String, required: true },
	},
	{ timestamps: true },
);

export const ThreadFormModel = mongoose.model("thread", threadFormSchema);

export type ThreadFormParameters = InferSchemaType<typeof threadFormSchema>;

export const insertThread = async (formParams: ThreadFormParameters) => {
	const result = await ThreadFormModel.create(formParams);
	return result._id;
};
