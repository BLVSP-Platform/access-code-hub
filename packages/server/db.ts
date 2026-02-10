import { MongoClient, ServerApiVersion } from "mongodb";
import { ToolFormModel, type ToolFormParameters } from "./schema/tool";
import mongoose from "mongoose";

export const initializeMongoose = async () => await mongoose.connect("mongodb+srv://blvsp_db_user:My6$Password!@cluster0.upfmf6g.mongodb.net/?appName=Cluster0", {
    bufferCommands: false,
});

export const client = new MongoClient("mongodb+srv://blvsp_db_user:My6$Password!@cluster0.upfmf6g.mongodb.net/?appName=Cluster0", {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const insertToolSubmission = async (formParams: ToolFormParameters) => {
    const result = await ToolFormModel.insertOne(formParams);
    return result.id;
}