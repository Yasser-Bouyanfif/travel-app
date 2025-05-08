"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const FavoritesPages = () => {
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

  const [favorites, setFavorites] = useState<
    { hotel: Hotel; startDate: string; endDate: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

        if (!stored) {
          setLoading(false);
          return;
        }

        const res = await fetch("api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stored }),
        });

        const data = await res.json();

        setFavorites(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const deleteFavorite = (id: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updatedFavorites = favorites.filter(
      (fav: { id: number; startDate: string; endDate: string }) =>
        fav.id !== id,
    );

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    setFavorites((prev) =>
      prev.filter((obj: { hotel: Hotel }) => obj.hotel.id !== id),
    );
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}
      {favorites.length === 0 ? (
        <div className="pt-40 pb-30 text-center ">
          <p>No results found.</p>
        </div>
      ) : (
        <div className="py-30 bg-[#ede4e4] border-b-1">
          {favorites.map((obj) => (
            <div
              key={obj.hotel.id}
              className="flex items-center justify-center py-2"
            >
              <div className="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row md:h-80 w-full p-4">
                <div className="md:w-1/3 w-full flex flex-col">
                  <Image
                    className="w-full h-60 md:h-full object-cover rounded-lg border-gray-400 border-2"
                    src={obj.hotel.images[0]}
                    alt={obj.hotel.name}
                    width={800}
                    height={600}
                  />
                </div>

                <div className="md:w-2/3 flex flex-col justify-between p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {obj.hotel.name}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        {obj.hotel.address}
                      </p>
                    </div>
                    <div className="flex space-x-2 items-center">
                      <div className="bg-white sm:bg-white md:bg-white lg:bg-purple-100 text-blue-800 p-3 rounded-full text-sm font-medium">
                        ⭐ {obj.hotel.rating}
                      </div>

                      <div
                        onClick={() => deleteFavorite(obj.hotel.id)}
                        className="cursor-pointer w-fit p-2"
                      >
                        <Heart
                          fill="red"
                          color="red"
                          className="w-6 h-6 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-gray-700 text-sm">
                    {obj.hotel.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {obj.hotel.amenities.map((item, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    {obj.hotel.rooms.map((item, index) => (
                      <p key={index}>
                        <span className="text-2xl font-bold text-blue-600">
                          ${item.price_per_night}
                        </span>
                        <span className="text-sm font-normal text-gray-500">
                          /night
                        </span>
                      </p>
                    ))}
                    <Link
                      href={`/stay?name=${obj.hotel.name}&startDate=${obj.startDate}&endDate=${obj.endDate}`}
                    >
                      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                        Book
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FavoritesPages;
