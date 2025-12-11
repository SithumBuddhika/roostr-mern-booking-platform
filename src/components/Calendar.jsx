// import React, { useState } from 'react';
// import dayjs from 'dayjs';
// import { motion, AnimatePresence } from 'framer-motion';

// const Calendar = ({ checkIn, checkOut, onSelectDate, onClose, bookedDates = [] }) => {
//   const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
//   const [localCheckIn, setLocalCheckIn] = useState(checkIn);
//   const [localCheckOut, setLocalCheckOut] = useState(checkOut);
//   const nextMonth = currentMonth.add(1, 'month');

//   const goToPreviousMonth = () => setCurrentMonth(prev => prev.subtract(1, 'month'));
//   const goToNextMonth = () => setCurrentMonth(prev => prev.add(1, 'month'));

//   const isPastDate = (date) => date.isBefore(dayjs().startOf('day'));
//   const isBooked = (date) => bookedDates.includes(date.format('YYYY-MM-DD'));

//   const onSelectDateClick = (date) => {
//     if (isPastDate(date) || isBooked(date)) return;
//     if (!localCheckIn || (localCheckIn && localCheckOut)) {
//       setLocalCheckIn(date);
//       setLocalCheckOut(null);
//     } else if (localCheckIn && !localCheckOut && date.isAfter(localCheckIn)) {
//       setLocalCheckOut(date);
//     } else {
//       setLocalCheckIn(date);
//       setLocalCheckOut(null);
//     }
//   };

//   const applyDates = () => {
//     if (localCheckIn && localCheckOut) {
//       onSelectDate(localCheckIn, localCheckOut);
//       setTimeout(() => onClose(), 0);
//     }
//   };

//   const clearDates = () => {
//     setLocalCheckIn(null);
//     setLocalCheckOut(null);
//     setTimeout(() => onSelectDate(null, null), 0);
//   };

//   const renderMonth = (month) => {
//     const startDay = month.startOf('month').day();
//     const totalDays = month.daysInMonth();
//     const days = [];

//     for (let i = 0; i < startDay; i++) days.push(<div key={`pad-${month}-${i}`} />);

//     for (let i = 1; i <= totalDays; i++) {
//       const date = month.date(i);
//       const selectedStart = localCheckIn && date.isSame(localCheckIn, 'day');
//       const selectedEnd = localCheckOut && date.isSame(localCheckOut, 'day');
//       const isInRange = localCheckIn && localCheckOut && date.isAfter(localCheckIn, 'day') && date.isBefore(localCheckOut, 'day');
//       const disabled = isPastDate(date) || isBooked(date);

//       days.push(
//         <div
//           key={`${month}-${i}`}
//           onClick={() => onSelectDateClick(date)}
//           className={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition-all
//             ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
//             ${selectedStart || selectedEnd ? 'bg-black text-white font-bold' : ''}
//             ${isInRange ? 'bg-gray-300 text-black' : ''}`}
//         >
//           {i}
//         </div>
//       );
//     }

//     return (
//       <div className="w-[220px]">
//         <h2 className="font-semibold text-[13px] text-center mb-2">{month.format('MMMM YYYY')}</h2>
//         <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//             <div key={`${month}-${day}`} className="font-medium text-gray-500 text-[11px]">{day}</div>
//           ))}
//           {days}
//         </div>
//       </div>
//     );
//   };

//   const getNights = () => {
//     if (localCheckIn && localCheckOut) {
//       return dayjs(localCheckOut).diff(localCheckIn, 'day');
//     }
//     return null;
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         transition={{ duration: 0.3 }}
//         className="absolute z-50 bg-white p-3 shadow-xl rounded-xl w-[500px]"
//       >
//         {/* Top Summary */}
//         <div className="mb-3">
//           {getNights() && (
//             <p className="text-[12px] font-semibold mb-1">{getNights()} night{getNights() > 1 ? 's' : ''}</p>
//           )}
//           <div className="flex gap-6">
//             <div>
//               <p className="text-xs font-semibold text-gray-500">CHECK-IN</p>
//               <p className="text-[12px] font-medium">
//                 {localCheckIn ? dayjs(localCheckIn).format('DD/MM/YYYY') : 'Add date'}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-semibold text-gray-500">CHECKOUT</p>
//               <p className="text-[12px] font-medium">
//                 {localCheckOut ? dayjs(localCheckOut).format('DD/MM/YYYY') : 'Add date'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Month Navigation */}
//         <div className="flex justify-between items-center mb-3 px-2">
//           <button onClick={goToPreviousMonth} className="text-xl font-light">&#8249;</button>
//           <h2 className="font-semibold text-[13px]">{currentMonth.format('MMMM YYYY')} - {nextMonth.format('MMMM YYYY')}</h2>
//           <button onClick={goToNextMonth} className="text-xl font-light">&#8250;</button>
//         </div>

