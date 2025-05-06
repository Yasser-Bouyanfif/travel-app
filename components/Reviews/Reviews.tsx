"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const ReviewsPage = () => {
  const session = useSession();

  interface Review {
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
  }

  const [rating, setRating] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[] | null>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews?.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil((reviews?.length || 0) / reviewsPerPage);

  const [formData, setFormData] = useState({
    name: "",
    comment: "",
  });
  const [redInputs, setRedInputs] = useState({
    name: false,
    comment: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (redInputs[name as keyof typeof redInputs]) {
      setRedInputs((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newRedInputs = {
      name: !formData.name,
      comment: !formData.comment,
    };

    if (Object.values(newRedInputs).some(Boolean)) {
      toast.error("Please fill in all the required fields.");
      setRedInputs(newRedInputs);
      return;
    }

    const res = await fetch("api/postReviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData, rating: rating }),
    });

    if (res.ok) {
      toast.success("Comment successfully created.");
      setFormData({
        name: "",
        comment: "",
      });

      const newReviewsRes = await fetch("api/getReviews");
      const newReviews = await newReviewsRes.json();
      setReviews(newReviews);
    } else {
      toast.error("Registration failed. Please contact customer support.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch("api/getReviews");
      const data = await res.json();

      setReviews(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const user = session?.data?.user;
    if (user) {
      setFormData({
        name: user.name || "",
        comment: "",
      });
    }
  }, [session?.data?.user]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-30 px-10">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Leave a Review
        </h1>
        <p className="text-gray-600 mb-4">Share your experience with us!</p>
        <div className="max-w-4xl bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 mx-auto mb-12">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">
                Your Name
              </label>
              <input
                onChange={handleChange}
                id="name"
                type="text"
                className={`w-full p-2 sm:p-3 mt-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${redInputs.name ? "border-red-500" : ""}`}
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                minLength={2}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="rating" className="block text-gray-700">
                Your Rating
              </label>
              <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    onClick={() => setRating(i)}
                    className={`w-8 h-8 cursor-pointer ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-gray-700">
                Your Review
              </label>
              <textarea
                onChange={handleChange}
                id="comment"
                className={`w-full p-2 sm:p-3 mt-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${redInputs.name ? "border-red-500" : ""}`}
                placeholder="Write your comment here"
                name="comment"
                value={formData.comment}
                minLength={6}
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Post Review
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-16 grid gap-6">
        {currentReviews?.map((review, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h3 className="font-medium text-gray-900">{review.name}</h3>
                <div className="flex mt-1">{"⭐".repeat(review.rating)} </div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{review.comment}</p>
            <div className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleString("en-EN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto mt-8 flex justify-center space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 border cursor-pointer ${
              currentPage === i + 1
                ? "bg-gray-700 text-white"
                : "bg-white text-gray-700"
            } rounded`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
