// // src/components/Navbar.jsx
// import React, { useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import dayjs from 'dayjs';
// import { Link, useNavigate } from 'react-router-dom';

// import home from '../assets/homes.png';
// import experience from '../assets/experiences.png';
// import service from '../assets/services.png';
// import logo from '../assets/logo.png';
// import user from '../assets/user.png';
// import searchIcon from '../assets/search.png';
// import BurgerMenu from './BurgerMenu';

// // POPUP COMPONENTS
// import SuggestedDestinations from './suggestdesination';
// import Calendar from './Calendar';
// import Who from './Who';

// const Navbar = () => {
//   const [selected, setSelected] = useState('home');
//   const navigate = useNavigate();

//   // which field is currently active: 'where' | 'when' | 'who' | null
//   const [activeField, setActiveField] = useState(null);

//   // search state
//   const [destination, setDestination] = useState(null); // whole destination object from SuggestedDestinations
//   const [checkIn, setCheckIn] = useState(null);
//   const [checkOut, setCheckOut] = useState(null);
//   const [guests, setGuests] = useState({
//     adults: 1,
//     children: 0,
//     infants: 0,
//     pets: 0,
//   });

//   const navItems = [
//     { id: 'home',        label: 'Homes',       icon: home },
//     { id: 'experience',  label: 'Experiences', icon: experience },
//     { id: 'service',     label: 'Services',    icon: service },
//   ];

//   const toggleField = (field) => {
//     setActiveField((prev) => (prev === field ? null : field));
//   };

//   const closeAllPanels = () => setActiveField(null);

//   // handlers for child components
//   const handleDestinationSelect = (dest) => {
//     setDestination(dest);
//     closeAllPanels();
//   };

//   const handleDatesSelect = (ci, co) => {
//     setCheckIn(ci);
//     setCheckOut(co);
//   };

//   const handleGuestsChange = (nextGuests) => {
//     setGuests(nextGuests);
//   };

//   const resetSearchState = () => {
//     setDestination(null);
//     setCheckIn(null);
//     setCheckOut(null);
//     setGuests({
//       adults: 1,
//       children: 0,
//       infants: 0,
//       pets: 0,
//     });
//     setActiveField(null);
//   };

//   const handleLogoClick = () => {
//     // reset UI + go to clean home screen (no filters)
//     resetSearchState();
//     navigate('/', { replace: true });
//   };

//   // SEARCH HANDLER – this is what sends filters to HomeScreen
//   const handleSearch = () => {
//     const totalGuests =
//       (guests?.adults || 0) +
//       (guests?.children || 0) +
//       (guests?.infants || 0);

//     const filters = {
//       destinationId: destination?.id || null,
//       destinationLabel: destination?.label || '',
//       country: destination?.country || null, // will match Room.country
//       checkIn: checkIn ? dayjs(checkIn).startOf('day').toISOString() : null,
//       checkOut: checkOut ? dayjs(checkOut).startOf('day').toISOString() : null,
//       guests: { ...guests },
//       totalGuests,
//     };

//     navigate('/', {
//       state: {
//         searchFilters: filters,
//       },
//     });

//     closeAllPanels();
//   };

//   // display helpers
//   const dateLabel = () => {
//     if (checkIn && checkOut) {
//       const from = dayjs(checkIn).format('DD MMM');
//       const to = dayjs(checkOut).format('DD MMM');
//       return `${from} – ${to}`;
//     }
//     return 'Add dates';
//   };

//   const whoLabel = () => {
//     const mainGuests = guests.adults + guests.children + guests.infants;
//     const pets = guests.pets;

//     if (!mainGuests && !pets) return 'Add guest';

//     const parts = [];
//     if (mainGuests) {
//       parts.push(`${mainGuests} guest${mainGuests > 1 ? 's' : ''}`);
//     }
//     if (pets) {
//       parts.push(`${pets} pet${pets > 1 ? 's' : ''}`);
//     }
//     return parts.join(', ');
//   };

//   return (
//     <div className="bg-[#f3f8fe] shadow-md px-10 py-5 rounded-t-xl relative z-40">
//       {/* Top Navbar */}
//       <div className="flex items-center justify-between">
//         {/* Left - Logo */}
//         <div className="cursor-pointer" onClick={handleLogoClick}>
//           <img src={logo} alt="Roostr" className="h-20 w-auto" />
//         </div>

