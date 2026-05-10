import mongoose, { type InferSchemaType } from "mongoose";

export const mentorshipFormSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	email: { type: String, required: true },
	mentorshipRole: { type: String, required: true },
	tags: [{ type: String, required: true }],
});

export const MentorshipFormModel = mongoose.model("mentorship", mentorshipFormSchema);

export type MentorshipFormParameters = InferSchemaType<typeof mentorshipFormSchema>;

export const insertMentorshipRequest = async (formParams: MentorshipFormParameters) => {
	const result = await MentorshipFormModel.create(formParams);
	return result._id;
};
