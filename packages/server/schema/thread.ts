import mongoose, { type InferSchemaType } from "mongoose";

export const threadFormSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		username: { type: String, required: true },
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

const threadBookmarkSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		threadId: { type: String, required: true },
	},
	{ timestamps: true },
);

threadBookmarkSchema.index({ userId: 1, threadId: 1 }, { unique: true });

export const ThreadBookmarkModel = mongoose.model("thread_bookmark", threadBookmarkSchema);

export const addThreadBookmark = async (userId: string, threadId: string) => {
	return ThreadBookmarkModel.create({ userId, threadId });
};

export const removeThreadBookmark = async (userId: string, threadId: string) => {
	return ThreadBookmarkModel.deleteOne({ userId, threadId });
};

export const getThreadBookmarksForUser = async (userId: string) => {
	const bookmarks = await ThreadBookmarkModel.find({ userId }).select("threadId");
	const threadIds = bookmarks.map((b) => b.threadId);
	return ThreadFormModel.find({ _id: { $in: threadIds } }).sort({ createdAt: -1 });
};

export const commentSchema = new mongoose.Schema(
	{
		threadId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: "thread" },
		userId: { type: String, required: true },
		username: { type: String, required: true },
		content: { type: String, required: true },
	},
	{ timestamps: true },
);

export const CommentModel = mongoose.model("thread_comment", commentSchema);

export type CommentParameters = Omit<InferSchemaType<typeof commentSchema>, "createdAt" | "updatedAt">;

export const getCommentsForThread = async (threadId: string) => CommentModel.find({ threadId }).sort({ createdAt: -1 });

export const insertComment = async (params: CommentParameters) => CommentModel.create(params);

export const deleteComment = async (commentId: string, userId: string) =>
	CommentModel.deleteOne({ _id: commentId, userId });
