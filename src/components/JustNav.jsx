// // src/components/JustNav.jsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// import logo from "../assets/logo.png";
// import user from "../assets/user.png";
// import BurgerMenu from "./BurgerMenu"; // adjust path if needed

// const JustNav = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-[#f3f8fe] shadow-md px-10 py-5 rounded-t-xl">
//       {/* Top Navbar */}
//       <div className="flex items-center justify-between">
//         {/* Left - Logo (click to go home) */}
//         <div
//           className="cursor-pointer"
//           onClick={() => navigate("/")}
//         >
//           <img src={logo} alt="Roostr" className="h-20 w-auto" />
//         </div>

//         {/* Right - Controls */}
//         <div className="flex items-center space-x-5">
//           <span className="text-sm font-medium">Become a host</span>
//           <img
//             src={user}
//             alt="user"
//             className="h-8 w-8 rounded-full bg-[#1a1d20]"
//           />
//           <BurgerMenu />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JustNav;


// src/components/JustNav.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import user from "../assets/user.png";
import BurgerMenu from "./BurgerMenu"; // adjust path if needed

const JustNav = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Option A – SPA navigation (no hard refresh):
    // navigate("/");

    // Option B – force full page reload on home:
    window.location.href = "/";
  };

  return (
    <div className="bg-[#f3f8fe] shadow-md px-10 py-5 rounded-t-xl">
      {/* Top Navbar */}
      <div className="flex items-center justify-between">
        {/* Left - Logo (click to go home) */}
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="Roostr" className="h-20 w-auto" />
        </div>

        {/* Right - Controls */}
        <div className="flex items-center space-x-5">
          <span className="text-sm font-medium">Become a host</span>
          <img
            src={user}
            alt="user"
            className="h-8 w-8 rounded-full bg-[#1a1d20]"
          />
          <BurgerMenu />
        </div>
      </div>
    </div>
  );
};

export default JustNav;
