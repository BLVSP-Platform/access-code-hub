import mongoose, { type InferSchemaType } from "mongoose";

export const toolFormSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		name: { type: String, required: true },
		link: { type: String, required: true },
		description: { type: String, required: true },
		compatibility: String,
		videos: String,
		guidelines: String,
		limits: String,
		comments: String,
		isCreator: Boolean,
	},
	{
		timestamps: true,
	},
);

export const ToolFormModel = mongoose.model("tool", toolFormSchema);

export type ToolFormParameters = InferSchemaType<typeof toolFormSchema>;

export const insertToolSubmission = async (formParams: ToolFormParameters) => {
	const result = await ToolFormModel.create(formParams);
	return result._id;
};
