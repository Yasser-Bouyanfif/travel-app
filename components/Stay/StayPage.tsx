"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CiCreditCard1 } from "react-icons/ci";
import moment from "moment";
import { toast } from "sonner";
import { MdFileDownloadDone } from "react-icons/md";
import Image from "next/image";

const StayPage = () => {
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

  interface Hotel {
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

  const router = useRouter();

  const [hotel, setHotel] = useState<{ hotel: Hotel }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [days, setDays] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [buttonId, setButtonId] = useState<number>(5);
  const [roomChoosed, setRoomChoosed] = useState({});

  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const startBeforeFormat = moment(startDate);
  const endBeforeFormat = moment(endDate);

  const startFormatted = startBeforeFormat.format("dddd DD MMMM YYYY");
  const endFormatted = endBeforeFormat.format("dddd DD MMMM YYYY");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!name || !startDate || !endDate) {
          toast.error("All fields are required to search.");
          router.push("/");
        }

        if (endDate <= startDate) {
          toast.error("The dates you entered are not valid.");
          router.push("/");
        }

        const res = await fetch("/api/data");
        const data = await res.json();
        const hotelData = data.filter(
          (stay: { hotel: Hotel }) => stay.hotel.name === name,
        );
        setHotel(hotelData);

        const start = new Date(startDate);
        const end = new Date(endDate);

        const diffInTime = end.getTime() - start.getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);

        setDays(diffInDays);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, name, router]);

  const handlePrice = (roomPrice: number, index: number) => {
    try {
      setButtonId(index);

      const total = roomPrice * days;
      setTotal(total);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (total: number, hotelData: object) => {
    if (Object.keys(roomChoosed).length === 0) {
      toast.error("Please choose a room.");
      return;
    }

    const res = await fetch("/api/auth/stripe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total: total,
        startDate: startFormatted,
        endDate: endFormatted,
        hotel: hotelData,
        room: roomChoosed,
      }),
    });

    const data = await res.json();

    alert("Copy this fake card for the payment: 4242 4242 4242 4242");

    if (data.url) {
      router.push(data.url);
    } else if (data.redirect) {
      router.push(data.redirect);
    }
  };

  return (
    <div className="bg-[#ede4e4] border-1">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}

      {hotel.map((obj, index) => (
        <div
          key={index}
          className="max-w-5xl bg-white mx-auto rounded-2xl shadow-lg overflow-hidden flex flex-col mb-10 pt-20"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 h-64 md:h-auto">
              <Image
                src={obj.hotel.images[1]}
                alt="Main hotel image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/3 flex flex-col">
              <Image
                src={obj.hotel.images[2]}
                alt="Secondary image 1"
                className="w-full h-1/2 object-cover"
              />
              <Image
                src={obj.hotel.images[3]}
                alt="Secondary image 2"
                className="w-full h-1/2 object-cover"
              />
            </div>
          </div>

          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {obj.hotel.name}
            </h2>
            <p className="text-gray-600">{obj.hotel.description}</p>

            <div className="flex items-center gap-2 text-yellow-500 text-sm">
              {"⭐".repeat(Math.round(obj.hotel.rating))}{" "}
              <span className="text-gray-500 ml-2">{obj.hotel.rating}/5</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {obj.hotel.amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t px-6 py-4">
            <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>

            {obj.hotel.rooms.map((room, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 flex flex-col md:flex-row md:justify-between"
              >
                <div>
                  <h4 className="font-medium text-lg">{room.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    {room.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {room.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right mt-4 md:mt-0">
                  <p className="text-2xl font-bold text-blue-600">
                    {room.price_per_night}$
                    <span className="text-sm font-normal text-gray-500">
                      /night
                    </span>
                  </p>
                  {index === buttonId ? (
                    <button
                      className={`mt-2 px-4 py-2 border border-gray-50-600 text-green-700 rounded-lg`}
                    >
                      <MdFileDownloadDone />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handlePrice(room.price_per_night, index);
                        setRoomChoosed(room);
                      }}
                      className={`mt-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50
                                            transition cursor-pointer`}
                    >
                      Choose
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t px-6 py-4 flex justify-between items-center">
            <div>
              <ul className="mt-3 mb-3 font-semibold text-gray-700">
                <li>
                  Arrival:{" "}
                  <span className="text-red-700 font-bold">
                    {startFormatted}
                  </span>
                </li>
                <li>
                  Departure:{" "}
                  <span className="text-red-700 font-bold">{endFormatted}</span>
                </li>
                <li>
                  Number of guests:{" "}
                  <span className="text-red-700 font-bold">1</span>
                </li>
              </ul>
              <span className="text-2xl font-semibold text-gray-700">
                Total:{" "}
              </span>
              <span className="text-2xl font-bold text-yellow-700">
                {total}$
              </span>
            </div>
            <CiCreditCard1 className="text-4xl" />
          </div>

          <div className="border-t px-6 py-4 bg-gray-50 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 text-sm">
              <p>
                <strong>Check-in:</strong> 3:00 PM • <strong>Check-out:</strong>{" "}
                11:00 AM
              </p>
              <p>Free cancellation up to 24h before arrival</p>
            </div>
            <button
              onClick={() => handleSubmit(total, obj.hotel)}
              className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StayPage;
