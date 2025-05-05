import mongoose, {Document, models, Schema} from "mongoose";

interface IReview extends Document {
    name: string
    rating: number
    comment: string
    createdAt: Date
    updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {timestamps: true}
);

const Review = models.Review || mongoose.model<IReview>("Review", reviewSchema)

export default Review