//         {/* Center - Menu Items */}
//         <div className="flex items-center space-x-16">
//           {navItems.map((item) => (
//             <div
//               key={item.id}
//               onClick={() => setSelected(item.id)}
//               className="cursor-pointer transition-all duration-200 hover:scale-105"
//             >
//               <div className="flex items-center space-x-2">
//                 <img
//                   src={item.icon}
//                   alt={item.label}
//                   className={`h-9 w-9 transition-transform duration-200 ${
//                     selected === item.id ? 'scale-110' : ''
//                   }`}
//                 />
//                 <span
//                   className={`text-[15px] transition-colors duration-200 ${
//                     selected === item.id
//                       ? 'font-semibold text-black'
//                       : 'text-gray-800 hover:font-medium'
//                   }`}
//                 >
//                   {item.label}
//                 </span>
//               </div>
//               {selected === item.id && (
//                 <div className="h-[3px] w-full bg-black rounded-full mt-1 transition-all duration-300" />
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Right - Controls */}
//         <div className="flex items-center space-x-5">
//           <span className="text-sm font-medium">
//             <Link to="/become-host">Become a host</Link>
//           </span>
//           <img src={user} alt="user" className="h-8 w-8 rounded-full bg-[#1a1d20]" />
//           <BurgerMenu />
//         </div>
//       </div>

//       {/* ----- SEARCH RIBBON + POPUPS ----- */}
//       <div className="flex justify-center mt-6 relative">
//         {/* Transparent overlay to close on outside-click (under nav, over content) */}
//         <AnimatePresence>
//           {activeField && (
//             <motion.div
//               key="overlay"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.15 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.18 }}
//               className="fixed inset-0 bg-black z-30"
//               onClick={closeAllPanels}
//             />
//           )}
//         </AnimatePresence>

//         {/* Search bar */}
//         <div
//           className="flex items-center bg-white rounded-full shadow-lg px-8 py-4 space-x-6 relative z-40"
//         >
//           {/* WHERE */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleField('where');
//             }}
//             className={`flex flex-col pr-4 text-left ${
//               activeField === 'where'
//                 ? 'bg-[#f5f7fb] rounded-full px-4 py-2 -ml-4'
//                 : ''
//             }`}
//           >
//             <span className="text-[13px] font-semibold leading-5">Where</span>
//             <span className="text-[13px] text-gray-500 leading-5">
//               {destination ? destination.label : 'Search destination'}
//             </span>
//           </button>

//           {/* Divider */}
//           <div className="h-10 border-l border-gray-300" />

//           {/* CHECK IN */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleField('when');
//             }}
//             className={`flex flex-col px-4 text-left ${
//               activeField === 'when'
//                 ? 'bg-[#f5f7fb] rounded-full px-4 py-2 -mx-4'
//                 : ''
//             }`}
//           >
//             <span className="text-[13px] font-semibold leading-5">
//               Check in
//             </span>
//             <span className="text-[13px] text-gray-500 leading-5">
//               {checkIn ? dayjs(checkIn).format('DD MMM') : 'Add dates'}
//             </span>
//           </button>

//           {/* Divider */}
//           <div className="h-10 border-l border-gray-300" />

//           {/* CHECK OUT */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleField('when');
//             }}
//             className={`flex flex-col px-4 text-left ${
//               activeField === 'when'
//                 ? 'bg-[#f5f7fb] rounded-full px-4 py-2 -mx-4'
//                 : ''
//             }`}
//           >
//             <span className="text-[13px] font-semibold leading-5">
//               Check Out
//             </span>
//             <span className="text-[13px] text-gray-500 leading-5">
//               {checkOut ? dayjs(checkOut).format('DD MMM') : 'Add dates'}
//             </span>
//           </button>

//           {/* Divider */}
//           <div className="h-10 border-l border-gray-300" />

//           {/* WHO */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleField('who');
//             }}
//             className={`flex flex-col pl-4 pr-2 text-left ${
//               activeField === 'who'
//                 ? 'bg-[#f5f7fb] rounded-full px-4 py-2 -mr-4'
//                 : ''
//             }`}
//           >
//             <span className="text-[13px] font-semibold leading-5">Who</span>
//             <span className="text-[13px] text-gray-500 leading-5">
//               {whoLabel()}
//             </span>
//           </button>

//           {/* Search Button */}
//           <button
//             type="button"
//             onClick={handleSearch}
//             className="ml-4 bg-[#e94a3f] p-3 rounded-full flex items-center justify-center"
//           >
//             <img src={searchIcon} alt="search" className="h-[18px] w-[18px]" />
//           </button>

