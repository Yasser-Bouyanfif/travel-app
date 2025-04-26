import React from 'react'
import SectionHeading from "@/components/Helper/SectionHeading"
import NewsCard from "@/components/Home/News/NewsCard"

const News = () => {
    return (
        <div className="pt-16 pb-16">
            <SectionHeading
                heading="Exciting Travel News for You"
                tagline="Discover the latest updates, deals, and tips to make your next adventure unforgettable."
            />
            <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
             gap-10 items-center mt-20">
                <div>
                    <NewsCard
                        image="/images/n1.jpg"
                        title="Discover the Magic of Bali This Season"
                        date="21 August 2024"
                    />
                </div>

                <div>
                    <NewsCard
                        image="/images/n2.jpg"
                        title="5 Must-Know Tips for Stress-Free Airport Travel"
                        date="9 September 2024"
                    />
                </div>

                <div>
                    <NewsCard
                        image="/images/n3.jpg"
                        title="Why Iceland Should Be Your Next Destination"
                        date="28 October 2024"
                    />
                </div>

                <div>
                    <NewsCard
                        image="/images/n4.jpg"
                        title="Top 10 Place to Visit in Australia"
                        date="15 November 2024"
                    />
                </div>

            </div>
        </div>
    )
}

export default News;