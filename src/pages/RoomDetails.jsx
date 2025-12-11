// // src/pages/RoomDetails.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import dayjs from "dayjs";
// import Calendar from "../components/Calendar";
// import AmenitiesModal from "../components/AmenitiesModal";

// // Fallback room hero images (used if backend images missing)
// import room1 from "../assets/roomimages/room1.png";
// import room2 from "../assets/roomimages/room2.png";
// import room3 from "../assets/roomimages/room3.png";
// import room4 from "../assets/roomimages/room4.png";
// import room5 from "../assets/roomimages/room5.png";

// // Perk icons (highlights)
// import perkCheckin from "../assets/roomimages/perk-checkin.png";
// import perkPark from "../assets/roomimages/perk-park.png";
// import perkSuperhost from "../assets/roomimages/perk-superhost.png";
// import perkOutdoor from "../assets/roomimages/perk-outdoor.png";

// // Amenities icons
// import kitchen from "../assets/roomimages/kitchen.png";
// import parking from "../assets/roomimages/parking.png";
// import washer from "../assets/roomimages/washer.png";
// import pool from "../assets/roomimages/pool.png";
// import bbq from "../assets/roomimages/bbq.png";
// import wifi from "../assets/roomimages/wifi.png";
// import tv from "../assets/roomimages/tv.png";
// import ac from "../assets/roomimages/ac.png";
// import sauna from "../assets/roomimages/sauna.png";
// import jacuzzi from "../assets/roomimages/jacuzzi.png";

// // Rating icons
// import ratingClean from "../assets/roomimages/rating-clean.png";
// import ratingAccuracy from "../assets/roomimages/rating-accuracy.png";
// import ratingCheckin from "../assets/roomimages/rating-checkin.png";
// import ratingComm from "../assets/roomimages/rating-comm.png";
// import ratingLocation from "../assets/roomimages/rating-location.png";
// import ratingValue from "../assets/roomimages/rating-value.png";

// // Host / customer / misc
// import hostImg from "../assets/roomimages/host.png";
// import customerImg from "../assets/roomimages/customer.png";
// import shieldLogo from "../assets/roomimages/shield-logo.png";
// import dropdownIcon from "../assets/roomimages/dropdownIcon.png";
// import plusIcon from "../assets/roomimages/plus.png";
// import minusIcon from "../assets/roomimages/minus.png";

// // ---------------- MAPPINGS FROM ROOM DATA → UI ----------------

// // These IDs MUST match what AddNewRoom sends in `highlights`
// const HIGHLIGHT_CONFIG = [
//   {
//     id: "selfCheck",
//     img: perkCheckin,
//     title: "Self Check-in",
//     desc: "Check yourself in with the lockbox.",
//   },
//   {
//     id: "parkFree",
//     img: perkPark,
//     title: "Park for free",
//     desc: "This is one of the few places in the area with free parking.",
//   },
//   {
//     id: "superhost",
//     img: perkSuperhost,
//     title: "Superhost",
//     desc: "Superhosts are experienced, highly rated Hosts.",
//   },
//   {
//     id: "outdoorEntertainment",
//     img: perkOutdoor,
//     title: "Outdoor entertainment",
//     desc: "The pool and outdoor seating are great for summer trips.",
//   },
// ];

// // These IDs MUST match `amenities` from AddNewRoom
// const AMENITY_CONFIG = [
//   {
//     id: "kitchen",
//     img: kitchen,
//     label: "Kitchen",
//     category: "Kitchen & dining",
//   },
//   {
//     id: "freeParking",
//     img: parking,
//     label: "Free parking on premises",
//     category: "Parking & facilities",
//   },
//   {
//     id: "washerDryer",
//     img: washer,
//     label: "Washer",
//     category: "Bedroom & laundry",
//   },
//   { id: "pool", img: pool, label: "Pool", category: "Facilities" },
//   { id: "bbq", img: bbq, label: "BBQ Machine", category: "Outdoor" },
//   { id: "wifi", img: wifi, label: "Wifi", category: "Entertainment" },
//   { id: "tv", img: tv, label: "TV", category: "Entertainment" },
//   {
//     id: "ac",
//     img: ac,
//     label: "Air conditioning",
//     category: "Heating & cooling",
//   },
//   { id: "sauna", img: sauna, label: "Sauna", category: "Spa" },
//   { id: "jacuzzi", img: jacuzzi, label: "Jacuzzi", category: "Spa" },
// ];

// const reviews = [
//   {
//     name: "Youssef",
//     location: "Cairo, Egypt",
//     date: "1 week ago",
//     stay: "Stayed a few nights",
//     stars: 5,
//     comment: "Great location , super clean , and great host",
//   },
//   {
//     name: "Adam",
//     location: "Mina, Lebanon",
//     date: "May 2025",
//     stay: "Stayed in one night",
//     stars: 4,
//     comment:
//       "We had a great stay! The place was exactly as described. Comfortable, well maintained, and in a great location. One of the things I appreciated most was the cleanliness; everything was spotless and well taken care of. Highly recommend this place and would definitely stay again.",
//   },
//   {
//     name: "Adam",
//     location: "Mina, Lebanon",
//     date: "May 2025",
//     stay: "Stayed in one night",
//     stars: 5,
//     comment:
//       "The place is amazing really feels like home. The host is a great, very friendly person. I really suggest the stay there .",
//   },
//   {
//     name: "Adam",
//     location: "Mina, Lebanon",
//     date: "May 2025",
//     stay: "Stayed in one night",
//     stars: 4,
//     comment: "The place was better than the picture. Also , Mona is so responsive",
//   },
// ];

// const RoomDetails = () => {
//   // -------- URL PARAM & ROOM FETCHING ----------
//   const { id } = useParams(); // /room/:id
//   const [room, setRoom] = useState(null);
//   const [loadingRoom, setLoadingRoom] = useState(true);
//   const [roomError, setRoomError] = useState("");

//   useEffect(() => {
//     if (!id) {
//       setRoomError("Room id is missing from URL.");
//       setLoadingRoom(false);
//       return;
//     }

//     const fetchRoom = async () => {
//       try {
//         setLoadingRoom(true);
//         setRoomError("");
//         const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
//         setRoom(res.data.room);
//       } catch (err) {
//         console.error("Failed to load room:", err);
//         setRoomError("Failed to load room details.");
//       } finally {
//         setLoadingRoom(false);
//       }
//     };

//     fetchRoom();
//   }, [id]);

//   // -------- EXISTING STATE (calendar, guests, etc.) ----------
//   const [showGuestDropdown, setShowGuestDropdown] = useState(false);
//   const [guests, setGuests] = useState({
//     adults: 1,
//     children: 0,
//     infants: 0,
//     pets: 0,
//   });
//   const dropdownRef = useRef(null);
//   const [calendarOpen, setCalendarOpen] = useState(false);
//   const [checkInDate, setCheckInDate] = useState(null);
//   const [checkOutDate, setCheckOutDate] = useState(null);
//   const [activeField, setActiveField] = useState("checkIn");
//   const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

//   // dynamic booked dates loaded from backend for this room
//   const [bookedDates, setBookedDates] = useState([]);

//   const navigate = useNavigate();

//   // Close guest dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowGuestDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // fetch bookings for this room and build booked date list
//   useEffect(() => {
//     if (!room?._id) return;

//     const fetchRoomBookings = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/bookings/room/${room._id}`
//         );
//         const bookings = res.data.bookings || [];

//         const datesSet = new Set();

//         bookings.forEach((b) => {
//           const start = dayjs(b.checkIn).startOf("day");
//           const end = dayjs(b.checkOut).startOf("day");
//           let current = start;

//           // block nights from checkIn up to (but not including) checkOut
//           while (current.isBefore(end)) {
//             datesSet.add(current.format("YYYY-MM-DD"));
//             current = current.add(1, "day");
//           }
//         });

//         setBookedDates(Array.from(datesSet));
//       } catch (err) {
//         console.error("Failed to load booked dates for room:", err);
//       }
//     };

//     fetchRoomBookings();
//   }, [room?._id]);

//   const updateGuestCount = (type, increment) => {
//     setGuests((prev) => {
//       const newValue = prev[type] + increment;
//       if (newValue < 0) return prev;
//       return { ...prev, [type]: newValue };
//     });
//   };

