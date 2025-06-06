import mongoose from "mongoose"

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string)
        console.log("Connected to Mongo")
    } catch (error) {
        console.log(error)
    }
}