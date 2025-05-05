import mongoose, {Document, Model, models, Schema, Types} from "mongoose";

interface IOrder extends Document {
    userId: Types.ObjectId
    orders: any[]
    createdAt?: Date
    updatedAt?: Date
}

const orderSchema = new Schema(
    {
        userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
        orders: {type: [Schema.Types.Mixed], required: true}
    },
    {timestamps: true}
);

const Order = (models.Order as Model<IOrder>) || mongoose.model<IOrder>("Order", orderSchema)

export default Order
