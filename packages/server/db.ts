import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import { ToolFormModel, type ToolFormParameters } from "./schema/tool";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Error: MONGODB_URI not provided");

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
