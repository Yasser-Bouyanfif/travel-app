import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please define MONGODB_URI environment variable");
}

const options = {};

const client = new MongoClient(uri, options);
const clientPromise = client.connect();

export default clientPromise;
