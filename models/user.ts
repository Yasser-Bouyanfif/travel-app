import mongoose, {Document, Model, models, Schema} from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    address?: string | null;
    postalCode?: string | null;
    city?: string | null;
    country?: string | null;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        address: {
            type: String,
            default: null
        },
        postalCode: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        country: {
            type: String,
            default: null
        }
    },
    {timestamps: true}
)

const User: Model<IUser> =
    (models.User as Model<IUser>) || mongoose.model<IUser>("User", userSchema)

export default User
