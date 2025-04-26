import mongoose, {Model, models, Schema} from "mongoose"

interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    address?: null,
    postalCode?: null,
    city?: null,
    country?: null
}

const userSchema = new Schema<IUser>({
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
    },
}, {timestamps: true})

const User: Model<IUser> = (models.User as Model<IUser>) || mongoose.model("User", userSchema)

export default User