//         {/* Two Month View */}
//         <div className="flex justify-between gap-4 px-4">
//           {renderMonth(currentMonth)}
//           {renderMonth(nextMonth)}
//         </div>

//         <div className="flex justify-between mt-5">
//           <button
//             onClick={applyDates}
//             disabled={!(localCheckIn && localCheckOut)}
//             className={`px-4 py-1 text-xs rounded-md font-medium ${
//               localCheckIn && localCheckOut
//                 ? 'bg-black text-white'
//                 : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             Apply
//           </button>
//           <div className="flex gap-2">
//             <button
//               onClick={clearDates}
//               className="px-4 py-1 border text-xs rounded-md font-medium hover:bg-gray-100"
//             >
//               Clear dates
//             </button>
//             <button
//               onClick={onClose}
//               className="px-4 py-1 border text-xs rounded-md font-medium hover:bg-gray-100"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default Calendar;



// import React, { useState, useEffect } from 'react';
// import dayjs from 'dayjs';
// import { motion, AnimatePresence } from 'framer-motion';

// const Calendar = ({ checkIn, checkOut, onSelectDate, onClose, bookedDates = [] }) => {
//   const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
//   const [localCheckIn, setLocalCheckIn] = useState(checkIn);
//   const [localCheckOut, setLocalCheckOut] = useState(checkOut);
//   const nextMonth = currentMonth.add(1, 'month');

//   const goToPreviousMonth = () => setCurrentMonth(prev => prev.subtract(1, 'month'));
//   const goToNextMonth = () => setCurrentMonth(prev => prev.add(1, 'month'));

//   const isPastDate = (date) => date.isBefore(dayjs().startOf('day'));
//   const isBooked = (date) => bookedDates.includes(date.format('YYYY-MM-DD'));

//   const onSelectDateClick = (date) => {
//     if (isPastDate(date) || isBooked(date)) return;
//     if (!localCheckIn || (localCheckIn && localCheckOut)) {
//       setLocalCheckIn(date);
//       setLocalCheckOut(null);
//     } else if (localCheckIn && !localCheckOut && date.isAfter(localCheckIn)) {
//       setLocalCheckOut(date);
//     } else {
//       setLocalCheckIn(date);
//       setLocalCheckOut(null);
//     }
//   };

//   const applyDates = () => {
//     if (localCheckIn && localCheckOut) {
//       onSelectDate(localCheckIn, localCheckOut);
//       onClose();
//     }
//   };

//   const clearDates = () => {
//     setLocalCheckIn(null);
//     setLocalCheckOut(null);
//     onSelectDate(null, null);
//   };

//   const renderMonth = (month) => {
//     const startDay = month.startOf('month').day();
//     const totalDays = month.daysInMonth();
//     const days = [];

//     for (let i = 0; i < startDay; i++) days.push(<div key={`pad-${month}-${i}`} />);

//     for (let i = 1; i <= totalDays; i++) {
//       const date = month.date(i);
//       const selectedStart = localCheckIn && date.isSame(localCheckIn, 'day');
//       const selectedEnd = localCheckOut && date.isSame(localCheckOut, 'day');
//       const isInRange = localCheckIn && localCheckOut && date.isAfter(localCheckIn, 'day') && date.isBefore(localCheckOut, 'day');
//       const disabled = isPastDate(date) || isBooked(date);

//       days.push(
//         <div
//           key={`${month}-${i}`}
//           onClick={() => onSelectDateClick(date)}
//           className={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition-all
//             ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
//             ${selectedStart || selectedEnd ? 'bg-black text-white font-bold' : ''}
//             ${isInRange ? 'bg-gray-300 text-black' : ''}`}
//         >
//           {i}
//         </div>
//       );
//     }

//     return (
//       <div className="w-[220px]">
//         <h2 className="font-semibold text-[13px] text-center mb-2">{month.format('MMMM YYYY')}</h2>
//         <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//             <div key={`${month}-${day}`} className="font-medium text-gray-500 text-[11px]">{day}</div>
//           ))}
//           {days}
//         </div>
//       </div>
//     );
//   };

