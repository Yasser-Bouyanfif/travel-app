"use client"

import Link from "next/link";
import {useEffect, useState} from "react";
import SearchBox from "@/components/Helper/SearchBox";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";
import {Heart} from "lucide-react";

const SearchPage = () => {
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

    interface Favorite {
        id: number,
        startDate: string,
        endDate: string
    }

    const router = useRouter()

    const [hotels, setHotels] = useState<{ hotel: Hotel }[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [favorites, setFavorites] = useState<Favorite[]>([])

    const searchParams = useSearchParams()
    const location = searchParams.get("location")
    const startDate: any = searchParams.get("startDate")
    const endDate: any = searchParams.get("endDate")

    useEffect(() => {

        const fetchData = async () => {
            try {
                setLoading(true)

                if (!location || !startDate || !endDate) {
                    toast.error("All fields are required to search.")
                    router.push("/")
                }

                if (endDate <= startDate) {
                    toast.error("The dates you entered are not valid.")
                    router.push("/")
                }

                if (!location) {
                    setLoading(false)
                    return
                }

                const req = await fetch("/api/data")
                const res = await req.json()

                const data = res.filter((stay: { hotel: Hotel }) => stay.hotel.location === location)
                setHotels(data)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }

        fetchData()
    }, [searchParams])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("favorites") || "[]")
        setFavorites(stored)
    }, [])

    useEffect(() => {
        if (favorites.length !== 0) {
            localStorage.setItem("favorites", JSON.stringify(favorites))
        }

    }, [favorites])

    const toggleFavorite = (itemId: number) => {
        const isAlreadyFavorite = favorites.some(fav => fav.id === itemId)
        if (isAlreadyFavorite) {
            setFavorites(prev => prev.filter(fav => fav.id !== itemId))
            toast.info("This hotel has been removed from your favorites.💔")
        } else {
            setFavorites(prev => [...prev, {id: itemId, startDate: startDate, endDate: endDate}])
            toast.info(`This hotel has been added to your favorites.❤️`)
        }
    }

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500">
                    </div>
                </div>
            )}
            {hotels.length === 0 ? (
                <div className="pt-30 pb-30 text-center ">
                    <SearchBox location={location} startDate={startDate} endDate={endDate}/>
                    <p>No results found.</p>
                </div>
            ) : (
                <div className="py-30 bg-[#ede4e4] border-b-1">
                    <SearchBox location={location} startDate={startDate} endDate={endDate}/>

                    {hotels.map((obj) => (
                        <div key={obj.hotel.id} className="flex items-center justify-center py-2">
                            <div
                                className="max-w-4xl bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row md:h-80 w-full p-4">

                                <div className="md:w-1/3 w-full flex flex-col">
                                    <img
                                        className="w-full h-60 md:h-full object-cover rounded-lg border-gray-400 border-2"
                                        src={obj.hotel.images[0]}
                                        alt={obj.hotel.name}
                                    />
                                </div>

                                <div className="md:w-2/3 flex flex-col justify-between p-6">

                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">{obj.hotel.name}</h2>
                                            <p className="text-gray-600 text-sm">{obj.hotel.address}</p>
                                        </div>
                                        <div className="flex space-x-2 items-center">
                                            <div
                                                className="bg-white sm:bg-white md:bg-white lg:bg-purple-100 text-blue-800 p-3 rounded-full text-sm font-medium">
                                                ⭐ {obj.hotel.rating}
                                            </div>

                                            <div
                                                onClick={() => toggleFavorite(obj.hotel.id)}
                                                className="cursor-pointer w-fit p-2"
                                            >
                                                <Heart
                                                    fill={favorites.some(fav => fav.id === obj.hotel.id) ? "red" : "none"}
                                                    color="red"
                                                    className="w-6 h-6 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-2 text-gray-700 text-sm">{obj.hotel.description}</p>

                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {obj.hotel.amenities.map((item, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
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
                                                <span className="text-sm font-normal text-gray-500">/night</span>
                                            </p>
                                        ))}
                                        <Link
                                            href={`/stay?name=${obj.hotel.name}&startDate=${startDate}&endDate=${endDate}`}>
                                            <button
                                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
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
    )
}

export default SearchPage
