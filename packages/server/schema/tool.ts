import mongoose, { type InferSchemaType, type Types } from "mongoose";
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
		slug: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
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
	return ToolFormModel.findOne({ slug }).lean();
};

export const toolBookmarkSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
			index: true,
		},

		toolId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "tool",
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

toolBookmarkSchema.index({ userId: 1, toolId: 1 }, { unique: true });

export const ToolBookmarkModel = mongoose.model("toolBookmark", toolBookmarkSchema);

export type ToolBookmarkParameters = InferSchemaType<typeof toolBookmarkSchema>;

export const addToolBookmark = async (userId: string, toolId: Types.ObjectId | string) => {
	await ToolBookmarkModel.create({
		userId,
		toolId,
	});
};

export const removeToolBookmark = async (userId: string, toolId: Types.ObjectId | string) => {
	await ToolBookmarkModel.deleteOne({
		userId,
		toolId,
	});
};

export const getToolBookmarksForUser = async (userId: string) => {
	return ToolBookmarkModel.find({ userId }).populate("toolId").sort({ createdAt: -1 }).lean();
};

export const isToolBookmarked = async (userId: string, toolId: Types.ObjectId | string) => {
	const bookmark = await ToolBookmarkModel.exists({
		userId,
		toolId,
	});

	return !!bookmark;
};

export const toolReviewSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, index: true },
		toolId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "tool",
			required: true,
		},
		rating: { type: Number, required: true, min: 1, max: 5 },
		body: { type: String, trim: true },
	},
	{ timestamps: true },
);

toolReviewSchema.index({ userId: 1, toolId: 1 }, { unique: true });

export const ToolReviewModel = mongoose.model("toolReview", toolReviewSchema);
export type ToolReviewParameters = InferSchemaType<typeof toolReviewSchema>;

export const upsertToolReview = async (
	userId: string,
	toolId: Types.ObjectId | string,
	rating: number,
	body?: string,
) => {
	return ToolReviewModel.findOneAndUpdate(
		{ userId, toolId },
		{ rating, body },
		{ upsert: true, new: true, setDefaultsOnInsert: true },
	);
};

export const removeToolReview = async (userId: string, toolId: Types.ObjectId | string) => {
	return ToolReviewModel.deleteOne({ userId, toolId });
};

export const getReviewsForTool = async (toolId: Types.ObjectId | string) => {
	return ToolReviewModel.find({ toolId }).sort({ createdAt: -1 }).lean();
};

export const getReviewByUser = async (userId: string, toolId: Types.ObjectId | string) => {
	return ToolReviewModel.findOne({ userId, toolId }).lean();
};

export const getToolsWithRatings = async () => {
	return ToolFormModel.aggregate([
		{
			$lookup: {
				from: "toolreviews",
				localField: "_id",
				foreignField: "toolId",
				as: "reviews",
			},
		},
		{
			$addFields: {
				avgRating: { $avg: "$reviews.rating" },
				reviewCount: { $size: "$reviews" },
			},
		},
		{ $unset: "reviews" },
		{ $sort: { createdAt: -1 } },
	]);
};
