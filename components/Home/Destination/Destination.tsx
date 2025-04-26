import SectionHeading from "@/components/Helper/SectionHeading"
import DestinationSlider from "@/components/Home/Destination/DestinationSlider"

const Destination = () => {
    return (
        <div className="pt-20 pb-20">
            <SectionHeading heading="Exploring Popular Destination"
                            tagline="Discover breathtaking views from around the world."/>
            <div className="mt-14 w-[80%] mx-auto">
                <DestinationSlider/>
            </div>
        </div>
    )
}

export default Destination