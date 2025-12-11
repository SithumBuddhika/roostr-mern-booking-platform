// import React, { useState } from 'react';
// import home from '../assets/homes.png';
// import experience from '../assets/experiences.png';
// import service from '../assets/services.png';
// import logo from '../assets/logo.png';
// import user from '../assets/user.png';
// import menu from '../assets/menu.png';
// import searchIcon from '../assets/search.png';
// import BurgerMenu from './BurgerMenu';

// const Navbar = () => {
//   const [selected, setSelected] = useState('home');

//   const navItems = [
//     { id: 'home', label: 'Homes', icon: home },
//     { id: 'experience', label: 'Experiences', icon: experience },
//     { id: 'service', label: 'Services', icon: service },
//   ];

//   return (
//     <div className="bg-[#EEF4FB] px-8 py-4 shadow-md rounded-t-xl">
//       {/* Top Bar */}
//       <div className="flex items-center justify-between">
//         {/* Logo */}
//         <div>
//           <img src={logo} alt="Roostr" className="h-14 w-auto" />
//         </div>

//         {/* Search Ribbon (Centered) */}
//         <div className="flex-1 flex justify-center">
//           <div className="flex items-center bg-white rounded-full shadow-md px-6 py-3 space-x-6">
//             {/* Where */}
//             <div className="flex flex-col pr-4 border-r border-gray-300">
//               <span className="text-sm font-semibold leading-tight">Where</span>
//               <span className="text-sm text-gray-500 leading-tight">Search destination</span>
//             </div>

//             {/* Check In */}
//             <div className="flex flex-col px-4 border-r border-gray-300">
//               <span className="text-sm font-semibold leading-tight">Check in</span>
//               <span className="text-sm text-gray-500 leading-tight">Add dates</span>
//             </div>

//             {/* Check Out */}
//             <div className="flex flex-col px-4 border-r border-gray-300">
//               <span className="text-sm font-semibold leading-tight">Check Out</span>
//               <span className="text-sm text-gray-500 leading-tight">Add dates</span>
//             </div>

//             {/* Guests */}
//             <div className="flex flex-col px-4">
//               <span className="text-sm font-semibold leading-tight">Who</span>
//               <span className="text-sm text-gray-500 leading-tight">Add guest</span>
//             </div>

//             {/* Search Button */}
//             <button className="ml-2 bg-[#e94a3f] p-3 rounded-full">
//               <img src={searchIcon} alt="search" className="h-4 w-4" />
//             </button>
//           </div>
//         </div>

//         {/* User Controls */}
//         <div className="flex items-center space-x-4 ml-4">
//           <span className="text-sm font-medium">Become a host</span>
//           <img src={user} alt="user" className="h-8 w-8 rounded-full bg-[#1a1d20]" />
//           <BurgerMenu />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


// src/components/SearchRibbon.jsx (or whatever this file is named)
import React, { useState } from 'react';
import home from '../assets/homes.png';
import experience from '../assets/experiences.png';
import service from '../assets/services.png';
import logo from '../assets/logo.png';
import user from '../assets/user.png';
import menu from '../assets/menu.png';
import searchIcon from '../assets/search.png';
import BurgerMenu from './BurgerMenu';

const Navbar = () => {
  const [selected, setSelected] = useState('home');

  const navItems = [
    { id: 'home', label: 'Homes', icon: home },
    { id: 'experience', label: 'Experiences', icon: experience },
    { id: 'service', label: 'Services', icon: service },
  ];

  // 🔙 Click logo -> hard refresh to HomeScreen
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <div className="bg-[#EEF4FB] px-8 py-4 shadow-md rounded-t-xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="Roostr" className="h-14 w-auto" />
        </div>

        {/* Search Ribbon (Centered) */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center bg-white rounded-full shadow-md px-6 py-3 space-x-6">
            {/* Where */}
            <div className="flex flex-col pr-4 border-r border-gray-300">
              <span className="text-sm font-semibold leading-tight">Where</span>
              <span className="text-sm text-gray-500 leading-tight">
                Search destination
              </span>
            </div>

            {/* Check In */}
            <div className="flex flex-col px-4 border-r border-gray-300">
              <span className="text-sm font-semibold leading-tight">Check in</span>
              <span className="text-sm text-gray-500 leading-tight">Add dates</span>
            </div>

            {/* Check Out */}
            <div className="flex flex-col px-4 border-r border-gray-300">
              <span className="text-sm font-semibold leading-tight">Check Out</span>
              <span className="text-sm text-gray-500 leading-tight">Add dates</span>
            </div>

            {/* Guests */}
            <div className="flex flex-col px-4">
              <span className="text-sm font-semibold leading-tight">Who</span>
              <span className="text-sm text-gray-500 leading-tight">Add guest</span>
            </div>

            {/* Search Button */}
            <button className="ml-2 bg-[#e94a3f] p-3 rounded-full">
              <img src={searchIcon} alt="search" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* User Controls */}
        <div className="flex items-center space-x-4 ml-4">
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

export default Navbar;
