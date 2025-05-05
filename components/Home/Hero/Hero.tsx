import SearchBox from "@/components/Helper/SearchBox"
import React from "react";

const Hero = () => {
    return (
        <div className="relative w-full h-[120vh] sm:h-[100vh] border-1 border-gray-500 mt-15">
            <div className="absolute top-0 left-0 w-full h-full bg-[#ede4e4] opacity-70"></div>
            <div className="absolute z-[100] w-full h-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <div className="flex items-center justify-center flex-col w-full h-full">
                    <div data-aos="fade-up">
                        <h1 className="text-[25px] mb-4 md:mb-0 text-center md:text-[35px] lg:text-[45px] tracking-[0.7rem]
                         font-bold uppercase">
                            Go Further. Feel Free.
                        </h1>

                        <p className="md:text-base text-center text-lg font-normal [word-spacing:3px]">
                            Explore the world with 2M+ stays at the lowest prices.
                        </p>
                    </div>
                    <SearchBox location="" startDate="" endDate=""/>
                </div>
            </div>
        </div>
    )
}

export default Hero