//           {/* POPUPS (positioned relative to search bar) */}
//           <AnimatePresence>
//             {activeField === 'where' && (
//               <motion.div
//                 key="where-panel"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 10 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute top-[96px] left-0 z-50"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <SuggestedDestinations onSelect={handleDestinationSelect} />
//               </motion.div>
//             )}

//             {activeField === 'when' && (
//               <motion.div
//                 key="when-panel"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 10 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute top-[110px] left-1/2 -translate-x-1/2 z-50"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <Calendar
//                   checkIn={checkIn}
//                   checkOut={checkOut}
//                   onSelectDate={handleDatesSelect}
//                   onClose={closeAllPanels}
//                   bookedDates={[]}
//                 />
//               </motion.div>
//             )}

//             {activeField === 'who' && (
//               <motion.div
//                 key="who-panel"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: 10 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute top-full mt-4 right-0 z-50"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <Who
//                   isOpen={true}
//                   values={guests}
//                   onChange={handleGuestsChange}
//                   onClose={closeAllPanels}
//                 />
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;


// src/components/Navbar.jsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';

import home from '../assets/homes.png';
import experience from '../assets/experiences.png';
import service from '../assets/services.png';
import logo from '../assets/logo.png';
import user from '../assets/user.png';
import searchIcon from '../assets/search.png';
import BurgerMenu from './BurgerMenu';

// POPUP COMPONENTS
import SuggestedDestinations from './suggestdesination';
import Calendar from './Calendar';
import Who from './Who';

