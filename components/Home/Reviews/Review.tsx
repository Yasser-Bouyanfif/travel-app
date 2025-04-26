import React from 'react'
import {FaStar} from "react-icons/fa";
import ReviewSlider from "@/components/Home/Reviews/ReviewSlider";

const Review = () => {
    return (
        <div className="pt-20 pb-20 flex items-center justify-center flex-col bg-[#768fa3]">
            <div className="w-[80%] mx-auto grid items-center grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="">
                    <h1 className="text-2xl font-semibold text-white">What our customers are saying us ?</h1>
                    <p className="mt-6 text-gray-200">

                    </p>
                    <div className="mt-6 flex items-center space-x-6">
                        <div>
                            <p className="text-2xl font-bold text-white">4.88</p>
                            <p className="mb-2 text-white">Overall Rating</p>
                            <div className="flex items-center">
                                <FaStar className="text-white"/>
                                <FaStar className="text-white"/>
                                <FaStar className="text-white"/>
                                <FaStar className="text-white"/>
                                <FaStar className="text-white"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-hidden">
                    <ReviewSlider/>
                </div>
            </div>
        </div>
    )
}

export default Review;