//   const guestLabel = () => {
//     const { adults, children, infants, pets } = guests;
//     const totalGuests = adults + children;
//     const parts = [];
//     if (totalGuests > 0)
//       parts.push(`${totalGuests} guest${totalGuests > 1 ? "s" : ""}`);
//     if (infants > 0)
//       parts.push(`${infants} infant${infants > 1 ? "s" : ""}`);
//     if (pets > 0) parts.push(`${pets} pet${pets > 1 ? "s" : ""}`);
//     return parts.length > 0 ? parts.join(", ") : "1 guest";
//   };

//   // derive price per night from room, with fallback
//   const fallbackPricePerNight = 80;
//   const rawPriceFromRoom =
//     room?.basePricePerNight ??
//     room?.pricePerNight ??
//     room?.basePrice ??
//     room?.nightlyRate ??
//     fallbackPricePerNight;
//   const pricePerNight =
//     typeof rawPriceFromRoom === "number"
//       ? rawPriceFromRoom
//       : Number(rawPriceFromRoom) || fallbackPricePerNight;

//   const getNights = () => {
//     if (checkInDate && checkOutDate) {
//       return dayjs(checkOutDate).diff(dayjs(checkInDate), "day");
//     }
//     return 0;
//   };

//   const totalNights = getNights();
//   const totalPrice = totalNights * pricePerNight;

//   const areDatesAvailable = () => {
//     if (!checkInDate || !checkOutDate) return false;
//     const dates = [];
//     let day = dayjs(checkInDate);
//     while (day.isBefore(checkOutDate)) {
//       dates.push(day.format("YYYY-MM-DD"));
//       day = day.add(1, "day");
//     }
//     return dates.every((d) => !bookedDates.includes(d));
//   };

//   // ----- Derived UI data from room -----
//   const mainImage = room?.coverImage || room1;
//   const galleryImages =
//     room?.galleryImages && room.galleryImages.length > 0
//       ? room.galleryImages
//       : [room2, room3, room4, room5];

//   const selectedHighlights =
//     room?.highlights && room.highlights.length > 0
//       ? HIGHLIGHT_CONFIG.filter((h) => room.highlights.includes(h.id))
//       : HIGHLIGHT_CONFIG;

//   const selectedAmenities =
//     room?.amenities && room.amenities.length > 0
//       ? AMENITY_CONFIG.filter((a) => room.amenities.includes(a.id))
//       : AMENITY_CONFIG;

//   // main section: show only first 10 amenities with icons
//   const amenitiesToShow = selectedAmenities.slice(0, 10);

//   // modal: group by category
//   const amenitiesByCategory = selectedAmenities.reduce((acc, amenity) => {
//     const category = amenity.category || "General";
//     if (!acc[category]) acc[category] = [];
//     acc[category].push(amenity);
//     return acc;
//   }, {});

//   // ---------- dynamic header + host text ----------
//   const pluralize = (count, singular) =>
//     `${count} ${singular}${count === 1 ? "" : "s"}`;

//   // Prefer values saved by RoomBasics in the Room document
//   const city = room?.city || room?.locationCity || "Batroun";
//   const country = room?.country || room?.locationCountry || "Lebanon";

//   const propertyType = room?.propertyType || "Entire rental unit";

//   // this comes from "Room type label" in Room basics
//   const roomTypeLabel =
//     room?.roomTypeLabel && room.roomTypeLabel.trim() !== ""
//       ? room.roomTypeLabel
//       : "Studio, Apartment, Private room";

//   const maxGuests =
//     room?.maxGuests ?? room?.guests ?? room?.capacity ?? 3;
//   const bedCount = room?.beds ?? room?.bedCount ?? 1;
//   const bathCount = room?.baths ?? room?.bathCount ?? 1;

//   const locationText = [city, country].filter(Boolean).join(", ");

//   // Headline shown under photos:
//   // 1) use saved headline from Room basics
//   // 2) otherwise fall back to "Entire rental unit in Batroun, Lebanon"
//   const headlineText =
//     room?.headline && room.headline.trim() !== ""
//       ? room.headline
//       : locationText
//       ? `${propertyType} in ${locationText}`
//       : propertyType;

//   // line under headline: "5 guests · Private room · 3 beds · 1 bath"
//   const configLine = [
//     pluralize(maxGuests, "guest"),
//     roomTypeLabel,
//     pluralize(bedCount, "bed"),
//     pluralize(bathCount, "bath"),
//   ].join(" · ");

//   const hostName = room?.hostName || room?.host?.name || "Sithum";
//   const hostYearsHosting = room?.hostYearsHosting || 4;

//   // ------------------------------------------------------------------
//   // RENDER
//   // ------------------------------------------------------------------
//   if (loadingRoom) {
//     return (
//       <div className="bg-[#f3f8fe] min-h-screen">
//         <div className="max-w-[1280px] mx-auto px-6 pt-10 text-sm text-gray-700">
//           Loading room…
//         </div>
//       </div>
//     );
//   }

//   if (roomError || !room) {
//     return (
//       <div className="bg-[#f3f8fe] min-h-screen">
//         <div className="max-w-[1280px] mx-auto px-6 pt-10 text-sm text-red-600">
//           {roomError || "Failed to load room details."}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-[#f3f8fe] min-h-screen shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
//         <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-20 text-[#222222] font-sans">
//           {/* Title (from backend) */}
//           <h2 className="text-xl font-semibold mb-2">
//             {room.title || "Roostr Listing"}
//           </h2>

//           {/* HERO IMAGES */}
//           <div className="grid grid-cols-3 gap-2 mb-6">
//             <div className="col-span-2">
//               <div className="w-full h-[360px] rounded-xl overflow-hidden bg-gray-100">
//                 <img
//                   src={mainImage}
//                   alt="room main"
//                   className="w-full h-full object-cover object-center"
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-2 h-[360px]">
//               {galleryImages.slice(0, 4).map((img, i) => (
//                 <div
//                   key={i}
//                   className="w-full h-full rounded-xl overflow-hidden bg-gray-100"
//                 >
//                   <img
//                     src={img}
//                     alt={`room ${i + 2}`}
//                     className="w-full h-full object-cover object-center"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* MAIN TWO-COLUMN LAYOUT */}
//           <div
//             className="flex flex-col lg:flex-row gap-10 mt-10"
//             style={{ marginTop: "15px" }}
//           >
//             {/* LEFT COLUMN – INFO */}
//             <div className="flex-1 min-w-0">
//               {/* Room Info – now dynamic but same look */}
//               <p className="text-[20px] mb-2 font-medium">{headlineText}</p>
//               <p className="text-sm mb-4 text-gray-700">{configLine}</p>

//               <div className="text-[17px] font-semibold mb-6">
//                 ★ 5.0{" "}
//                 <span className="font-normal text-[16px]">26 reviews</span>
//               </div>

//               <div className="flex items-center space-x-3 mb-6">
//                 <img
//                   src={hostImg}
//                   alt="host"
//                   className="h-10 w-10 rounded-full"
//                 />
//                 <div>
//                   <p className="text-sm font-medium leading-4">
//                     Hosted by {hostName}
//                   </p>
//                   <p className="text-xs text-gray-600">
//                     {hostYearsHosting} years hosting
//                   </p>
//                 </div>
//               </div>

//               {/* PERKS / HIGHLIGHTS (from backend) */}
//               <div className="space-y-4 text-sm mb-8">
//                 {selectedHighlights.map((perk, i) => {
//                   const title =
//                     perk.id === "superhost"
//                       ? `${hostName} is a Superhost`
//                       : perk.title;
//                   return (
//                     <div key={i} className="flex items-start gap-4">
//                       <img
//                         src={perk.img}
//                         alt={title}
//                         className="h-6 w-6 mt-1"
//                       />
//                       <div>
//                         <p className="font-medium text-[15px]">{title}</p>
//                         <p className="text-gray-600 text-[14px]">
//                           {perk.desc}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               <hr className="mb-6" />

//               {/* DESCRIPTION (message about the place, from backend) */}
//               <p className="text-sm text-gray-800 leading-relaxed mb-8 whitespace-pre-line">
//                 {room.description || "A cozy place for your staycation."}
//               </p>

//               {/* AMENITIES (from backend) */}
//               <hr className="mb-6" />
//               <div>
//                 <h3 className="text-[15px] font-medium mb-4">
//                   What this place offers
//                 </h3>
//                 <div className="grid grid-cols-2 gap-y-3 text-sm">
//                   {amenitiesToShow.map((item, i) => (
//                     <div key={i} className="flex items-center gap-3">
//                       <img
//                         src={item.img}
//                         alt={item.label}
//                         className="h-7 w-7 object-contain"
//                       />
//                       <p>{item.label}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Button ALWAYS visible */}
//                 <button
//                   className="mt-4 px-4 py-1.5 bg-[#e4e4e4] rounded-lg text-sm font-medium"
//                   onClick={() => setShowAmenitiesModal(true)}
//                 >
//                   Show all {selectedAmenities.length} amenities
//                 </button>
//               </div>

