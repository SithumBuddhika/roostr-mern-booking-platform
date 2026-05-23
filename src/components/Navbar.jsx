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
    <div className="bg-[#f3f8fe] shadow-md px-4 md:px-10 py-3 md:py-5 rounded-t-xl relative z-40">
      {/* Top Navbar */}
      <div className="flex items-center justify-between">
        {/* Left - Logo */}
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <img src={logo} alt="Roostr" className="h-12 md:h-20 w-auto" />
        </div>

        {/* Center - Menu Items */}
        <div className="hidden md:flex items-center space-x-8 lg:space-x-16">
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
        <div className="flex items-center space-x-3 md:space-x-5">
          <span className="text-sm font-medium hidden md:inline">
            <Link to="/become-host">Become a host</Link>
          </span>
          <img src={user} alt="user" className="h-8 w-8 rounded-full bg-[#1a1d20]" />
          <BurgerMenu />
        </div>
      </div>

      {/* ----- SEARCH RIBBON + POPUPS ----- */}
      <div className="hidden md:flex justify-center mt-6 relative">
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

      {/* ----- MOBILE SEARCH BAR ----- */}
      <div className="flex md:hidden mt-3">
        <button
          type="button"
          onClick={() => toggleField('where')}
          className="flex items-center gap-3 w-full bg-white rounded-full shadow-md px-4 py-2.5"
        >
          <img src={searchIcon} alt="search" className="h-4 w-4 opacity-60" />
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-semibold leading-tight">
              {destination ? destination.label : 'Where to?'}
            </span>
            <span className="text-[11px] text-gray-500 leading-tight">
              {dateLabel()} · {whoLabel()}
            </span>
          </div>
        </button>
      </div>

      {/* Mobile panels */}
      <AnimatePresence>
        {activeField && (
          <motion.div
            key="mobile-search-overlay"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="md:hidden fixed inset-0 bg-[#f7f9fc] z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
              <button 
                type="button" 
                onClick={closeAllPanels}
                className="text-gray-600 text-sm font-semibold hover:text-black"
              >
                Cancel
              </button>
              <span className="text-base font-semibold">Search Roostr</span>
              <button 
                type="button" 
                onClick={resetSearchState}
                className="text-[#e94a3f] text-sm font-medium"
              >
                Clear all
              </button>
            </div>

            {/* Step Selector / Tabs */}
            <div className="flex bg-white px-4 py-2 shadow-sm gap-2">
              <button
                type="button"
                onClick={() => setActiveField('where')}
                className={`flex-1 py-2 text-center rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeField === 'where'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                1. Where
                <span className="block text-[10px] font-normal truncate max-w-[100px] mx-auto opacity-80">
                  {destination ? destination.label : 'Anywhere'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveField('when')}
                className={`flex-1 py-2 text-center rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeField === 'when'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                2. When
                <span className="block text-[10px] font-normal truncate max-w-[100px] mx-auto opacity-80">
                  {checkIn && checkOut 
                    ? `${dayjs(checkIn).format('DD MMM')} - ${dayjs(checkOut).format('DD MMM')}` 
                    : 'Any week'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveField('who')}
                className={`flex-1 py-2 text-center rounded-xl text-xs font-semibold transition-all duration-200 ${
                  activeField === 'who'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                3. Who
                <span className="block text-[10px] font-normal truncate max-w-[100px] mx-auto opacity-80">
                  {whoLabel() === 'Add guest' ? 'Add guests' : whoLabel()}
                </span>
              </button>
            </div>

            {/* Active Step Panel Content */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-grow overflow-y-auto">
                {activeField === 'where' && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Where are you going?</h3>
                    <SuggestedDestinations onSelect={(dest) => { 
                      handleDestinationSelect(dest); 
                      setActiveField('when'); 
                    }} />
                  </div>
                )}

                {activeField === 'when' && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-3">When's your trip?</h3>
                    <Calendar
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onSelectDate={handleDatesSelect}
                      onClose={() => setActiveField('who')}
                      bookedDates={[]}
                    />
                  </div>
                )}

                {activeField === 'who' && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Who is coming?</h3>
                    <Who
                      isOpen={true}
                      values={guests}
                      onChange={handleGuestsChange}
                      onClose={() => {}}
                    />
                  </div>
                )}
              </div>

              {/* Bottom Search Actions */}
              <div className="mt-4 bg-white p-3 rounded-2xl shadow-md border border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex-grow bg-[#e94a3f] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-200 active:scale-95 transition-transform"
                >
                  Search Stays
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