//   const getNights = () => {
//     if (localCheckIn && localCheckOut) {
//       return dayjs(localCheckOut).diff(localCheckIn, 'day');
//     }
//     return null;
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         transition={{ duration: 0.3 }}
//         className="absolute z-50 bg-white p-3 shadow-xl rounded-xl w-[500px]"
//       >
//         {/* Top Summary */}
//         <div className="mb-3">
//           {getNights() && (
//             <p className="text-[12px] font-semibold mb-1">{getNights()} night{getNights() > 1 ? 's' : ''}</p>
//           )}
//           <div className="flex gap-6">
//             <div>
//               <p className="text-xs font-semibold text-gray-500">CHECK-IN</p>
//               <p className="text-[12px] font-medium">
//                 {localCheckIn ? dayjs(localCheckIn).format('DD/MM/YYYY') : 'Add date'}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-semibold text-gray-500">CHECKOUT</p>
//               <p className="text-[12px] font-medium">
//                 {localCheckOut ? dayjs(localCheckOut).format('DD/MM/YYYY') : 'Add date'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Month Navigation */}
//         <div className="flex justify-between items-center mb-3 px-2">
//           <button onClick={goToPreviousMonth} className="text-xl font-light">&#8249;</button>
//           <h2 className="font-semibold text-[13px]">{currentMonth.format('MMMM YYYY')} - {nextMonth.format('MMMM YYYY')}</h2>
//           <button onClick={goToNextMonth} className="text-xl font-light">&#8250;</button>
//         </div>

//         {/* Two Month View */}
//         <div className="flex justify-between gap-4 px-4">
//           {renderMonth(currentMonth)}
//           {renderMonth(nextMonth)}
//         </div>

//         <div className="flex justify-between mt-5">
//           <button
//             onClick={applyDates}
//             disabled={!(localCheckIn && localCheckOut)}
//             className={`px-4 py-1 text-xs rounded-md font-medium ${
//               localCheckIn && localCheckOut
//                 ? 'bg-black text-white'
//                 : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             Apply
//           </button>
//           <div className="flex gap-2">
//             <button
//               onClick={clearDates}
//               className="px-4 py-1 border text-xs rounded-md font-medium hover:bg-gray-100"
//             >
//               Clear dates
//             </button>
//             <button
//               onClick={onClose}
//               className="px-4 py-1 border text-xs rounded-md font-medium hover:bg-gray-100"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default Calendar;

// import React, { useState } from 'react';
// import dayjs from 'dayjs';
// import { motion, AnimatePresence } from 'framer-motion';

// const Calendar = ({ checkIn, checkOut, onSelectDate, onClose, bookedDates = [] }) => {
//   const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
//   const [localCheckIn, setLocalCheckIn] = useState(checkIn);
//   const [localCheckOut, setLocalCheckOut] = useState(checkOut);
//   const nextMonth = currentMonth.add(1, 'month');

//   const goToPreviousMonth = () => setCurrentMonth(prev => prev.subtract(1, 'month'));
//   const goToNextMonth = () => setCurrentMonth(prev => prev.add(1, 'month'));

//   const isPastDate = (date) => date.isBefore(dayjs().startOf('day'));
//   const isBooked = (date) => bookedDates.includes(date.format('YYYY-MM-DD'));

//   const onSelectDateClick = (date) => {
//     if (isPastDate(date) || isBooked(date)) return;

//     if (!localCheckIn || (localCheckIn && localCheckOut)) {
//       setLocalCheckIn(date);
//       setLocalCheckOut(null);
//     } else if (localCheckIn && !localCheckOut) {
//       if (date.isAfter(localCheckIn)) {
//         setLocalCheckOut(date);
//         // Apply both dates immediately
//         setTimeout(() => {
//           onSelectDate(localCheckIn, date);
//           onClose();
//         }, 50);
//       } else {
//         setLocalCheckIn(date);
//         setLocalCheckOut(null);
//       }
//     }
//   };

//   const applyDates = () => {
//     if (localCheckIn && localCheckOut) {
//       onSelectDate(localCheckIn, localCheckOut);
//       onClose();
//     }
//   };

//   const clearDates = () => {
//     setLocalCheckIn(null);
//     setLocalCheckOut(null);
//     onSelectDate(null, null);
//   };

//   const renderMonth = (month) => {
//     const startDay = month.startOf('month').day();
//     const totalDays = month.daysInMonth();
//     const days = [];