//               {/* RATINGS SECTION */}
//               <hr className="my-8" />
//               <div>
//                 <div className="text-[17px] font-semibold mb-6">
//                   ★ 5.0{" "}
//                   <span className="font-normal text-[16px] ml-1">
//                     26 reviews
//                   </span>
//                 </div>
//                 <div className="flex items-start gap-8">
//                   {/* Overall Rating */}
//                   <div className="text-sm w-[220px]">
//                     <p className="font-medium text-[16px] mb-4">
//                       Overall rating
//                     </p>
//                     {[5, 4, 3, 2, 1].map((n) => (
//                       <div
//                         key={n}
//                         className="flex items-center text-[13px] text-gray-600 mb-2"
//                       >
//                         <span className="w-4 mr-1 text-right">{n}</span>
//                         <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden ml-2">
//                           <div
//                             className="bg-black h-full rounded-full"
//                             style={{
//                               width:
//                                 n === 5 ? "100%" : n === 4 ? "75%" : "0%",
//                             }}
//                           ></div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Individual Ratings */}
//                   <div className="grid grid-cols-3 gap-6 flex-grow">
//                     {[
//                       {
//                         img: ratingClean,
//                         label: "Cleanliness",
//                         score: "4.9",
//                       },
//                       {
//                         img: ratingAccuracy,
//                         label: "Accuracy",
//                         score: "5.0",
//                       },
//                       {
//                         img: ratingCheckin,
//                         label: "Check-in",
//                         score: "5.0",
//                       },
//                       {
//                         img: ratingComm,
//                         label: "Communication",
//                         score: "5.0",
//                       },
//                       {
//                         img: ratingLocation,
//                         label: "Location",
//                         score: "4.7",
//                       },
//                       {
//                         img: ratingValue,
//                         label: "Value",
//                         score: "5.0",
//                       },
//                     ].map((item, i) => (
//                       <div key={i} className="border-l pl-4 min-w-[150px]">
//                         <p className="text-[16px] font-medium leading-5 mb-1">
//                           {item.label}
//                         </p>
//                         <p className="text-[17px] font-semibold mb-2">
//                           {item.score}
//                         </p>
//                         <img
//                           src={item.img}
//                           alt={item.label}
//                           className="h-10 w-10"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* CUSTOMER REVIEWS SECTION */}
//               <hr className="my-8" />
//               <div className="text-[17px] font-semibold mb-6">
//                 ★ 5.0{" "}
//                 <span className="font-normal text-[16px] ml-1">
//                   26 reviews
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 gap-x-10 gap-y-6">
//                 {reviews.map((review, i) => (
//                   <div key={i} className="mb-4">
//                     <div className="flex items-center gap-3 mb-2">
//                       <img
//                         src={customerImg}
//                         alt={review.name}
//                         className="h-10 w-10 rounded-full"
//                       />
//                       <div>
//                         <p className="text-[14px] font-semibold leading-4">
//                           {review.name}
//                         </p>
//                         <p className="text-[13px] text-gray-600 leading-4">
//                           {review.location}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 text-[13px] text-gray-700 mb-1">
//                       <div className="flex text-black text-[16px]">
//                         {Array.from({ length: review.stars }, (_, idx) => (
//                           <span key={idx}>★</span>
//                         ))}
//                       </div>
//                       <span>{review.date}</span>
//                       <span className="text-gray-500">{review.stay}</span>
//                     </div>
//                     <p className="text-[14px] text-[#222] leading-snug whitespace-pre-line">
//                       {review.comment}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//               <button className="text-[15px] font-semibold mt-6">
//                 Show More
//               </button>

//               {/* MEET YOUR HOST SECTION */}
//               <hr className="my-10" />
//               <div className="mb-16">
//                 <h2 className="text-[17px] font-semibold mb-6">
//                   Meet Your host
//                 </h2>
//                 <div className="flex flex-col lg:flex-row justify-between gap-12">
//                   {/* Left Rectangle Card */}
//                   <div className="bg-white rounded-xl shadow-[0_6px_24px_rgba(0,0,0,0.12)] px-10 pt-8 pb-6 w-[420px] h-[240px]">
//                     <div className="flex gap-8 items-start">
//                       <div className="flex flex-col items-center w-[120px] pt-1">
//                         <img
//                           src={hostImg}
//                           alt="host"
//                           className="h-[90px] w-[90px] rounded-full mb-2 object-cover"
//                         />
//                         <p className="text-[17px] font-semibold leading-tight">
//                           {hostName}
//                         </p>
//                         <p className="text-[13px] text-gray-600">Superhost</p>
//                       </div>
//                       <div className="flex flex-col justify-center text-[14px] pt-1.5">
//                         <div className="mb-3">
//                           <div className="flex items-center justify-between w-[220px]">
//                             <p className="text-[17px] font-bold">79</p>
//                             <p className="text-[13px] text-gray-700">
//                               Reviews
//                             </p>
//                           </div>
//                           <div className="w-[220px] h-[1px] bg-gray-300 mt-1" />
//                         </div>
//                         <div className="mb-3">
//                           <div className="flex items-center justify-between w-[220px]">
//                             <p className="text-[17px] font-bold">4.99</p>
//                             <p className="text-[13px] text-gray-700">
//                               Rating
//                             </p>
//                           </div>
//                           <div className="w-[220px] h-[1px] bg-gray-300 mt-1" />
//                         </div>
//                         <div>
//                           <div className="flex items-center justify-between w-[220px]">
//                             <p className="text-[17px] font-bold">
//                               {hostYearsHosting}
//                             </p>
//                             <p className="text-[13px] text-gray-700">
//                               Years Hosting
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right Side */}
//                   <div className="flex-1 pt-1">
//                     <h3 className="text-[16px] font-semibold mb-1">
//                       {hostName} is a Superhost
//                     </h3>
//                     <p className="text-[14px] text-gray-700 mb-5 leading-snug max-w-[500px]">
//                       Superhosts are experienced, highly rated hosts who are
//                       committed to providing great stays for guests.
//                     </p>
//                     <p className="font-semibold text-[15px] mb-2">Co-hosts</p>
//                     <div className="flex items-center gap-3 mb-6">
//                       <img
//                         src={customerImg}
//                         alt="cohost"
//                         className="h-8 w-8 rounded-full object-cover"
//                       />
//                       <p className="text-[14px] text-gray-800">George</p>
//                     </div>
//                     <p className="font-semibold text-[15px] mb-1">
//                       Host details
//                     </p>
//                     <p className="text-[14px] text-gray-800 leading-tight">
//                       Response rate: 100%
//                     </p>
//                     <p className="text-[14px] text-gray-800 leading-tight mb-4">
//                       Response within an hour
//                     </p>
//                     <button className="bg-[#e6e6e6] px-6 py-2.5 rounded-xl text-[15px] font-medium mb-6">
//                       Message host
//                     </button>
//                     <div className="flex items-start gap-2 text-[13px] text-gray-700 pt-1.5 min-w-[320px]">
//                       <img
//                         src={shieldLogo}
//                         alt="shield"
//                         className="h-[22px] w-[22px] mt-[2px]"
//                       />
//                       <span>
//                         To help protect your payment, always use Airbnb to send
//                         money and communicate with hosts.
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Host about / description (from backend) */}
//                 <div className="mt-10 max-w-[680px] text-[14px] text-gray-800 leading-[1.75] whitespace-pre-line">
//                   <p>
//                     {room.hostAbout ||
//                       `Welcome to our Roostr listing. ${hostName} brings you the comforts of home wherever your travels take you.`}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT COLUMN – AVAILABILITY & BOOKING BOX */}
//             <div className="w-full lg:w-[320px] p-4 shadow-xl rounded-xl border bg-white h-fit sticky top-32 self-start">
//               <h3 className="text-[15px] font-semibold mb-3">
//                 Add dates for prices
//               </h3>

