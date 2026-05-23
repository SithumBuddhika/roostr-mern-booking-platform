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

import logo from "../assets/logo.png";
import user from "../assets/user.png";
import BurgerMenu from "./BurgerMenu"; // adjust path if needed

const JustNav = () => {
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const readUser = () => {
      try {
        const stored =
          localStorage.getItem("roostrUser") ||
          localStorage.getItem("roostr_user") ||
          localStorage.getItem("user") ||
          localStorage.getItem("currentUser");
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
      }
    };
    readUser();
    window.addEventListener("storage", readUser);
    const interval = setInterval(readUser, 1000);
    return () => {
      window.removeEventListener("storage", readUser);
      clearInterval(interval);
    };
  }, []);

  const handleLogoClick = () => {
    // Option B – force full page reload on home:
    window.location.href = "/";
  };

  return (
    <div className="bg-[#f3f8fe] shadow-md px-4 md:px-10 py-3 md:py-5 rounded-t-xl">
      {/* Top Navbar */}
      <div className="flex items-center justify-between">
        {/* Left - Logo (click to go home) */}
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="Roostr" className="h-12 md:h-20 w-auto" />
        </div>

        {/* Right - Controls */}
        <div className="flex items-center space-x-3 md:space-x-5">
          <span 
            className="text-sm font-medium hidden md:inline cursor-pointer hover:text-gray-700 transition"
            onClick={() => window.location.href = "/become-host"}
          >
            Become a host
          </span>
          {currentUser ? (
            currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt="User Profile"
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#FF5A5F] to-[#FF7A85] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {(currentUser.name || "U")[0].toUpperCase()}
              </div>
            )
          ) : (
            <img
              src={user}
              alt="user"
              className="h-8 w-8 rounded-full bg-[#1a1d20]"
            />
          )}
          <BurgerMenu />
        </div>
      </div>
    </div>
  );
};

export default JustNav;
