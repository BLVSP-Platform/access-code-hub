import mongoose, { type InferSchemaType } from "mongoose";
import slugify from "slugify";

export const toolFormSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
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
		slug: { type: String, required: true, unique: true },
	},
	{
		timestamps: true,
	},
);

toolFormSchema.pre("validate", function (next) {
	if (this.name && !this.slug) {
		this.slug = slugify(this.name, {
			lower: true,
			strict: true,
			trim: true,
		});
	}

	next();
});

export const ToolFormModel = mongoose.model("tool", toolFormSchema);

export type ToolFormParameters = InferSchemaType<typeof toolFormSchema>;

export const insertToolSubmission = async (formParams: ToolFormParameters) => {
	const result = await ToolFormModel.create(formParams);
	return result._id;
};

export const getToolBySlug = async (slug: string) => {
	return ToolFormModel.findOne({ slug });
};
