// // src/pages/FinishBooking.jsx
// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import dayjs from "dayjs";

// import logo from "../assets/logo.png";
// import backimg from "../assets/paymentimages/backimg.png";
// import roomImg from "../assets/paymentimages/roomimg.png";
// import SuccessModalForFinish from "../components/SuccessModalForFinish";

// const FinishBooking = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const {
//     roomTitle,
//     roomImage,        // passed from PaymentPage
//     checkInDate,
//     checkOutDate,
//     guestSummary,
//     totalPrice,
//     reservationCode,
//   } = location.state || {};

//   // If someone types /finish manually with no state -> send home
//   useEffect(() => {
//     if (!location.state) {
//       navigate("/", { replace: true });
//     }
//   }, [location.state, navigate]);

//   const displayRoomImage = roomImage || roomImg;
//   const displayRoomTitle = roomTitle || "Roostr Listing";
//   const formattedCheckIn = checkInDate ? dayjs(checkInDate) : null;
//   const formattedCheckOut = checkOutDate ? dayjs(checkOutDate) : null;

//   const [showSuccess, setShowSuccess] = useState(false);

//   const handleFinishClick = () => {
//     setShowSuccess(true);
//   };

//   const handleModalConfirm = () => {
//     setShowSuccess(false);
//     navigate("/"); // finally go to homepage
//   };

//   return (
//     <>
//       {/* Simple top bar with logo (no global navbar/footer) */}
//       <div className="bg-[#f3f8fe] px-8 py-4">
//         <img src={logo} alt="Roostr" className="h-14 w-auto" />
//       </div>

//       <div className="min-h-[calc(100vh-88px)] bg-white flex flex-col items-center pt-10">
//         {/* Title row */}
//         <div className="w-full max-w-[960px] flex items-center gap-3 mb-10 px-6">
//           <button
//             onClick={() => navigate(-1)}
//             className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
//           >
//             <img src={backimg} alt="Back" className="w-4 h-4" />
//           </button>
//           <h2 className="text-xl font-semibold">Thank You!</h2>
//         </div>

//         {/* Center booking card */}
//         <div className="w-full flex justify-center px-4">
//           <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-6 w-full max-w-md">
//             <div className="flex gap-4 items-start mb-4">
//               <img
//                 src={displayRoomImage}
//                 alt="room"
//                 className="w-[90px] h-[80px] object-cover rounded-lg"
//               />
//               <div className="text-sm">
//                 <p className="font-semibold mb-1">{displayRoomTitle}</p>
//                 {formattedCheckIn && formattedCheckOut && (
//                   <p className="text-gray-600">
//                     {formattedCheckIn.format("MMM D, YYYY")} -{" "}
//                     {formattedCheckOut.format("MMM D, YYYY")}
//                   </p>
//                 )}
//                 <p className="text-gray-600 mt-1">
//                   {guestSummary || "1 guest"}
//                 </p>
//               </div>
//             </div>

//             <div className="border-t pt-3 mt-3 text-sm">
//               <div className="flex justify-between mb-2">
//                 <p className="text-gray-600">Reservation code</p>
//                 <p className="font-semibold">{reservationCode}</p>
//               </div>
//               <div className="flex justify-between">
//                 <p className="font-semibold">Total USD</p>
//                 <p className="font-semibold">
//                   ${Number(totalPrice || 0).toFixed(2)}
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={handleFinishClick}
//               className="mt-5 w-full bg-black text-white font-semibold py-2 rounded-md"
//             >
//               Finish
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Unique success modal just for this page */}
//       <SuccessModalForFinish
//         isOpen={showSuccess}
//         roomTitle={displayRoomTitle}
//         reservationCode={reservationCode}
//         totalPrice={totalPrice}
//         onConfirm={handleModalConfirm}
//       />
//     </>
//   );
// };

// export default FinishBooking;

// src/pages/FinishBooking.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import logo from "../assets/logo.png";
import backimg from "../assets/paymentimages/backimg.png";
import roomImg from "../assets/paymentimages/roomimg.png";
import SuccessModalForFinish from "../components/SuccessModalForFinish";

const FinishBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Safely extract state (prevents crash on refresh)
  const state = location.state || {};

  const {
    roomTitle = "Roostr Listing",
    roomImage,
    checkInDate,
    checkOutDate,
    guestSummary = "1 guest",
    totalPrice = 0,
    reservationCode = "",
  } = state;

  // If user opens /finish directly → redirect home
  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  const displayRoomImage = roomImage || roomImg;

  const formattedCheckIn = checkInDate
    ? dayjs(checkInDate)
    : null;

  const formattedCheckOut = checkOutDate
    ? dayjs(checkOutDate)
    : null;

  const [showSuccess, setShowSuccess] = useState(false);

  const handleFinishClick = () => {
    setShowSuccess(true);
  };

  const handleModalConfirm = () => {
    setShowSuccess(false);
    navigate("/"); // final redirect
  };

  return (
    <>
      {/* Top bar (no global navbar/footer) */}
      <div className="bg-[#f3f8fe] px-8 py-4">
        <img src={logo} alt="Roostr" className="h-14 w-auto" />
      </div>

      <div className="min-h-[calc(100vh-88px)] bg-white flex flex-col items-center pt-10">
        {/* Title row */}
        <div className="w-full max-w-[960px] flex items-center gap-3 mb-10 px-6">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <img src={backimg} alt="Back" className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-semibold">Thank You!</h2>
        </div>

        {/* Booking card */}
        <div className="w-full flex justify-center px-4">
          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-6 w-full max-w-md">
            <div className="flex gap-4 items-start mb-4">
              <img
                src={displayRoomImage}
                alt="room"
                className="w-[90px] h-[80px] object-cover rounded-lg"
              />
              <div className="text-sm">
                <p className="font-semibold mb-1">{roomTitle}</p>

                {formattedCheckIn && formattedCheckOut && (
                  <p className="text-gray-600">
                    {formattedCheckIn.format("MMM D, YYYY")} –{" "}
                    {formattedCheckOut.format("MMM D, YYYY")}
                  </p>
                )}

                <p className="text-gray-600 mt-1">{guestSummary}</p>
              </div>
            </div>

            <div className="border-t pt-3 mt-3 text-sm">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Reservation code</p>
                <p className="font-semibold">
                  {reservationCode || "—"}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="font-semibold">Total USD</p>
                <p className="font-semibold">
                  ${Number(totalPrice).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={handleFinishClick}
              className="mt-5 w-full bg-black text-white font-semibold py-2 rounded-md hover:bg-gray-900 transition"
            >
              Finish
            </button>
          </div>
        </div>
      </div>

      {/* Success modal */}
      <SuccessModalForFinish
        isOpen={showSuccess}
        roomTitle={roomTitle}
        reservationCode={reservationCode}
        totalPrice={totalPrice}
        onConfirm={handleModalConfirm}
      />
    </>
  );
};

export default FinishBooking;
