import type { InferSchemaType } from "mongoose";
import mongoose from "mongoose";

export const volunteerFormSchema = new mongoose.Schema({
	email: { type: String, required: true },
	shortAnswer: { type: String, required: true },
});

export const VolunteerFormModel = mongoose.model("volunteer", volunteerFormSchema);

export type VolunteerFormParameters = InferSchemaType<typeof volunteerFormSchema>;

export const insertVolunteerApplication = async (formParams: VolunteerFormParameters) => {
	const result = await VolunteerFormModel.insertOne(formParams);
	return result.id;
};
