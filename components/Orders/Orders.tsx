"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const OrdersPage = () => {
  const session = useSession();
  const router = useRouter();

  interface Orders {
    endDate: string;
    hotelData: string;
    ref: string;
    roomData: string;
    startDate: string;
    total: string;
  }

  interface Order {
    _id: string;
    userId: string;
    orders: Orders[];
    createdAt?: Date;
    updatedAt?: Date;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session.status, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (session.status === "unauthenticated") {
        router.push("/login");
      }

      setLoading(true);
      const res = await fetch("/api/auth/orders");
      const data = await res.json();

      setOrders(data);

      setLoading(false);
    };
    fetchData();
  }, [router, session.status]);

  const handleCancel = async (id: string) => {
    try {
      if (session.status === "unauthenticated") {
        router.push("/login");
      }

      confirm("Are you sure to cancel the booking ?");

      const res = await fetch("api/auth/cancelBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        toast.success("Your booking has been successfully cancelled.");
        return;
      } else {
        toast.error("An error occurred while cancelling your booking.");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        No orders were found.
      </div>
    );
  }

  console.log(orders);

  return (
    <div className="min-h-screen bg-[#ede4e4] px-4 pt-30 p-4">
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
        {orders.map((order, index: number) => {
          const item = order.orders[0];
          const hotel = JSON.parse(item.hotelData);
          const room = JSON.parse(item.roomData);
          const imageUrl = room.image;

          return (
            <div
              key={index}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
            >
              <button
                onClick={
                  new Date(item.startDate) > new Date()
                    ? () => handleCancel(order._id)
                    : undefined
                }
                disabled={new Date(item.startDate) <= new Date()}
                className={`absolute top-4 right-4 text-white text-sm font-medium p-3 rounded-md z-10 cursor-pointer ${
                  new Date(item.startDate) > new Date()
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Cancel Booking
              </button>

              <div className="md:w-1/2 h-64 md:h-auto">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="Room"
                    className="w-full h-full object-cover"
                    width={800}
                    height={600}
                  />
                )}
              </div>

              <div className="p-6 md:w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {hotel.name}
                  </h2>

                  <div className="inline-block bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-semibold text-lg mb-4">
                    Reference: {item.ref}
                  </div>

                  <p className="text-gray-600">
                    <span className="font-semibold">Address: </span>
                    {hotel.address}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">City: </span>
                    {hotel.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Rating: </span>⭐{" "}
                    {hotel.rating}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600">
                    <span className="font-semibold">From: </span>
                    {item.startDate}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">To: </span>
                    {item.endDate}
                  </p>
                  <p className="text-sm text-gray-400 mt-3">
                    Created at {(order.createdAt as Date).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
