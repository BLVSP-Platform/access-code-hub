import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import { ToolFormModel, type ToolFormParameters } from "./schema/tool";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blvsp";

export const initializeMongoose = async () =>
	await mongoose.connect(MONGODB_URI, {
		bufferCommands: false,
	});

export const client = new MongoClient(MONGODB_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export const insertToolSubmission = async (formParams: ToolFormParameters) => {
	const result = await ToolFormModel.insertOne(formParams);
	return result.id;
};