//               {/* Calendar inputs */}
//               <div
//                 className="grid grid-cols-2 border rounded-md overflow-hidden mb-1 cursor-pointer"
//                 onClick={() => {
//                   setActiveField("checkIn");
//                   setCalendarOpen(true);
//                 }}
//               >
//                 <div className="border-r px-3 py-2">
//                   <p className="text-[11px] font-semibold mb-[2px]">CHECK-IN</p>
//                   <p className="text-[14px]">
//                     {checkInDate
//                       ? dayjs(checkInDate).format("MM/DD/YYYY")
//                       : "Add date"}
//                   </p>
//                 </div>
//                 <div
//                   className="px-3 py-2"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setActiveField("checkOut");
//                     setCalendarOpen(true);
//                   }}
//                 >
//                   <p className="text-[11px] font-semibold mb-[2px]">
//                     CHECK-OUT
//                   </p>
//                   <p className="text-[14px]">
//                     {checkOutDate
//                       ? dayjs(checkOutDate).format("MM/DD/YYYY")
//                       : "Add date"}
//                   </p>
//                 </div>
//               </div>

//               {calendarOpen && (
//                 <Calendar
//                   checkIn={checkInDate}
//                   checkOut={checkOutDate}
//                   onSelectDate={(checkIn, checkOut) => {
//                     if (!checkIn && !checkOut) {
//                       setCheckInDate(null);
//                       setCheckOutDate(null);
//                       return;
//                     }
//                     if (activeField === "checkIn") {
//                       setCheckInDate(checkIn);
//                       setCheckOutDate(null);
//                     } else if (
//                       activeField === "checkOut" &&
//                       checkInDate &&
//                       checkOut &&
//                       dayjs(checkOut).isAfter(checkInDate)
//                     ) {
//                       setCheckOutDate(checkOut);
//                     }
//                     if (checkIn && checkOut) {
//                       setCheckInDate(checkIn);
//                       setCheckOutDate(checkOut);
//                     }
//                   }}
//                   onClose={() => setCalendarOpen(false)}
//                   bookedDates={bookedDates}
//                 />
//               )}

//               {/* Guest dropdown */}
//               <div
//                 ref={dropdownRef}
//                 className="relative border rounded-md px-3 py-2 mb-4 cursor-pointer"
//                 onClick={() => setShowGuestDropdown(!showGuestDropdown)}
//               >
//                 <p className="text-[11px] font-semibold mb-[2px]">GUESTS</p>
//                 <p className="text-[14px]">{guestLabel()}</p>
//                 <img
//                   src={dropdownIcon}
//                   alt="dropdown"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3"
//                 />

//                 {showGuestDropdown && (
//                   <div className="absolute left-0 top-[100%] mt-2 w-full bg-white rounded-xl shadow-xl p-4 z-10">
//                     {[
//                       {
//                         key: "adults",
//                         label: "Adults",
//                         desc: "Age 13+",
//                       },
//                       {
//                         key: "children",
//                         label: "Children",
//                         desc: "Age 2 - 12",
//                       },
//                       {
//                         key: "infants",
//                         label: "Infants",
//                         desc: "Under 2",
//                       },
//                       {
//                         key: "pets",
//                         label: "Pets",
//                         desc: "",
//                       },
//                     ].map(({ key, label, desc }) => (
//                       <div
//                         key={key}
//                         className="flex justify-between items-center mb-3"
//                       >
//                         <div>
//                           <p className="font-semibold text-[15px] leading-4">
//                             {label}
//                           </p>
//                           {desc && (
//                             <p className="text-[13px] text-gray-500">{desc}</p>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               updateGuestCount(key, -1);
//                             }}
//                           >
//                             <img
//                               src={minusIcon}
//                               alt="-"
//                               className="w-6 h-6"
//                             />
//                           </button>
//                           <span className="w-4 text-center text-[15px]">
//                             {guests[key]}
//                           </span>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               updateGuestCount(key, 1);
//                             }}
//                           >
//                             <img src={plusIcon} alt="+" className="w-6 h-6" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                     <button
//                       className="mt-2 text-right w-full text-[14px] font-semibold"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setShowGuestDropdown(false);
//                       }}
//                     >
//                       Close
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Price Summary */}
//               {checkInDate && checkOutDate && areDatesAvailable() && (
//                 <div className="text-[20px] font-semibold mb-2">
//                   ${totalPrice}{" "}
//                   <span className="text-sm font-normal text-gray-600">
//                     for {totalNights} night
//                     {totalNights > 1 ? "s" : ""}
//                   </span>
//                 </div>
//               )}

//               {/* Reserve / Check availability button */}
//               <button
//                 onClick={() => {
//                   if (checkInDate && checkOutDate && areDatesAvailable()) {
//                     const nights = dayjs(checkOutDate).diff(
//                       dayjs(checkInDate),
//                       "day"
//                     );
//                     const total = nights * pricePerNight;

//                     const parts = [];
//                     if (guests.adults)
//                       parts.push(
//                         `${guests.adults} guest${
//                           guests.adults > 1 ? "s" : ""
//                         }`
//                       );
//                     if (guests.children)
//                       parts.push(
//                         `${guests.children} child${
//                           guests.children > 1 ? "ren" : ""
//                         }`
//                       );
//                     if (guests.infants)
//                       parts.push(
//                         `${guests.infants} infant${
//                           guests.infants > 1 ? "s" : ""
//                         }`
//                       );
//                     if (guests.pets)
//                       parts.push(
//                         `${guests.pets} pet${guests.pets > 1 ? "s" : ""}`
//                       );
//                     const guestSummary = parts.join(", ");

//                     navigate("/payment", {
//                       state: {
//                         roomId: room?._id,
//                         roomTitle: room?.title || "Roostr Listing",
//                         roomImage: mainImage,
//                         checkInDate: checkInDate
//                           ? checkInDate.toISOString()
//                           : null,
//                         checkOutDate: checkOutDate
//                           ? checkOutDate.toISOString()
//                           : null,
//                         totalNights: nights,
//                         totalPrice: total,
//                         pricePerNight,
//                         guestSummary,
//                         guests,
//                       },
//                     });
//                   }
//                 }}
//                 disabled={!checkInDate || !checkOutDate || !areDatesAvailable()}
//                 className="mt-4 w-full py-2 text-white text-[15px] font-semibold rounded-md transition bg-[#FF5A5F] hover:bg-[#e04141] disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {checkInDate && checkOutDate && areDatesAvailable()
//                   ? "Reserve"
//                   : "Check availability"}
//               </button>

//               <p className="text-[13px] text-gray-500 text-center mt-2">
//                 You won’t be charged yet.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* AMENITIES MODAL */}
//       <AmenitiesModal
//         isOpen={showAmenitiesModal}
//         onClose={() => setShowAmenitiesModal(false)}
//         amenitiesByCategory={amenitiesByCategory}
//       />
//     </>
//   );
// };

// export default RoomDetails;


// src/pages/RoomDetails.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import Calendar from "../components/Calendar";
import AmenitiesModal from "../components/AmenitiesModal";

// Fallback room hero images (used if backend images missing)
import room1 from "../assets/roomimages/room1.png";
import room2 from "../assets/roomimages/room2.png";
import room3 from "../assets/roomimages/room3.png";
import room4 from "../assets/roomimages/room4.png";
import room5 from "../assets/roomimages/room5.png";

// Perk icons (highlights)
import perkCheckin from "../assets/roomimages/perk-checkin.png";
import perkPark from "../assets/roomimages/perk-park.png";
import perkSuperhost from "../assets/roomimages/perk-superhost.png";
import perkOutdoor from "../assets/roomimages/perk-outdoor.png";

// ---------------- AMENITY ICONS (same set as AddNewRoom) ----------------

// Bathroom
import hairDryer from "../assets/roomicons/hair-dryer.png";
import shampoo from "../assets/roomicons/shampoo.png";
import conditioner from "../assets/roomicons/conditioner.png";
import bodySoap from "../assets/roomicons/body-soap.png";
import hotWater from "../assets/roomicons/hot-water.png";
import washerDryer from "../assets/roomicons/washing-dryer.png";
import jacuzzi from "../assets/roomicons/jacuzzi.png";
import bath from "../assets/roomicons/bath.png";

// Bedroom & laundry
import essentials from "../assets/roomicons/essentials.png";
import extraPillows from "../assets/roomicons/extra-pillows.png";
import iron from "../assets/roomicons/iron.png";
import miniFridge from "../assets/roomicons/mini-fridge.png";
import clothesStorage from "../assets/roomicons/clothes-storage.png";
import hangers from "../assets/roomicons/hangers.png";