//     for (let i = 0; i < startDay; i++) days.push(<div key={`pad-${month}-${i}`} />);

//     for (let i = 1; i <= totalDays; i++) {
//       const date = month.date(i);
//       const selectedStart = localCheckIn && date.isSame(localCheckIn, 'day');
//       const selectedEnd = localCheckOut && date.isSame(localCheckOut, 'day');
//       const isInRange = localCheckIn && localCheckOut && date.isAfter(localCheckIn, 'day') && date.isBefore(localCheckOut, 'day');
//       const disabled = isPastDate(date) || isBooked(date);

//       days.push(
//         <div
//           key={`${month}-${i}`}
//           onClick={() => onSelectDateClick(date)}
//           className={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition-all
//             ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
//             ${selectedStart || selectedEnd ? 'bg-black text-white font-bold' : ''}
//             ${isInRange ? 'bg-gray-300 text-black' : ''}`}
//         >
//           {i}
//         </div>
//       );
//     }

//     return (
//       <div className="w-[220px]">
//         <h2 className="font-semibold text-[13px] text-center mb-2">{month.format('MMMM YYYY')}</h2>
//         <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//             <div key={`${month}-${day}`} className="font-medium text-gray-500 text-[11px]">{day}</div>
//           ))}
//           {days}
//         </div>
//       </div>
//     );
//   };

//   const getNights = () => {
//     if (localCheckIn && localCheckOut) {
//       return dayjs(localCheckOut).diff(localCheckIn, 'day');
//     }
//     return null;
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 20 }}
//         transition={{ duration: 0.3 }}
//         className="absolute z-50 bg-white p-3 shadow-xl rounded-xl w-[500px]"
//       >
//         {/* Top Summary */}
//         <div className="mb-3">
//           {getNights() && (
//             <p className="text-[12px] font-semibold mb-1">{getNights()} night{getNights() > 1 ? 's' : ''}</p>
//           )}
//           <div className="flex gap-6">
//             <div>
//               <p className="text-xs font-semibold text-gray-500">CHECK-IN</p>
//               <p className="text-[12px] font-medium">
//                 {localCheckIn ? dayjs(localCheckIn).format('DD/MM/YYYY') : 'Add date'}
//               </p>
//             </div>
//             <div>
//               <p className="text-xs font-semibold text-gray-500">CHECKOUT</p>
//               <p className="text-[12px] font-medium">
//                 {localCheckOut ? dayjs(localCheckOut).format('DD/MM/YYYY') : 'Add date'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Month Navigation */}
//         <div className="flex justify-between items-center mb-3 px-2">
//           <button onClick={goToPreviousMonth} className="text-xl font-light">&#8249;</button>
//           <h2 className="font-semibold text-[13px]">{currentMonth.format('MMMM YYYY')} - {nextMonth.format('MMMM YYYY')}</h2>
//           <button onClick={goToNextMonth} className="text-xl font-light">&#8250;</button>
//         </div>

//         {/* Two Month View */}
//         <div className="flex justify-between gap-4 px-4">
//           {renderMonth(currentMonth)}
//           {renderMonth(nextMonth)}
//         </div>

