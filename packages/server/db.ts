import { MongoClient, ServerApiVersion } from "mongodb";

export const client = new MongoClient("mongodb+srv://blvsp_db_user:My6$Password!@cluster0.upfmf6g.mongodb.net/?appName=Cluster0", {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});