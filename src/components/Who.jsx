// // src/components/Who.jsx
// import React, { useState, useEffect } from 'react';

// const defaultGuests = {
//   adults: 1,
//   children: 0,
//   infants: 0,
//   pets: 0,
// };

// const Who = ({ isOpen, initialGuests, onChange }) => {
//   const [guests, setGuests] = useState(defaultGuests);

//   // allow parent to set initial values
//   useEffect(() => {
//     if (initialGuests) {
//       setGuests({ ...defaultGuests, ...initialGuests });
//     }
//   }, [initialGuests]);

//   const updateCount = (key, delta) => {
//     setGuests((prev) => {
//       const min = key === 'adults' ? 1 : 0; // adults min 1, others 0
//       const next = Math.max(min, prev[key] + delta);
//       const updated = { ...prev, [key]: next };
//       if (onChange) onChange(updated);
//       return updated;
//     });
//   };

//   const rows = [
//     { id: 'adults', label: 'Adults', subtitle: 'Age 13+' },
//     { id: 'children', label: 'Children', subtitle: 'Age 2 - 12' },
//     { id: 'infants', label: 'Infants', subtitle: 'Under 2' },
//     { id: 'pets', label: 'Pets', subtitle: '' },
//   ];

//   return (
//     <div
//       className={`
//         fixed left-1/2 top-32 z-30
//         -translate-x-1/2
//         transition-all duration-200 ease-out
//         ${isOpen
//           ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
//           : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
//         }
//       `}
//     >
//       <div
//         className="
//           w-[430px]
//           bg-white
//           rounded-[26px]
//           shadow-[0_22px_60px_rgba(0,0,0,0.28)]
//           px-8 py-6
//         "
//       >
//         <div className="space-y-5">
//           {rows.map((row) => (
//             <div
//               key={row.id}
//               className="flex items-center justify-between"
//             >
//               {/* Text side */}
//               <div className="flex flex-col">
//                 <span className="text-[20px] font-semibold text-[#111111] leading-snug">
//                   {row.label}
//                 </span>
//                 {row.subtitle && (
//                   <span className="text-[14px] text-[#6b6b6b] mt-[2px]">
//                     {row.subtitle}
//                   </span>
//                 )}
//               </div>

//               {/* Controls */}
//               <div className="flex items-center gap-4">
//                 {/* Minus */}
//                 <button
//                   type="button"
//                   onClick={() => updateCount(row.id, -1)}
//                   className="
//                     w-11 h-11 rounded-full
//                     bg-[#e2e2e2]
//                     flex items-center justify-center
//                     text-[22px] leading-none
//                     text-[#333333]
//                     hover:bg-[#d6d6d6]
//                     active:bg-[#c9c9c9]
//                     transition-colors
//                   "
//                 >
//                   –
//                 </button>

//                 {/* Count */}
//                 <span className="w-5 text-center text-[18px] text-[#111111]">
//                   {guests[row.id]}
//                 </span>

//                 {/* Plus */}
//                 <button
//                   type="button"
//                   onClick={() => updateCount(row.id, 1)}
//                   className="
//                     w-11 h-11 rounded-full
//                     bg-[#e2e2e2]
//                     flex items-center justify-center
//                     text-[22px] leading-none
//                     text-[#333333]
//                     hover:bg-[#d6d6d6]
//                     active:bg-[#c9c9c9]
//                     transition-colors
//                   "
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Who;


// src/components/Who.jsx
import React, { useState, useEffect } from 'react';

const defaultGuests = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
};

const Who = ({ isOpen, values, onChange }) => {
  const [guests, setGuests] = useState(defaultGuests);

  // allow parent to set current values (from Navbar)
  useEffect(() => {
    if (values) {
      setGuests({ ...defaultGuests, ...values });
    }
  }, [values]);

  const updateCount = (key, delta) => {
    setGuests((prev) => {
      const min = key === 'adults' ? 1 : 0; // adults min 1, others 0
      const next = Math.max(min, prev[key] + delta);
      const updated = { ...prev, [key]: next };
      if (onChange) onChange(updated);
      return updated;
    });
  };

  const rows = [
    { id: 'adults', label: 'Adults', subtitle: 'Age 13+' },
    { id: 'children', label: 'Children', subtitle: 'Age 2 - 12' },
    { id: 'infants', label: 'Infants', subtitle: 'Under 2' },
    { id: 'pets', label: 'Pets', subtitle: '' },
  ];

  return (
    <div
      className={`
        transition-all duration-200 ease-out
        ${isOpen
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-95 pointer-events-none'
        }
      `}
    >
      <div
        className="
          w-[430px]
          bg-white
          rounded-[26px]
          shadow-[0_22px_60px_rgba(0,0,0,0.28)]
          px-8 py-6
        "
      >
        <div className="space-y-5">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between"
            >
              {/* Text side */}
              <div className="flex flex-col">
                <span className="text-[20px] font-semibold text-[#111111] leading-snug">
                  {row.label}
                </span>
                {row.subtitle && (
                  <span className="text-[14px] text-[#6b6b6b] mt-[2px]">
                    {row.subtitle}
                  </span>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                {/* Minus */}
                <button
                  type="button"
                  onClick={() => updateCount(row.id, -1)}
                  className="
                    w-11 h-11 rounded-full
                    bg-[#e2e2e2]
                    flex items-center justify-center
                    text-[22px] leading-none
                    text-[#333333]
                    hover:bg-[#d6d6d6]
                    active:bg-[#c9c9c9]
                    transition-colors
                  "
                >
                  –
                </button>

                {/* Count */}
                <span className="w-5 text-center text-[18px] text-[#111111]">
                  {guests[row.id]}
                </span>

                {/* Plus */}
                <button
                  type="button"
                  onClick={() => updateCount(row.id, 1)}
                  className="
                    w-11 h-11 rounded-full
                    bg-[#e2e2e2]
                    flex items-center justify-center
                    text-[22px] leading-none
                    text-[#333333]
                    hover:bg-[#d6d6d6]
                    active:bg-[#c9c9c9]
                    transition-colors
                  "
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Who;
