import type { InferSchemaType } from "mongoose";
import mongoose from "mongoose";

export const volunteerFormSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	email: { type: String, required: true },
	shortAnswer: { type: String, required: true },
	status: {
		type: String,
		enum: ["pending", "approved", "rejected"],
		default: "pending",
	},
	createdAt: { type: Date, default: Date.now },
});

export const VolunteerFormModel = mongoose.model("volunteer", volunteerFormSchema);

export type VolunteerFormParameters = InferSchemaType<typeof volunteerFormSchema>;

export const insertVolunteerApplication = async (formParams: Omit<VolunteerFormParameters, "status" | "createdAt">) => {
	const result = await VolunteerFormModel.create(formParams);
	return result._id;
};
