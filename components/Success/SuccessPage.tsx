import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const SuccessPage = () => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  interface HotelData {
    name: string;
    address: string;
    location: string;
    rating: number;
  }

  interface RoomData {
    name: string;
    description: string;
    price_per_night: number;
    image: string;
  }

  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [total, setTotal] = useState<number>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [ref, setRef] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (session.status === "unauthenticated") {
          router.push("/login");
        }

        setLoading(true);
        if (sessionId) {
          const res = await fetch("/api/auth/success", {
            method: "POST",
            headers: {
              "Content-Type": "application-json",
            },
            body: JSON.stringify({ sessionId }),
          });

          const data = await res.json();

          setHotelData(JSON.parse(data.hotel.hotelData));
          setRoomData(JSON.parse(data.hotel.roomData));
          setStartDate(data.hotel.startDate);
          setEndDate(data.hotel.endDate);
          setRef(data.hotel.ref);
          setTotal(data.hotel.total);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [router, session.status, sessionId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4"></div>
      </div>
    );
  }

  if (!hotelData || !roomData || !total || !startDate || !endDate) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Failed to load booking details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ede4e4] flex items-start justify-center pt-30 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-white p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-green-500 text-3xl" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Your Booking is Confirmed
              </h1>
              <p className="text-gray-600">
                A confirmation email has been sent
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-sm text-gray-600">Booking Reference</p>
            <p className="font-mono font-bold text-lg">{`#${ref}`}</p>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex">
              <div className="w-1/3 bg-gray-200">
                <Image
                  src={roomData.image}
                  alt={roomData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  {hotelData.name}
                </h2>
                <div className="flex items-center mt-1">
                  <div className="flex text-amber-400 mr-2">
                    {"⭐".repeat(Math.round(hotelData.rating))}{" "}
                  </div>
                  <span className="text-sm text-gray-600">
                    {hotelData.location}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                  <FaMapMarkerAlt className="mr-2" size={12} />
                  <span>{hotelData.address}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <h3 className="font-semibold text-gray-800">{roomData.name}</h3>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="font-medium">{startDate}</p>
                  <p className="text-xs text-gray-500">From 3:00 PM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="font-medium">{endDate}</p>
                  <p className="text-xs text-gray-500">Before 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3">Price Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                {startDate && endDate ? (
                  <span className="text-gray-600">
                    {roomData.price_per_night} $ ×{" "}
                    {Math.ceil(
                      (new Date(endDate).getTime() -
                        new Date(startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    night(s)
                  </span>
                ) : (
                  <span className="text-gray-600">Date not valid</span>
                )}
                <span>{total} $</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service fee</span>
                <span>0.00 $</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span>0.00 $</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>{total} $</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <Link href="/orders">
            <button className="flex w-full bg-blue-600 justify-center text-white py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer">
              View Details
            </button>
          </Link>
          <p className="text-center text-sm text-gray-500 mt-4">
            Questions? Contact us at{" "}
            <span className="text-blue-600">+1 234 567 89</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
