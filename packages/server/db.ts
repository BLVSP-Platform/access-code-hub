import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import { ToolFormModel, type ToolFormParameters } from "./schema/tool";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not provided");

export const client = new MongoClient(MONGODB_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export const initializeDatabase = async () => {
	await client.connect();
	console.log("MongoClient connected");

	await mongoose.connect(MONGODB_URI, {
		bufferCommands: false,
	});
	console.log("Mongoose connected");
};

export const insertToolSubmission = async (formParams: ToolFormParameters) => {
	const result = await ToolFormModel.create(formParams);
	return result._id;
};