//         <div className="flex justify-between mt-5">
//           <button
//             onClick={applyDates}
//             disabled={!(localCheckIn && localCheckOut)}
//             className={`px-4 py-1 text-xs rounded-md font-medium ${
//               localCheckIn && localCheckOut
//                 ? 'bg-black text-white'
//                 : 'bg-gray-200 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             Apply
//           </button>
//           <div className="flex gap-2">
//             <button
//               onClick={clearDates}
//               className="px-4 py-1 border text-xs rounded-md font-medium hover:bg-gray-100"
//             >
//               Clear dates
//             </button>
//             <button
//               onClick={onClose}
//               className="px-4 py-1 border text-xs rounded-md font-medium hover:bg-gray-100"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default Calendar;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar = ({ checkIn, checkOut, onSelectDate, onClose, bookedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [localCheckIn, setLocalCheckIn] = useState(checkIn);
  const [localCheckOut, setLocalCheckOut] = useState(checkOut);
  const nextMonth = currentMonth.add(1, 'month');

  const goToPreviousMonth = () => setCurrentMonth(prev => prev.subtract(1, 'month'));
  const goToNextMonth = () => setCurrentMonth(prev => prev.add(1, 'month'));

  const isPastDate = (date) => date.isBefore(dayjs().startOf('day'));
  const isBooked = (date) => bookedDates.includes(date.format('YYYY-MM-DD'));

  const onSelectDateClick = (date) => {
    if (isPastDate(date) || isBooked(date)) return;

    if (!localCheckIn || (localCheckIn && localCheckOut)) {
      setLocalCheckIn(date);
      setLocalCheckOut(null);
    } else if (localCheckIn && !localCheckOut) {
      if (date.isAfter(localCheckIn)) {
        const newCheckOut = date;
        setLocalCheckOut(newCheckOut);
        onSelectDate(localCheckIn, newCheckOut);
        onClose();
      } else {
        setLocalCheckIn(date);
        setLocalCheckOut(null);
      }
    }
  };

  const applyDates = () => {
    if (localCheckIn && localCheckOut) {
      onSelectDate(localCheckIn, localCheckOut);
      onClose();
    }
  };

  const clearDates = () => {
    setLocalCheckIn(null);
    setLocalCheckOut(null);
    onSelectDate(null, null); // Immediately clear parent state
    onClose(); // Close the calendar right after
  };

  const renderMonth = (month) => {
    const startDay = month.startOf('month').day();
    const totalDays = month.daysInMonth();
    const days = [];

    for (let i = 0; i < startDay; i++) days.push(<div key={`pad-${month}-${i}`} />);

    for (let i = 1; i <= totalDays; i++) {
      const date = month.date(i);
      const selectedStart = localCheckIn && date.isSame(localCheckIn, 'day');
      const selectedEnd = localCheckOut && date.isSame(localCheckOut, 'day');
      const isInRange = localCheckIn && localCheckOut && date.isAfter(localCheckIn, 'day') && date.isBefore(localCheckOut, 'day');
      const disabled = isPastDate(date) || isBooked(date);

      days.push(
        <div
          key={`${month}-${i}`}
          onClick={() => onSelectDateClick(date)}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition-all
            ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}
            ${selectedStart || selectedEnd ? 'bg-black text-white font-bold' : ''}
            ${isInRange ? 'bg-gray-300 text-black' : ''}`}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="w-[220px]">
        <h2 className="font-semibold text-[13px] text-center mb-2">{month.format('MMMM YYYY')}</h2>
        <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={`${month}-${day}`} className="font-medium text-gray-500 text-[11px]">{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const getNights = () => {
    if (localCheckIn && localCheckOut) {
      return dayjs(localCheckOut).diff(localCheckIn, 'day');
    }
    return null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        // className="absolute z-50 bg-white p-3 shadow-xl rounded-xl w-[500px]"
        // className="absolute z-50 bg-white p-3 shadow-xl rounded-xl w-[500px] left-1/2 transform -translate-x-1/2"
        className="absolute z-50 right-0 z-50 bg-white p-3 shadow-xl rounded-xl w-[500px]"

      >
        {/* Top Summary */}
        <div className="mb-3">
          {getNights() && (
            <p className="text-[12px] font-semibold mb-1">{getNights()} night{getNights() > 1 ? 's' : ''}</p>
          )}
          <div className="flex gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500">CHECK-IN</p>
              <p className="text-[12px] font-medium">
                {localCheckIn ? dayjs(localCheckIn).format('DD/MM/YYYY') : 'Add date'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">CHECKOUT</p>
              <p className="text-[12px] font-medium">
                {localCheckOut ? dayjs(localCheckOut).format('DD/MM/YYYY') : 'Add date'}
              </p>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-3 px-2">
          <button onClick={goToPreviousMonth} className="text-xl font-light">&#8249;</button>
          <h2 className="font-semibold text-[13px]">{currentMonth.format('MMMM YYYY')} - {nextMonth.format('MMMM YYYY')}</h2>
          <button onClick={goToNextMonth} className="text-xl font-light">&#8250;</button>
        </div>

        {/* Two Month View */}
        <div className="flex justify-between gap-4 px-4">
          {renderMonth(currentMonth)}
          {renderMonth(nextMonth)}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-5">
          <button
            onClick={applyDates}
            disabled={!(localCheckIn && localCheckOut)}
            className={`px-4 py-1 text-xs rounded-md font-medium ${
              localCheckIn && localCheckOut
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Apply
          </button>
          <div className="flex gap-2">
            <button
              onClick={clearDates}
              className="px-4 py-1 border text-xs rounded-md font-medium hover:bg-gray-100"
            >
              Clear dates
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1 border text-xs rounded-md font-medium hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Calendar;
