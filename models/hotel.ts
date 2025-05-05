import mongoose, {Document, Model, models, Schema, Types} from "mongoose";

interface IHotel extends Document {
    userId: Types.ObjectId
    hotels: any[]
}

const hotelSchema = new Schema(
    {
        hotels: {type: [Schema.Types.Mixed], required: true}
    }
);

const Hotel = (models.Hotel as Model<IHotel>) || mongoose.model<IHotel>("Hotel", hotelSchema)

export default Hotel
