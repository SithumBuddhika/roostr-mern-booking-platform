// src/components/NoSearchNav.jsx
import React, { useState } from "react";
import home from "../assets/homes.png";
import experience from "../assets/experiences.png";
import service from "../assets/services.png";
import logo from "../assets/logo.png";
import user from "../assets/user.png";
import BurgerMenu from "./BurgerMenu"; // adjust path if needed

const NoSearchNav = () => {
  const [selected, setSelected] = useState("home");

  const navItems = [
    { id: "home", label: "Homes", icon: home },
    { id: "experience", label: "Experiences", icon: experience },
    { id: "service", label: "Services", icon: service },
  ];

  const handleLogoClick = () => {
    // Hard refresh back to home (same behaviour as updated JustNav)
    window.location.href = "/";
    // If you ever want SPA-style nav instead, use:
    // navigate("/");
  };

  return (
    <div className="bg-[#f3f8fe] shadow-md px-10 py-5 rounded-t-xl">
      {/* Top Navbar */}
      <div className="flex items-center justify-between">
        {/* Left - Logo (click to go home) */}
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="Roostr" className="h-20 w-auto" />
        </div>

        {/* Center - Menu Items */}
        <div className="flex items-center space-x-16">
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item.id)}
              className="cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center space-x-2">
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`h-9 w-9 transition-transform duration-200 ${
                    selected === item.id ? "scale-110" : ""
                  }`}
                />
                <span
                  className={`text-[15px] transition-colors duration-200 ${
                    selected === item.id
                      ? "font-semibold text-black"
                      : "text-gray-800 hover:font-medium"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {selected === item.id && (
                <div className="h-[3px] w-full bg-black rounded-full mt-1 transition-all duration-300" />
              )}
            </div>
          ))}
        </div>

        {/* Right - Controls */}
        <div className="flex items-center space-x-5">
          <span className="text-sm font-medium">Become a host</span>
          <img
            src={user}
            alt="user"
            className="h-8 w-8 rounded-full bg-[#1a1d20]"
          />
          <BurgerMenu /> {/* interactive menu */}
        </div>
      </div>
    </div>
  );
};

export default NoSearchNav;