// Entertainment
import wifi from "../assets/roomicons/wifi.png";
import tv from "../assets/roomicons/tv.png";
import ethernet from "../assets/roomicons/ethernet.png";
import gamesConsole from "../assets/roomicons/games-console.png";
import books from "../assets/roomicons/books.png";
import outdoorPlayground from "../assets/roomicons/outdoor-playground.png";

// Home safety
import smokeAlarm from "../assets/roomicons/smoke-alarm.png";
import carbonAlarm from "../assets/roomicons/carbon-alarm.png";
import securityCamera from "../assets/roomicons/security-camera.png";
import fireExtinguisher from "../assets/roomicons/fire-extinguisher.png";
import firstAidKit from "../assets/roomicons/first-aid-kit.png";
import security247 from "../assets/roomicons/247-security.png";

// Heating & cooling
import ac from "../assets/roomicons/ac.png";
import heater from "../assets/roomicons/heater.png";

// Kitchen & dining
import kitchen from "../assets/roomicons/kitchen.png";
import fridge from "../assets/roomicons/fridge.png";
import microwave from "../assets/roomicons/microwave.png";
import cookingBasics from "../assets/roomicons/cooking-basics.png";
import dishesCutlery from "../assets/roomicons/dishes-cutlery.png";
import cooker from "../assets/roomicons/cooker.png";
import kettle from "../assets/roomicons/kettle.png";
import coffeeMaker from "../assets/roomicons/coffee-maker.png";
import freezer from "../assets/roomicons/freezer.png";
import oven from "../assets/roomicons/oven.png";
import dishwasher from "../assets/roomicons/dishwasher.png";
import toaster from "../assets/roomicons/toaster.png";
import wineGlasses from "../assets/roomicons/wine-glass.png";
import liquor from "../assets/roomicons/liquor.png";
import diningTable from "../assets/roomicons/dinning-table.png";
import wipes from "../assets/roomicons/wipes-tissues.png";

// Facilities
import freeParking from "../assets/roomicons/park-for-free.png";
import paidParking from "../assets/roomicons/parking-meter.png";
import sauna from "../assets/roomicons/sauna.png";
import bbq from "../assets/roomicons/bbq.png";
import lift from "../assets/roomicons/Lift.png";
import gym from "../assets/roomicons/gym.png";
import workspace from "../assets/roomicons/workspace-dedicated.png";

// Outdoor
import resortAccess from "../assets/roomicons/resort-access.png";
import outdoorDining from "../assets/roomicons/outdoor-dinniig-area.png";
import pool from "../assets/roomicons/pool.png";

// Services
import cleaning from "../assets/roomicons/cleaning-available-durig-stay.png";
import lockbox from "../assets/roomicons/lock-box.png";
import longTermStay from "../assets/roomicons/long-term-stay-allowed.png";
import selfCheckService from "../assets/roomicons/self-check-inn.png";

// Rating icons
import ratingClean from "../assets/roomimages/rating-clean.png";
import ratingAccuracy from "../assets/roomimages/rating-accuracy.png";
import ratingCheckin from "../assets/roomimages/rating-checkin.png";
import ratingComm from "../assets/roomimages/rating-comm.png";
import ratingLocation from "../assets/roomimages/rating-location.png";
import ratingValue from "../assets/roomimages/rating-value.png";

// Host / customer / misc
import hostImg from "../assets/roomimages/host.png";
import customerImg from "../assets/roomimages/customer.png";
import shieldLogo from "../assets/roomimages/shield-logo.png";
import dropdownIcon from "../assets/roomimages/dropdownIcon.png";
import plusIcon from "../assets/roomimages/plus.png";
import minusIcon from "../assets/roomimages/minus.png";

// ---------------- MAPPINGS FROM ROOM DATA → UI ----------------

// These IDs MUST match what AddNewRoom sends in `highlights`
const HIGHLIGHT_CONFIG = [
  {
    id: "selfCheck",
    img: perkCheckin,
    title: "Self Check-in",
    desc: "Check yourself in with the lockbox.",
  },
  {
    id: "parkFree",
    img: perkPark,
    title: "Park for free",
    desc: "This is one of the few places in the area with free parking.",
  },
  {
    id: "superhost",
    img: perkSuperhost,
    title: "Superhost",
    desc: "Superhosts are experienced, highly rated Hosts.",
  },
  {
    id: "outdoorEntertainment",
    img: perkOutdoor,
    title: "Outdoor entertainment",
    desc: "The pool and outdoor seating are great for summer trips.",
  },
];

// ⚙️ FULL AMENITY MAP – ids MUST match AddNewRoom amenityCategories
const AMENITY_CONFIG = [
  // Bathroom
  { id: "hairDryer", img: hairDryer, label: "Hair dryer", category: "Bathroom" },
  { id: "shampoo", img: shampoo, label: "Shampoo", category: "Bathroom" },
  { id: "conditioner", img: conditioner, label: "Conditioner", category: "Bathroom" },
  { id: "bodySoap", img: bodySoap, label: "Body soap", category: "Bathroom" },
  { id: "hotWater", img: hotWater, label: "Hot water", category: "Bathroom" },
  {
    id: "washerDryer",
    img: washerDryer,
    label: "Washing machine with dryer",
    category: "Bathroom",
  },
  { id: "jacuzzi", img: jacuzzi, label: "Jacuzzi", category: "Bathroom" },
  { id: "bath", img: bath, label: "Bath", category: "Bathroom" },

  // Bedroom and laundry
  {
    id: "essentials",
    img: essentials,
    label: "Essentials (Towels, bed sheets etc.)",
    category: "Bedroom and laundry",
  },
  {
    id: "extraPillows",
    img: extraPillows,
    label: "Extra pillows and blankets",
    category: "Bedroom and laundry",
  },
  { id: "iron", img: iron, label: "Iron", category: "Bedroom and laundry" },
  {
    id: "miniFridge",
    img: miniFridge,
    label: "Mini fridge with mini bar",
    category: "Bedroom and laundry",
  },
  {
    id: "clothesStorage",
    img: clothesStorage,
    label: "Clothes storage",
    category: "Bedroom and laundry",
  },
  { id: "hangers", img: hangers, label: "Hangers", category: "Bedroom and laundry" },

  // Entertainment
  { id: "wifi", img: wifi, label: "Wifi", category: "Entertainment" },
  { id: "tv", img: tv, label: "TV", category: "Entertainment" },
  { id: "ethernet", img: ethernet, label: "Ethernet", category: "Entertainment" },
  {
    id: "gamesConsole",
    img: gamesConsole,
    label: "Games console",
    category: "Entertainment",
  },
  {
    id: "books",
    img: books,
    label: "Books and reading material",
    category: "Entertainment",
  },
  {
    id: "outdoorPlayground",
    img: outdoorPlayground,
    label: "Outdoor playground",
    category: "Entertainment",
  },

  // Home Safety
  {
    id: "smokeAlarm",
    img: smokeAlarm,
    label: "Smoke alarm",
    category: "Home safety",
  },
  {
    id: "carbonAlarm",
    img: carbonAlarm,
    label: "Carbon monoxide alarm",
    category: "Home safety",
  },
  {
    id: "securityCamera",
    img: securityCamera,
    label: "Exterior security cameras on property",
    category: "Home safety",
  },
  {
    id: "fireExtinguisher",
    img: fireExtinguisher,
    label: "Fire extinguisher",
    category: "Home safety",
  },
  {
    id: "firstAidKit",
    img: firstAidKit,
    label: "First aid kit",
    category: "Home safety",
  },
  {
    id: "security247",
    img: security247,
    label: "24/7 Security",
    category: "Home safety",
  },

  // Heating & cooling
  {
    id: "ac",
    img: ac,
    label: "Air conditioning",
    category: "Heating and cooling",
  },
  { id: "heater", img: heater, label: "Heater", category: "Heating and cooling" },

  // Kitchen & dining
  { id: "kitchen", img: kitchen, label: "Kitchen", category: "Kitchen & dining" },
  { id: "fridge", img: fridge, label: "Fridge", category: "Kitchen & dining" },
  {
    id: "microwave",
    img: microwave,
    label: "Microwave",
    category: "Kitchen & dining",
  },
  {
    id: "cookingBasics",
    img: cookingBasics,
    label: "Cooking basics (Pots, pans etc.)",
    category: "Kitchen & dining",
  },
  {
    id: "dishesCutlery",
    img: dishesCutlery,
    label: "Dishes and cutlery",
    category: "Kitchen & dining",
  },
  { id: "cooker", img: cooker, label: "Cooker", category: "Kitchen & dining" },
  { id: "kettle", img: kettle, label: "Kettle", category: "Kitchen & dining" },
  {
    id: "coffeeMaker",
    img: coffeeMaker,
    label: "Coffee maker: Nespresso",
    category: "Kitchen & dining",
  },
  { id: "freezer", img: freezer, label: "Freezer", category: "Kitchen & dining" },
  { id: "oven", img: oven, label: "Oven", category: "Kitchen & dining" },
  {
    id: "dishwasher",
    img: dishwasher,
    label: "Dishwasher",
    category: "Kitchen & dining",
  },
  { id: "toaster", img: toaster, label: "Toaster", category: "Kitchen & dining" },
  {
    id: "wineGlasses",
    img: wineGlasses,
    label: "Wine glasses",
    category: "Kitchen & dining",
  },
  { id: "liquor", img: liquor, label: "Liquor", category: "Kitchen & dining" },
  {
    id: "diningTable",
    img: diningTable,
    label: "Dining table",
    category: "Kitchen & dining",
  },
  {
    id: "wipes",
    img: wipes,
    label: "Wipes / tissues",
    category: "Kitchen & dining",
  },

  // Facilities
  {
    id: "freeParking",
    img: freeParking,
    label: "Free parking on premises",
    category: "Facilities",
  },
  {
    id: "paidParking",
    img: paidParking,
    label: "Paid parking off premises",
    category: "Facilities",
  },
  { id: "sauna", img: sauna, label: "Sauna", category: "Facilities" },
  { id: "bbq", img: bbq, label: "BBQ machine", category: "Facilities" },
  { id: "lift", img: lift, label: "Lift", category: "Facilities" },
  { id: "gym", img: gym, label: "Gym", category: "Facilities" },
  {
    id: "workspace",
    img: workspace,
    label: "Dedicated workspace",
    category: "Facilities",
  },

  // Outdoor
  {
    id: "resortAccess",
    img: resortAccess,
    label: "Resort access",
    category: "Outdoor",
  },
  {
    id: "outdoorDining",
    img: outdoorDining,
    label: "Outdoor dining area",
    category: "Outdoor",
  },
  { id: "pool", img: pool, label: "Pool", category: "Outdoor" },

  // Services
  {
    id: "selfCheckService",
    img: selfCheckService,
    label: "Self check-in",
    category: "Services",
  },
  {
    id: "cleaning",
    img: cleaning,
    label: "Cleaning available during stay",
    category: "Services",
  },
  { id: "lockbox", img: lockbox, label: "Lockbox", category: "Services" },
  {
    id: "longTermStay",
    img: longTermStay,
    label: "Long-term stays allowed",
    category: "Services",
  },
];

