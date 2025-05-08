"use client";

import { TbAirBalloon } from "react-icons/tb";
import { navLinks } from "@/constant/constant";
import Link from "next/link";
import { HiBars3BottomRight } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";

type Props = {
  openNav: () => void;
};

const Nav = ({ openNav }: Props) => {
  const session = useSession();
  const [navBg, setNavBg] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // s'exécute seulement côté client
  }, []);

  useEffect(() => {
    const handler = () => {
      if (window.scrollY >= 90) setNavBg(true);
      if (window.scrollY < 90) setNavBg(false);
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className={`bg-gray-600 ${navBg ? "shadow-md" : "fixed"} transition-all duration-200 h-[12vh] z-[1000] fixed w-full`}
    >
      <div className="flex items-center h-full justify-between w-[90%] xl:w-[80%] mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#cf3890] rounded-full flex items-center justify-center flex-col">
            <TbAirBalloon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2x1 text-white uppercase font-bold">
            KAÏA
          </h1>
        </div>
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => {
            return (
              <Link href={link.url} key={link.id}>
                <p
                  className="relative text-white text-base font-medium w-fit
                                  block after:block after:content-[''] after:absolute after:h-[3px]
                                  after:bg-[#cf3890] after:w-full after:scale-x-0 hover:after:scale-x-100
                                  after:transition after:duration-300 after:origin-right"
                >
                  {link.label}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center space-x-4">
          {isClient && (
            <Link href={session.data ? "/dashboard" : "/login"}>
              <button
                className="md:px-12 md:py-2.5 px-8 py-2 text-black text-base bg-white
                            hover:bg-gray-200 transition-all duration-200 rounded-lg cursor-pointer flex items-center gap-2"
              >
                <div className="hidden md:flex items-center space-x-4">
                  {session.data ? "Profile" : "Login"}{" "}
                </div>
                <CgProfile />
              </button>
            </Link>
          )}
          {session.data && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="md:px-6 md:py-3.5 px-8 py-2 bg-white hover:bg-gray-200 transition-all
                                    duration-200 rounded-lg cursor-pointer font-bold flex items-center gap-2"
            >
              <IoMdLogOut />
            </button>
          )}
          <HiBars3BottomRight
            onClick={openNav}
            className="w-8 h-8 cursor-pointer text-white lg:hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default Nav;