const Navbar = () => {
  const [selected, setSelected] = useState('home');
  const navigate = useNavigate();

  // which field is currently active: 'where' | 'when' | 'who' | null
  const [activeField, setActiveField] = useState(null);

  // search state
  const [destination, setDestination] = useState(null); // whole destination object from SuggestedDestinations
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const navItems = [
    { id: 'home',        label: 'Homes',       icon: home },
    { id: 'experience',  label: 'Experiences', icon: experience },
    { id: 'service',     label: 'Services',    icon: service },
  ];

  const toggleField = (field) => {
    setActiveField((prev) => (prev === field ? null : field));
  };

  const closeAllPanels = () => setActiveField(null);

  // handlers for child components
  const handleDestinationSelect = (dest) => {
    setDestination(dest);
    closeAllPanels();
  };

  const handleDatesSelect = (ci, co) => {
    setCheckIn(ci);
    setCheckOut(co);
  };

  const handleGuestsChange = (nextGuests) => {
    setGuests(nextGuests);
  };

  const resetSearchState = () => {
    setDestination(null);
    setCheckIn(null);
    setCheckOut(null);
    setGuests({
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    });
    setActiveField(null);
  };

  const handleLogoClick = () => {
    // reset UI + go to clean home screen (no filters)
    resetSearchState();
    navigate('/', { replace: true });
  };

  // 🔍 SEARCH HANDLER – sends filters to HomeScreen
  const handleSearch = () => {
    const totalGuests =
      (guests?.adults || 0) +
      (guests?.children || 0) +
      (guests?.infants || 0);

    const filters = {
      destinationId: destination?.id || null,
      destinationLabel: destination?.label || '',
      country: destination?.country || null, // will match Room.country
      checkIn: checkIn ? dayjs(checkIn).startOf('day').toISOString() : null,
      checkOut: checkOut ? dayjs(checkOut).startOf('day').toISOString() : null,
      guests: { ...guests },
      totalGuests,
    };

    // 1) navigate with filters (results use this)
    navigate('/', {
      state: {
        searchFilters: filters,
      },
    });

    // 2) close any open popups
    closeAllPanels();

    // 3) ✅ clear the search UI (but results stay filtered from the state we just sent)
    resetSearchState();
  };

  // display helpers
  const dateLabel = () => {
    if (checkIn && checkOut) {
      const from = dayjs(checkIn).format('DD MMM');
      const to = dayjs(checkOut).format('DD MMM');
      return `${from} – ${to}`;
    }
    return 'Add dates';
  };

  const whoLabel = () => {
    const mainGuests = guests.adults + guests.children + guests.infants;
    const pets = guests.pets;

    if (!mainGuests && !pets) return 'Add guest';

    const parts = [];
    if (mainGuests) {
      parts.push(`${mainGuests} guest${mainGuests > 1 ? 's' : ''}`);
    }
    if (pets) {
      parts.push(`${pets} pet${pets > 1 ? 's' : ''}`);
    }
    return parts.join(', ');
  };

  return (
    <div className="bg-[#f3f8fe] shadow-md px-10 py-5 rounded-t-xl relative z-40">
      {/* Top Navbar */}
      <div className="flex items-center justify-between">
        {/* Left - Logo */}
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
                    selected === item.id ? 'scale-110' : ''
                  }`}
                />
                <span
                  className={`text-[15px] transition-colors duration-200 ${
                    selected === item.id
                      ? 'font-semibold text-black'
                      : 'text-gray-800 hover:font-medium'
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
          <span className="text-sm font-medium">
            <Link to="/become-host">Become a host</Link>
          </span>
          <img src={user} alt="user" className="h-8 w-8 rounded-full bg-[#1a1d20]" />
          <BurgerMenu />
        </div>
      </div>

      {/* ----- SEARCH RIBBON + POPUPS ----- */}
      <div className="flex justify-center mt-6 relative">
        {/* Transparent overlay to close on outside-click (under nav, over content) */}
        <AnimatePresence>
          {activeField && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black z-30"
              onClick={closeAllPanels}
            />
          )}
        </AnimatePresence>

        {/* Search bar */}
        <div
          className="flex items-center bg-white rounded-full shadow-lg px-8 py-4 space-x-6 relative z-40"
        >
          {/* WHERE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleField('where');
            }}
            className={`flex flex-col pr-4 text-left ${
              activeField === 'where'
                ? 'bg-[#f5f7fb] rounded-full px-4 py-2 -ml-4'
                : ''
            }`}
          >
            <span className="text-[13px] font-semibold leading-5">Where</span>
            <span className="text-[13px] text-gray-500 leading-5">
              {destination ? destination.label : 'Search destination'}
            </span>
          </button>

          {/* Divider */}
          <div className="h-10 border-l border-gray-300" />

          {/* CHECK IN */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleField('when');
            }}
            className={`flex flex-col px-4 text-left ${
              activeField === 'when'
                ? 'bg-[#f5f7fb] rounded-full px-4 py-2 -mx-4'
                : ''
            }`}
          >
            <span className="text-[13px] font-semibold leading-5">
              Check in
            </span>
            <span className="text-[13px] text-gray-500 leading-5">
              {checkIn ? dayjs(checkIn).format('DD MMM') : 'Add dates'}
            </span>
          </button>

          {/* Divider */}
          <div className="h-10 border-l border-gray-300" />

          {/* CHECK OUT */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleField('when');
            }}
            className={`flex flex-col px-4 text-left ${
              activeField === 'when'
                ? 'bg-[#f5f7fb] rounded-full px-4 py-2 -mx-4'
                : ''
            }`}
          >
            <span className="text-[13px] font-semibold leading-5">
              Check Out
            </span>
            <span className="text-[13px] text-gray-500 leading-5">
              {checkOut ? dayjs(checkOut).format('DD MMM') : 'Add dates'}
            </span>
          </button>

          {/* Divider */}
          <div className="h-10 border-l border-gray-300" />

          {/* WHO */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleField('who');
            }}
            className={`flex flex-col pl-4 pr-2 text-left ${
              activeField === 'who'
                ? 'bg-[#f5f7fb] rounded-full px-4 py-2 -mr-4'
                : ''
            }`}
          >
            <span className="text-[13px] font-semibold leading-5">Who</span>
            <span className="text-[13px] text-gray-500 leading-5">
              {whoLabel()}
            </span>
          </button>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="ml-4 bg-[#e94a3f] p-3 rounded-full flex items-center justify-center"
          >
            <img src={searchIcon} alt="search" className="h-[18px] w-[18px]" />
          </button>

          {/* POPUPS (positioned relative to search bar) */}
          <AnimatePresence>
            {activeField === 'where' && (
              <motion.div
                key="where-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[96px] left-0 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <SuggestedDestinations onSelect={handleDestinationSelect} />
              </motion.div>
            )}

            {activeField === 'when' && (
              <motion.div
                key="when-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[110px] left-1/2 -translate-x-1/2 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <Calendar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelectDate={handleDatesSelect}
                  onClose={closeAllPanels}
                  bookedDates={[]}
                />
              </motion.div>
            )}

            {activeField === 'who' && (
              <motion.div
                key="who-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-4 right-0 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <Who
                  isOpen={true}
                  values={guests}
                  onChange={handleGuestsChange}
                  onClose={closeAllPanels}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
