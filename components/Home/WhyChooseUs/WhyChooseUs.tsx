import SectionHeading from "@/components/Helper/SectionHeading";
import WhyChooseCard from "@/components/Home/WhyChooseUs/WhyChooseCard";

const WhyChooseUs = () => {
    return (
        <div className="pt-16 pb-24">
            <SectionHeading heading="Why Choose Us" tagline="Because your journey deserves more than average."/>
            <div className="grid w-[80%] mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 items-center
            mt-20">
                <div data-aos="fade-up" data-aos-anchor-placement="top-center">
                    <WhyChooseCard
                        image="/images/c1.svg"
                        title="Best Price Guarantee"
                        description="You’ll always get the best deal — or we’ll match it."
                    />
                </div>
                <div data-aos="fade-up" data-aos-anchor-placement="top-center" data-aos-delay="150">
                    <WhyChooseCard
                        image="/images/c2.svg"
                        title="Easy & Quick Booking"
                        description="Book in minutes. Travel without the hassle."
                    />
                </div>
                <div data-aos="fade-up" data-aos-anchor-placement="top-center" data-aos-delay="300">
                    <WhyChooseCard
                        image="/images/c3.svg"
                        title="Customer Care 24/7"
                        description="We’re here anytime, anywhere — whenever you need us."
                    />
                </div>
            </div>
        </div>
    )
}

export default WhyChooseUs;