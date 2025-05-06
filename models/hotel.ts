import { Document, model, models, Schema } from "mongoose";

interface Room {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  available_dates: string[];
  max_guests: number;
  amenities: string[];
  image: string;
}

export interface IHotel extends Document {
  id: number;
  name: string;
  description: string;
  address: string;
  location: string;
  rating: number;
  booking_info: object;
  amenities: string[];
  images: string[];
  rooms: Room[];
}

const hotelSchema = new Schema<IHotel>({
  id: { type: Number, required: true },
  name: String,
  description: String,
  address: String,
  location: String,
  rating: Number,
  booking_info: Object,
  amenities: [String],
  images: [String],
  rooms: [
    {
      id: Number,
      name: String,
      description: String,
      price_per_night: Number,
      available_dates: [String],
      max_guests: Number,
      amenities: [String],
      image: String,
    },
  ],
});

export default models.Hotel || model<IHotel>("Hotel", hotelSchema);
