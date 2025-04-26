"use client"

import React, {useEffect} from 'react'
import Hero from "@/components/Home/Hero/Hero";
import Destination from "@/components/Home/Destination/Destination";
import Hotel from "@/components/Home/Hotel/Hotel";
import WhyChooseUs from "@/components/Home/WhyChooseUs/WhyChooseUs";
import Review from "@/components/Home/Reviews/Review";
import News from "@/components/Home/News/News";
import Newsletter from "@/components/Home/Newsletter/Newsletter";
import AOS from 'aos';
import 'aos/dist/aos.css'

const Home = () => {

    useEffect(() => {
        const initAOS = async () => {
            await import("aos")
            AOS.init({
                duration: 1000,
                easing: "ease",
                once: true,
                anchorPlacement: "top-bottom"
            })
        }
        initAOS()
    }, []);

    return (
        <div className="overflow-hidden">
            <Hero/>
            <Destination/>
            <Hotel/>
            <WhyChooseUs/>
            <Review/>
            <News/>
            <Newsletter/>
        </div>
    )
}

export default Home