const reviews = [
  {
    name: "Youssef",
    location: "Cairo, Egypt",
    date: "1 week ago",
    stay: "Stayed a few nights",
    stars: 5,
    comment: "Great location , super clean , and great host",
  },
  {
    name: "Adam",
    location: "Mina, Lebanon",
    date: "May 2025",
    stay: "Stayed in one night",
    stars: 4,
    comment:
      "We had a great stay! The place was exactly as described. Comfortable, well maintained, and in a great location. One of the things I appreciated most was the cleanliness; everything was spotless and well taken care of. Highly recommend this place and would definitely stay again.",
  },
  {
    name: "Adam",
    location: "Mina, Lebanon",
    date: "May 2025",
    stay: "Stayed in one night",
    stars: 5,
    comment:
      "The place is amazing really feels like home. The host is a great, very friendly person. I really suggest the stay there .",
  },
  {
    name: "Adam",
    location: "Mina, Lebanon",
    date: "May 2025",
    stay: "Stayed in one night",
    stars: 4,
    comment: "The place was better than the picture. Also , Mona is so responsive",
  },
];

const RoomDetails = () => {
  // -------- URL PARAM & ROOM FETCHING ----------
  const { id } = useParams(); // /room/:id
  const [room, setRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [roomError, setRoomError] = useState("");

  useEffect(() => {
    if (!id) {
      setRoomError("Room id is missing from URL.");
      setLoadingRoom(false);
      return;
    }

    const fetchRoom = async () => {
      try {
        setLoadingRoom(true);
        setRoomError("");
        const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        setRoom(res.data.room);
      } catch (err) {
        console.error("Failed to load room:", err);
        setRoomError("Failed to load room details.");
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchRoom();
  }, [id]);

  // -------- EXISTING STATE (calendar, guests, etc.) ----------
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const dropdownRef = useRef(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [activeField, setActiveField] = useState("checkIn");
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  // dynamic booked dates loaded from backend for this room
  const [bookedDates, setBookedDates] = useState([]);

  const navigate = useNavigate();

  // Close guest dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuestDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fetch bookings for this room and build booked date list
  useEffect(() => {
    if (!room?._id) return;

    const fetchRoomBookings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/room/${room._id}`
        );
        const bookings = res.data.bookings || [];

        const datesSet = new Set();

        bookings.forEach((b) => {
          const start = dayjs(b.checkIn).startOf("day");
          const end = dayjs(b.checkOut).startOf("day");
          let current = start;

          // block nights from checkIn up to (but not including) checkOut
          while (current.isBefore(end)) {
            datesSet.add(current.format("YYYY-MM-DD"));
            current = current.add(1, "day");
          }
        });

        setBookedDates(Array.from(datesSet));
      } catch (err) {
        console.error("Failed to load booked dates for room:", err);
      }
    };

    fetchRoomBookings();
  }, [room?._id]);

  const updateGuestCount = (type, increment) => {
    setGuests((prev) => {
      const newValue = prev[type] + increment;
      if (newValue < 0) return prev;
      return { ...prev, [type]: newValue };
    });
  };

  const guestLabel = () => {
    const { adults, children, infants, pets } = guests;
    const totalGuests = adults + children;
    const parts = [];
    if (totalGuests > 0)
      parts.push(`${totalGuests} guest${totalGuests > 1 ? "s" : ""}`);
    if (infants > 0)
      parts.push(`${infants} infant${infants > 1 ? "s" : ""}`);
    if (pets > 0) parts.push(`${pets} pet${pets > 1 ? "s" : ""}`);
    return parts.length > 0 ? parts.join(", ") : "1 guest";
  };

  // derive price per night from room, with fallback
  const fallbackPricePerNight = 80;
  const rawPriceFromRoom =
    room?.basePricePerNight ??
    room?.pricePerNight ??
    room?.basePrice ??
    room?.nightlyRate ??
    fallbackPricePerNight;
  const pricePerNight =
    typeof rawPriceFromRoom === "number"
      ? rawPriceFromRoom
      : Number(rawPriceFromRoom) || fallbackPricePerNight;

  const getNights = () => {
    if (checkInDate && checkOutDate) {
      return dayjs(checkOutDate).diff(dayjs(checkInDate), "day");
    }
    return 0;
  };

  const totalNights = getNights();
  const totalPrice = totalNights * pricePerNight;

  const areDatesAvailable = () => {
    if (!checkInDate || !checkOutDate) return false;
    const dates = [];
    let day = dayjs(checkInDate);
    while (day.isBefore(checkOutDate)) {
      dates.push(day.format("YYYY-MM-DD"));
      day = day.add(1, "day");
    }
    return dates.every((d) => !bookedDates.includes(d));
  };

  // ----- Derived UI data from room -----
  const mainImage = room?.coverImage || room1;
  const galleryImages =
    room?.galleryImages && room.galleryImages.length > 0
      ? room.galleryImages
      : [room2, room3, room4, room5];

  const selectedHighlights =
    room?.highlights && room.highlights.length > 0
      ? HIGHLIGHT_CONFIG.filter((h) => room.highlights.includes(h.id))
      : HIGHLIGHT_CONFIG;

  const selectedAmenities =
    room?.amenities && room.amenities.length > 0
      ? AMENITY_CONFIG.filter((a) => room.amenities.includes(a.id))
      : AMENITY_CONFIG;

  // main section: show only first 10 amenities with icons
  const amenitiesToShow = selectedAmenities.slice(0, 10);

  // modal: group by category
  const amenitiesByCategory = selectedAmenities.reduce((acc, amenity) => {
    const category = amenity.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(amenity);
    return acc;
  }, {});

  // ---------- dynamic header + host text ----------
  const pluralize = (count, singular) =>
    `${count} ${singular}${count === 1 ? "" : "s"}`;

  // Prefer values saved by RoomBasics in the Room document
  const city = room?.city || room?.locationCity || "Batroun";
  const country = room?.country || room?.locationCountry || "Lebanon";

  const propertyType = room?.propertyType || "Entire rental unit";

  // this comes from "Room type label" in Room basics
  const roomTypeLabel =
    room?.roomTypeLabel && room.roomTypeLabel.trim() !== ""
      ? room.roomTypeLabel
      : "Studio, Apartment, Private room";

  const maxGuests =
    room?.maxGuests ?? room?.guests ?? room?.capacity ?? 3;
  const bedCount = room?.beds ?? room?.bedCount ?? 1;
  const bathCount = room?.baths ?? room?.bathCount ?? 1;

  const locationText = [city, country].filter(Boolean).join(", ");

  // Headline shown under photos:
  const headlineText =
    room?.headline && room.headline.trim() !== ""
      ? room.headline
      : locationText
      ? `${propertyType} in ${locationText}`
      : propertyType;

  // line under headline
  const configLine = [
    pluralize(maxGuests, "guest"),
    roomTypeLabel,
    pluralize(bedCount, "bed"),
    pluralize(bathCount, "bath"),
  ].join(" · ");

  const hostName = room?.hostName || room?.host?.name || "Sithum";
  const hostYearsHosting = room?.hostYearsHosting || 4;

  // ------------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------------
  if (loadingRoom) {
    return (
      <div className="bg-[#f3f8fe] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 pt-10 text-sm text-gray-700">
          Loading room…
        </div>
      </div>
    );
  }

  if (roomError || !room) {
    return (
      <div className="bg-[#f3f8fe] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 pt-10 text-sm text-red-600">
          {roomError || "Failed to load room details."}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#f3f8fe] min-h-screen shadow-[0_8px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-20 text-[#222222] font-sans">
          {/* Title (from backend) */}
          <h2 className="text-xl font-semibold mb-2">
            {room.title || "Roostr Listing"}
          </h2>

          {/* HERO IMAGES */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="col-span-2">
              <div className="w-full h-[360px] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={mainImage}
                  alt="room main"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 h-[360px]">
              {galleryImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="w-full h-full rounded-xl overflow-hidden bg-gray-100"
                >
                  <img
                    src={img}
                    alt={`room ${i + 2}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* MAIN TWO-COLUMN LAYOUT */}
          <div
            className="flex flex-col lg:flex-row gap-10 mt-10"
            style={{ marginTop: "15px" }}
          >
            {/* LEFT COLUMN – INFO */}
            <div className="flex-1 min-w-0">
              {/* Room Info */}
              <p className="text-[20px] mb-2 font-medium">{headlineText}</p>
              <p className="text-sm mb-4 text-gray-700">{configLine}</p>

              <div className="text-[17px] font-semibold mb-6">
                ★ 5.0{" "}
                <span className="font-normal text-[16px]">26 reviews</span>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={hostImg}
                  alt="host"
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium leading-4">
                    Hosted by {hostName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {hostYearsHosting} years hosting
                  </p>
                </div>
              </div>

              {/* PERKS / HIGHLIGHTS */}
              <div className="space-y-4 text-sm mb-8">
                {selectedHighlights.map((perk, i) => {
                  const title =
                    perk.id === "superhost"
                      ? `${hostName} is a Superhost`
                      : perk.title;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <img
                        src={perk.img}
                        alt={title}
                        className="h-6 w-6 mt-1"
                      />
                      <div>
                        <p className="font-medium text-[15px]">{title}</p>
                        <p className="text-gray-600 text-[14px]">
                          {perk.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr className="mb-6" />

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-800 leading-relaxed mb-8 whitespace-pre-line">
                {room.description || "A cozy place for your staycation."}
              </p>

              {/* AMENITIES */}
              <hr className="mb-6" />
              <div>
                <h3 className="text-[15px] font-medium mb-4">
                  What this place offers
                </h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  {amenitiesToShow.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.label}
                          className="h-7 w-7 object-contain"
                        />
                      )}
                      <p>{item.label}</p>
                    </div>
                  ))}
                </div>

                <button
                  className="mt-4 px-4 py-1.5 bg-[#e4e4e4] rounded-lg text-sm font-medium"
                  onClick={() => setShowAmenitiesModal(true)}
                >
                  Show all {selectedAmenities.length} amenities
                </button>
              </div>

              {/* RATINGS SECTION */}
              <hr className="my-8" />
              <div>
                <div className="text-[17px] font-semibold mb-6">
                  ★ 5.0{" "}
                  <span className="font-normal text-[16px] ml-1">
                    26 reviews
                  </span>
                </div>
                <div className="flex items-start gap-8">
                  {/* Overall Rating */}
                  <div className="text-sm w-[220px]">
                    <p className="font-medium text-[16px] mb-4">
                      Overall rating
                    </p>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <div
                        key={n}
                        className="flex items-center text-[13px] text-gray-600 mb-2"
                      >
                        <span className="w-4 mr-1 text-right">{n}</span>
                        <div className="w-full h-[6px] bg-gray-200 rounded-full overflow-hidden ml-2">
                          <div
                            className="bg-black h-full rounded-full"
                            style={{
                              width:
                                n === 5 ? "100%" : n === 4 ? "75%" : "0%",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Individual Ratings */}
                  <div className="grid grid-cols-3 gap-6 flex-grow">
                    {[
                      {
                        img: ratingClean,
                        label: "Cleanliness",
                        score: "4.9",
                      },
                      {
                        img: ratingAccuracy,
                        label: "Accuracy",
                        score: "5.0",
                      },
                      {
                        img: ratingCheckin,
                        label: "Check-in",
                        score: "5.0",
                      },
                      {
                        img: ratingComm,
                        label: "Communication",
                        score: "5.0",
                      },
                      {
                        img: ratingLocation,
                        label: "Location",
                        score: "4.7",
                      },
                      {
                        img: ratingValue,
                        label: "Value",
                        score: "5.0",
                      },
                    ].map((item, i) => (
                      <div key={i} className="border-l pl-4 min-w-[150px]">
                        <p className="text-[16px] font-medium leading-5 mb-1">
                          {item.label}
                        </p>
                        <p className="text-[17px] font-semibold mb-2">
                          {item.score}
                        </p>
                        <img
                          src={item.img}
                          alt={item.label}
                          className="h-10 w-10"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CUSTOMER REVIEWS SECTION */}
              <hr className="my-8" />
              <div className="text-[17px] font-semibold mb-6">
                ★ 5.0{" "}
                <span className="font-normal text-[16px] ml-1">
                  26 reviews
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                {reviews.map((review, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={customerImg}
                        alt={review.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="text-[14px] font-semibold leading-4">
                          {review.name}
                        </p>
                        <p className="text-[13px] text-gray-600 leading-4">
                          {review.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-gray-700 mb-1">
                      <div className="flex text-black text-[16px]">
                        {Array.from({ length: review.stars }, (_, idx) => (
                          <span key={idx}>★</span>
                        ))}
                      </div>
                      <span>{review.date}</span>
                      <span className="text-gray-500">{review.stay}</span>
                    </div>
                    <p className="text-[14px] text-[#222] leading-snug whitespace-pre-line">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
              <button className="text-[15px] font-semibold mt-6">
                Show More
              </button>

              {/* MEET YOUR HOST SECTION */}
              <hr className="my-10" />
              <div className="mb-16">
                <h2 className="text-[17px] font-semibold mb-6">
                  Meet Your host
                </h2>
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                  {/* Left Rectangle Card */}
                  <div className="bg-white rounded-xl shadow-[0_6px_24px_rgba(0,0,0,0.12)] px-10 pt-8 pb-6 w-[420px] h-[240px]">
                    <div className="flex gap-8 items-start">
                      <div className="flex flex-col items-center w-[120px] pt-1">
                        <img
                          src={hostImg}
                          alt="host"
                          className="h-[90px] w-[90px] rounded-full mb-2 object-cover"
                        />
                        <p className="text-[17px] font-semibold leading-tight">
                          {hostName}
                        </p>
                        <p className="text-[13px] text-gray-600">Superhost</p>
                      </div>
                      <div className="flex flex-col justify-center text-[14px] pt-1.5">
                        <div className="mb-3">
                          <div className="flex items-center justify-between w-[220px]">
                            <p className="text-[17px] font-bold">79</p>
                            <p className="text-[13px] text-gray-700">
                              Reviews
                            </p>
                          </div>
                          <div className="w-[220px] h-[1px] bg-gray-300 mt-1" />
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between w-[220px]">
                            <p className="text-[17px] font-bold">4.99</p>
                            <p className="text-[13px] text-gray-700">
                              Rating
                            </p>
                          </div>
                          <div className="w-[220px] h-[1px] bg-gray-300 mt-1" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between w-[220px]">
                            <p className="text-[17px] font-bold">
                              {hostYearsHosting}
                            </p>
                            <p className="text-[13px] text-gray-700">
                              Years Hosting
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-[16px] font-semibold mb-1">
                      {hostName} is a Superhost
                    </h3>
                    <p className="text-[14px] text-gray-700 mb-5 leading-snug max-w-[500px]">
                      Superhosts are experienced, highly rated hosts who are
                      committed to providing great stays for guests.
                    </p>
                    <p className="font-semibold text-[15px] mb-2">Co-hosts</p>
                    <div className="flex items-center gap-3 mb-6">
                      <img
                        src={customerImg}
                        alt="cohost"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <p className="text-[14px] text-gray-800">George</p>
                    </div>
                    <p className="font-semibold text-[15px] mb-1">
                      Host details
                    </p>
                    <p className="text-[14px] text-gray-800 leading-tight">
                      Response rate: 100%
                    </p>
                    <p className="text-[14px] text-gray-800 leading-tight mb-4">
                      Response within an hour
                    </p>
                    <button className="bg-[#e6e6e6] px-6 py-2.5 rounded-xl text-[15px] font-medium mb-6">
                      Message host
                    </button>
                    <div className="flex items-start gap-2 text-[13px] text-gray-700 pt-1.5 min-w-[320px]">
                      <img
                        src={shieldLogo}
                        alt="shield"
                        className="h-[22px] w-[22px] mt-[2px]"
                      />
                      <span>
                        To help protect your payment, always use Airbnb to send
                        money and communicate with hosts.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Host about / description (from backend) */}
                <div className="mt-10 max-w-[680px] text-[14px] text-gray-800 leading-[1.75] whitespace-pre-line">
                  <p>
                    {room.hostAbout ||
                      `Welcome to our Roostr listing. ${hostName} brings you the comforts of home wherever your travels take you.`}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN – AVAILABILITY & BOOKING BOX */}
            <div className="w-full lg:w-[320px] p-4 shadow-xl rounded-xl border bg-white h-fit sticky top-32 self-start">
              <h3 className="text-[15px] font-semibold mb-3">
                Add dates for prices
              </h3>

              {/* Calendar inputs */}
              <div
                className="grid grid-cols-2 border rounded-md overflow-hidden mb-1 cursor-pointer"
                onClick={() => {
                  setActiveField("checkIn");
                  setCalendarOpen(true);
                }}
              >
                <div className="border-r px-3 py-2">
                  <p className="text-[11px] font-semibold mb-[2px]">CHECK-IN</p>
                  <p className="text-[14px]">
                    {checkInDate
                      ? dayjs(checkInDate).format("MM/DD/YYYY")
                      : "Add date"}
                  </p>
                </div>
                <div
                  className="px-3 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveField("checkOut");
                    setCalendarOpen(true);
                  }}
                >
                  <p className="text-[11px] font-semibold mb-[2px]">
                    CHECK-OUT
                  </p>
                  <p className="text-[14px]">
                    {checkOutDate
                      ? dayjs(checkOutDate).format("MM/DD/YYYY")
                      : "Add date"}
                  </p>
                </div>
              </div>

              {calendarOpen && (
                <Calendar
                  checkIn={checkInDate}
                  checkOut={checkOutDate}
                  onSelectDate={(checkIn, checkOut) => {
                    if (!checkIn && !checkOut) {
                      setCheckInDate(null);
                      setCheckOutDate(null);
                      return;
                    }
                    if (activeField === "checkIn") {
                      setCheckInDate(checkIn);
                      setCheckOutDate(null);
                    } else if (
                      activeField === "checkOut" &&
                      checkInDate &&
                      checkOut &&
                      dayjs(checkOut).isAfter(checkInDate)
                    ) {
                      setCheckOutDate(checkOut);
                    }
                    if (checkIn && checkOut) {
                      setCheckInDate(checkIn);
                      setCheckOutDate(checkOut);
                    }
                  }}
                  onClose={() => setCalendarOpen(false)}
                  bookedDates={bookedDates}
                />
              )}

              {/* Guest dropdown */}
              <div
                ref={dropdownRef}
                className="relative border rounded-md px-3 py-2 mb-4 cursor-pointer"
                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              >
                <p className="text-[11px] font-semibold mb-[2px]">GUESTS</p>
                <p className="text-[14px]">{guestLabel()}</p>
                <img
                  src={dropdownIcon}
                  alt="dropdown"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3"
                />

                {showGuestDropdown && (
                  <div className="absolute left-0 top-[100%] mt-2 w-full bg-white rounded-xl shadow-xl p-4 z-10">
                    {[
                      {
                        key: "adults",
                        label: "Adults",
                        desc: "Age 13+",
                      },
                      {
                        key: "children",
                        label: "Children",
                        desc: "Age 2 - 12",
                      },
                      {
                        key: "infants",
                        label: "Infants",
                        desc: "Under 2",
                      },
                      {
                        key: "pets",
                        label: "Pets",
                        desc: "",
                      },
                    ].map(({ key, label, desc }) => (
                      <div
                        key={key}
                        className="flex justify-between items-center mb-3"
                      >
                        <div>
                          <p className="font-semibold text-[15px] leading-4">
                            {label}
                          </p>
                          {desc && (
                            <p className="text-[13px] text-gray-500">{desc}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateGuestCount(key, -1);
                            }}
                          >
                            <img
                              src={minusIcon}
                              alt="-"
                              className="w-6 h-6"
                            />
                          </button>
                          <span className="w-4 text-center text-[15px]">
                            {guests[key]}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateGuestCount(key, 1);
                            }}
                          >
                            <img src={plusIcon} alt="+" className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      className="mt-2 text-right w-full text-[14px] font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGuestDropdown(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              {checkInDate && checkOutDate && areDatesAvailable() && (
                <div className="text-[20px] font-semibold mb-2">
                  ${totalPrice}{" "}
                  <span className="text-sm font-normal text-gray-600">
                    for {totalNights} night
                    {totalNights > 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Reserve / Check availability button */}
              <button
                onClick={() => {
                  if (checkInDate && checkOutDate && areDatesAvailable()) {
                    const nights = dayjs(checkOutDate).diff(
                      dayjs(checkInDate),
                      "day"
                    );
                    const total = nights * pricePerNight;

                    const parts = [];
                    if (guests.adults)
                      parts.push(
                        `${guests.adults} guest${
                          guests.adults > 1 ? "s" : ""
                        }`
                      );
                    if (guests.children)
                      parts.push(
                        `${guests.children} child${
                          guests.children > 1 ? "ren" : ""
                        }`
                      );
                    if (guests.infants)
                      parts.push(
                        `${guests.infants} infant${
                          guests.infants > 1 ? "s" : ""
                        }`
                      );
                    if (guests.pets)
                      parts.push(
                        `${guests.pets} pet${guests.pets > 1 ? "s" : ""}`
                      );
                    const guestSummary = parts.join(", ");

                    navigate("/payment", {
                      state: {
                        roomId: room?._id,
                        roomTitle: room?.title || "Roostr Listing",
                        roomImage: mainImage,
                        checkInDate: checkInDate
                          ? checkInDate.toISOString()
                          : null,
                        checkOutDate: checkOutDate
                          ? checkOutDate.toISOString()
                          : null,
                        totalNights: nights,
                        totalPrice: total,
                        pricePerNight,
                        guestSummary,
                        guests,
                      },
                    });
                  }
                }}
                disabled={!checkInDate || !checkOutDate || !areDatesAvailable()}
                className="mt-4 w-full py-2 text-white text-[15px] font-semibold rounded-md transition bg-[#FF5A5F] hover:bg-[#e04141] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {checkInDate && checkOutDate && areDatesAvailable()
                  ? "Reserve"
                  : "Check availability"}
              </button>

              <p className="text-[13px] text-gray-500 text-center mt-2">
                You won’t be charged yet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AMENITIES MODAL */}
      <AmenitiesModal
        isOpen={showAmenitiesModal}
        onClose={() => setShowAmenitiesModal(false)}
        amenitiesByCategory={amenitiesByCategory}
      />
    </>
  );
};

export default RoomDetails;
