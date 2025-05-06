import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaCalendarWeek } from "react-icons/fa";
import { FaHotel, FaUserGroup } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {
  location: string | null;
  startDate: string | null;
  endDate: string | null;
};

const SearchBox = ({ location, startDate, endDate }: Props) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    location: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    setFormData({
      location: location || "",
      startDate: startDate || "",
      endDate: endDate || "",
    });
  }, [startDate, endDate, location]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams();
      if (formData.location) queryParams.append("location", formData.location);
      if (formData.startDate)
        queryParams.append("startDate", formData.startDate);
      if (formData.endDate) queryParams.append("endDate", formData.endDate);

      const today = new Date();
      const todayDate = today.toISOString().split("T")[0];

      if (!formData.location || !formData.startDate || !formData.endDate) {
        toast.error("All fields are required to search.");
        return;
      }

      if (formData.startDate < todayDate) {
        toast.error("The dates you entered are not valid.");
        return;
      }

      if (formData.endDate <= formData.startDate) {
        toast.error("The dates you entered are not valid.");
        return;
      }

      router.push(`/search?${queryParams.toString()}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mb-15">
      <form onSubmit={handleSearch} className="w-full max-w-6xl" action="">
        <div className="bg-white rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-8 mt-4 sm:mt-12 mx-auto">
          <div className="flex items-center space-x-6">
            <FaHotel className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-lg font-medium mb-2">Location</p>
              <select
                onChange={handleChange}
                value={formData.location}
                name="location"
              >
                <option value="" disabled hidden>
                  Select a destination
                </option>
                <option value="Bali">Bali</option>
                <option value="Paris">Paris</option>
                <option value="Aspen">Aspen</option>
                <option value="Malibu">Malibu</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <FaCalendarWeek className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-lg font-medium mb-2">Start Date</p>
              <input
                onChange={handleChange}
                type="date"
                className="outline-none border-none w-full"
                name="startDate"
                value={formData.startDate}
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <FaCalendarWeek className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-lg font-medium mb-2">End Date</p>
              <input
                onChange={handleChange}
                type="date"
                className="outline-none border-none w-full"
                name="endDate"
                value={formData.endDate}
              />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <FaUserGroup className="w-6 h-6 text-gray-600" />
            <div>
              <p className="text-lg font-medium mb-2">Guest</p>
              <p className="text-base font-normal">1 Guest 1 Room</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="rounded px-25 py-4 bg-rose-600 text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-400 hover:ring-2 hover:ring-offset-2 hover:ring-red-400 transition-all ease-out duration-300 cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
