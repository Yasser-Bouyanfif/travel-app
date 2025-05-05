import {Adapter} from "next-auth/adapters";
import {MongoDBAdapter} from "@auth/mongodb-adapter";
import {MongoClient} from "mongodb";

export default function CustomMongoDBAdapter(clientPromise: Promise<MongoClient>): Adapter {
    const baseAdapter = MongoDBAdapter(clientPromise);

    return {
        ...baseAdapter,
        async createUser(user) {
            const db = (await clientPromise).db();
            const newUser = {
                ...user,
                address: null,
                postalCode: null,
                city: null,
                country: null,
            };
            const result = await db.collection("users").insertOne(newUser);
            return {...newUser, id: result.insertedId.toString()};
        }
    };
}