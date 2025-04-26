"use client";

import Nav from "@/components/Home/Navbar/Nav";
import MobileNav from "@/components/Home/Navbar/MobileNav";
import {useState} from "react";

const ResponsiveNav = () => {
    const [showNav, setShowNav] = useState(false)
    const handNavShow = () => setShowNav(true)
    const handleCloseNav = () => setShowNav(false)

    return (
        <div>
            <Nav openNav={handNavShow}/>
            <MobileNav showNav={showNav} closeNav={handleCloseNav}/>
        </div>
    )
}

export default ResponsiveNav;