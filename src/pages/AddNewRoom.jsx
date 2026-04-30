// // src/pages/AddNewRoom.jsx
// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import SuccessModal from "../components/SuccessModal";

// // ----- ICON IMPORTS -----
// import selfCheckIn from "../assets/roomicons/self-check-in.png";
// import parkForFree from "../assets/roomicons/park-for-free.png";
// import isSuperhost from "../assets/roomicons/is-superhost.png";
// import outdoorEntertainment from "../assets/roomicons/outdoor-dinniig-area.png";

// // Bathroom
// import hairDryer from "../assets/roomicons/hair-dryer.png";
// import shampoo from "../assets/roomicons/shampoo.png";
// import conditioner from "../assets/roomicons/conditioner.png";
// import bodySoap from "../assets/roomicons/body-soap.png";
// import hotWater from "../assets/roomicons/hot-water.png";
// import washerDryer from "../assets/roomicons/washing-dryer.png";
// import jacuzzi from "../assets/roomicons/jacuzzi.png";
// import bath from "../assets/roomicons/bath.png";

// // Bedroom & laundry
// import essentials from "../assets/roomicons/essentials.png";
// import extraPillows from "../assets/roomicons/extra-pillows.png";
// import iron from "../assets/roomicons/iron.png";
// import miniFridge from "../assets/roomicons/mini-fridge.png";
// import clothesStorage from "../assets/roomicons/clothes-storage.png";
// import hangers from "../assets/roomicons/hangers.png";

// // Entertainment
// import wifi from "../assets/roomicons/wifi.png";
// import tv from "../assets/roomicons/tv.png";
// import ethernet from "../assets/roomicons/ethernet.png";
// import gamesConsole from "../assets/roomicons/games-console.png";
// import books from "../assets/roomicons/books.png";
// import outdoorPlayground from "../assets/roomicons/outdoor-playground.png";

// // Home safety
// import smokeAlarm from "../assets/roomicons/smoke-alarm.png";
// import carbonAlarm from "../assets/roomicons/carbon-alarm.png";
// import securityCamera from "../assets/roomicons/security-camera.png";
// import fireExtinguisher from "../assets/roomicons/fire-extinguisher.png";
// import firstAidKit from "../assets/roomicons/first-aid-kit.png";
// import security247 from "../assets/roomicons/247-security.png";

// // Heating & cooling
// import ac from "../assets/roomicons/ac.png";
// import heater from "../assets/roomicons/heater.png";

// // Kitchen & dining
// import kitchen from "../assets/roomicons/kitchen.png";
// import fridge from "../assets/roomicons/fridge.png";
// import microwave from "../assets/roomicons/microwave.png";
// import cookingBasics from "../assets/roomicons/cooking-basics.png";
// import dishesCutlery from "../assets/roomicons/dishes-cutlery.png";
// import cooker from "../assets/roomicons/cooker.png";
// import kettle from "../assets/roomicons/kettle.png";
// import coffeeMaker from "../assets/roomicons/coffee-maker.png";
// import freezer from "../assets/roomicons/freezer.png";
// import oven from "../assets/roomicons/oven.png";
// import dishwasher from "../assets/roomicons/dishwasher.png";
// import toaster from "../assets/roomicons/toaster.png";
// import wineGlasses from "../assets/roomicons/wine-glass.png";
// import liquor from "../assets/roomicons/liquor.png";
// import diningTable from "../assets/roomicons/dinning-table.png";
// import wipes from "../assets/roomicons/wipes-tissues.png";

// // Facilities
// import freeParking from "../assets/roomicons/park-for-free.png";
// import paidParking from "../assets/roomicons/parking-meter.png";
// import sauna from "../assets/roomicons/sauna.png";
// import bbq from "../assets/roomicons/bbq.png";
// import lift from "../assets/roomicons/Lift.png";
// import gym from "../assets/roomicons/gym.png";
// import dedicatedWorkspace from "../assets/roomicons/workspace-dedicated.png";

// // Outdoor
// import resortAccess from "../assets/roomicons/resort-access.png";
// import outdoorDining from "../assets/roomicons/outdoor-dinniig-area.png";
// import pool from "../assets/roomicons/pool.png";

// // Services
// import cleaning from "../assets/roomicons/cleaning-available-durig-stay.png";
// import lockbox from "../assets/roomicons/lock-box.png";
// import longTermStay from "../assets/roomicons/long-term-stay-allowed.png";
// import selfCheckService from "../assets/roomicons/self-check-inn.png";

// // Not included
// import noWifi from "../assets/roomicons/no-wifi.png";
// import noTv from "../assets/roomicons/no-tv.png";
// import noLiquor from "../assets/roomicons/no-liquor.png";
// import noSmoke from "../assets/roomicons/no-smoke.png";
// import noHeater from "../assets/roomicons/no-heater.png";
// import noCctv from "../assets/roomicons/no-cctv.png";

// // Upload icon
// import uploadIcon from "../assets/roomicons/upload-cloud.png";

// // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const API_URL = "";

// // ------------ STATIC DATA ------------

// const highlightDetails = [
//   {
//     id: "selfCheck",
//     title: "Self Check-in",
//     description: "Check yourself in with the lockbox.",
//     icon: selfCheckIn,
//   },
//   {
//     id: "parkFree",
//     title: "Park for free",
//     description: "One of the few places in this area with free parking.",
//     icon: parkForFree,
//   },
//   {
//     id: "superhost",
//     title: "Sithum is a Superhost",
//     description: "Superhosts are experienced, highly rated Hosts.",
//     icon: isSuperhost,
//   },
//   {
//     id: "outdoorEntertainment",
//     title: "Outdoor entertainment",
//     description: "The pool and outdoor seating are great for summer trips.",
//     icon: outdoorEntertainment,
//   },
// ];

// const amenityCategories = [
//   {
//     title: "Bathroom",
//     items: [
//       { id: "hairDryer", label: "Hair dryer", icon: hairDryer },
//       { id: "shampoo", label: "Shampoo", icon: shampoo },
//       { id: "conditioner", label: "Conditioner", icon: conditioner },
//       { id: "bodySoap", label: "Body soap", icon: bodySoap },
//       { id: "hotWater", label: "Hot water", icon: hotWater },
//       { id: "washerDryer", label: "Washing machine with dryer", icon: washerDryer },
//       { id: "jacuzzi", label: "Jacuzzi", icon: jacuzzi },
//       { id: "bath", label: "Bath", icon: bath },
//     ],
//   },
//   {
//     title: "Bedroom and laundry",
//     items: [
//       {
//         id: "essentials",
//         label: "Essentials (Towels, bed sheets etc.)",
//         icon: essentials,
//       },
//       {
//         id: "extraPillows",
//         label: "Extra pillows and blankets",
//         icon: extraPillows,
//       },
//       { id: "iron", label: "Iron", icon: iron },
//       { id: "miniFridge", label: "Mini fridge with mini bar", icon: miniFridge },
//       { id: "clothesStorage", label: "Clothes storage", icon: clothesStorage },
//       { id: "hangers", label: "Hangers", icon: hangers },
//     ],
//   },
//   {
//     title: "Entertainment",
//     items: [
//       { id: "wifi", label: "Wifi", icon: wifi },
//       { id: "tv", label: "TV", icon: tv },
//       { id: "ethernet", label: "Ethernet", icon: ethernet },
//       { id: "gamesConsole", label: "Games console", icon: gamesConsole },
//       { id: "books", label: "Books and reading material", icon: books },
//       { id: "outdoorPlayground", label: "Outdoor playground", icon: outdoorPlayground },
//     ],
//   },
//   {
//     title: "Home Safety",
//     items: [
//       { id: "smokeAlarm", label: "Smoke alarm", icon: smokeAlarm },
//       { id: "carbonAlarm", label: "Carbon monoxide alarm", icon: carbonAlarm },
//       {
//         id: "securityCamera",
//         label: "Exterior security cameras on property",
//         icon: securityCamera,
//       },
//       {
//         id: "fireExtinguisher",
//         label: "Fire extinguisher",
//         icon: fireExtinguisher,
//       },
//       { id: "firstAidKit", label: "First aid kit", icon: firstAidKit },
//       { id: "security247", label: "24/7 Security", icon: security247 },
//     ],
//   },
//   {
//     title: "Heating and cooling",
//     items: [
//       { id: "ac", label: "Air conditioning", icon: ac },
//       { id: "heater", label: "Heater", icon: heater },
//     ],
//   },
//   {
//     title: "Kitchen and dining",
//     items: [
//       { id: "kitchen", label: "Kitchen", icon: kitchen },
//       { id: "fridge", label: "Fridge", icon: fridge },
//       { id: "microwave", label: "Microwave", icon: microwave },
//       {
//         id: "cookingBasics",
//         label: "Cooking basics (Pots, pans etc.)",
//         icon: cookingBasics,
//       },
//       { id: "dishesCutlery", label: "Dishes and cutlery", icon: dishesCutlery },
//       { id: "cooker", label: "Cooker", icon: cooker },
//       { id: "kettle", label: "Kettle", icon: kettle },
//       { id: "coffeeMaker", label: "Coffee maker: Nespresso", icon: coffeeMaker },
//       { id: "freezer", label: "Freezer", icon: freezer },
//       { id: "oven", label: "Oven", icon: oven },
//       { id: "dishwasher", label: "Dishwasher", icon: dishwasher },
//       { id: "toaster", label: "Toaster", icon: toaster },
//       { id: "wineGlasses", label: "Wine glasses", icon: wineGlasses },
//       { id: "liquor", label: "Liquor", icon: liquor },
//       { id: "diningTable", label: "Dining table", icon: diningTable },
//       { id: "wipes", label: "Wipes / tissues", icon: wipes },
//     ],
//   },
//   {
//     title: "Facilities",
//     items: [
//       { id: "freeParking", label: "Free parking on premises", icon: freeParking },
//       { id: "paidParking", label: "Paid parking off premises", icon: paidParking },
//       { id: "sauna", label: "Sauna", icon: sauna },
//       { id: "bbq", label: "BBQ machine", icon: bbq },
//       { id: "lift", label: "Lift", icon: lift },
//       { id: "gym", label: "Gym", icon: gym },
//       { id: "workspace", label: "Dedicated workspace", icon: dedicatedWorkspace },
//     ],
//   },
//   {
//     title: "Outdoor",
//     items: [
//       { id: "resortAccess", label: "Resort access", icon: resortAccess },
//       { id: "outdoorDining", label: "Outdoor dining area", icon: outdoorDining },
//       { id: "pool", label: "Pool", icon: pool },
//     ],
//   },
//   {
//     title: "Services",
//     items: [
//       { id: "selfCheckService", label: "Self check-in", icon: selfCheckService },
//       {
//         id: "cleaning",
//         label: "Cleaning available during stay",
//         icon: cleaning,
//       },
//       { id: "lockbox", label: "Lockbox", icon: lockbox },
//       { id: "longTermStay", label: "Long-term stays allowed", icon: longTermStay },
//     ],
//   },
//   {
//     title: "Not Included",
//     items: [
//       { id: "noWifi", label: "Wifi", icon: noWifi },
//       { id: "noTv", label: "TV", icon: noTv },
//       { id: "noLiquor", label: "Liquor (Mini bar)", icon: noLiquor },
//       { id: "noSmoke", label: "Smoke area", icon: noSmoke },
//       { id: "noHeater", label: "Heater", icon: noHeater },
//       {
//         id: "noCctv",
//         label: "Exterior security cameras on property",
//         icon: noCctv,
//       },
//     ],
//   },
// ];

// // ------------- REUSABLE AMENITY ROW -------------

// const AmenityCheckbox = ({ id, label, icon, description }) => (
//   <label className="flex items-start justify-between gap-3 cursor-pointer text-[13px]">
//     <div className="flex items-start gap-3">
//       {icon && (
//         <img src={icon} alt={label} className="w-6 h-6 object-contain mt-[2px]" />
//       )}
//       <div>
//         <div className="font-normal text-[#222222]">{label}</div>
//         {description && (
//           <p className="text-[11px] text-[#777777] leading-snug mt-[2px]">
//             {description}
//           </p>
//         )}
//       </div>
//     </div>

//     <div className="mt-[2px]">
//       <input id={id} name={id} type="checkbox" className="peer sr-only" />
//       <span
//         className="
//           inline-flex w-[18px] h-[18px] rounded-[4px]
//           border border-[#555555]
//           items-center justify-center
//           peer-checked:bg-[#ff5a5f] peer-checked:border-[#ff5a5f]
//           transition-colors
//         "
//       >
//         <svg
//           className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="3"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M5 13l4 4L19 7" />
//         </svg>
//       </span>
//     </div>
//   </label>
// );

// // ------------- MAIN COMPONENT -------------

// const AddNewRoom = () => {
//   const navigate = useNavigate();

//   // text fields
//   const [title, setTitle] = useState("");
//   const [placeInfo, setPlaceInfo] = useState("");
//   const [hostAbout, setHostAbout] = useState("");
//   const [houseRules, setHouseRules] = useState(["", "", "", ""]);
//   const [safetyRules, setSafetyRules] = useState(["", "", "", ""]);
//   const [cancellationPolicy, setCancellationPolicy] = useState("");

//   // NEW – basic location fields (used by search / backend)
//   const [city, setCity] = useState("");
//   const [country, setCountry] = useState("Sri Lanka"); // default, can change

//   // images
//   const [coverImage, setCoverImage] = useState(null);
//   const [galleryImages, setGalleryImages] = useState([]);

//   // success modal
//   const [showSuccess, setShowSuccess] = useState(false);

//   const coverInputRef = useRef(null);
//   const galleryInputRef = useRef(null);

//   const handleCoverChange = (file) => {
//     if (!file) return;
//     setCoverImage(file);
//   };

//   const handleGalleryChange = (fileList) => {
//     if (!fileList || fileList.length === 0) return;
//     const incoming = Array.from(fileList);
//     setGalleryImages((prev) => {
//       const combined = [...prev, ...incoming];
//       return combined.slice(0, 4);
//     });
//   };

//   const onCoverDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files?.[0]) {
//       handleCoverChange(e.dataTransfer.files[0]);
//     }
//   };

//   const onGalleryDrop = (e) => {
//     e.preventDefault();
//     if (e.dataTransfer.files?.length) {
//       handleGalleryChange(e.dataTransfer.files);
//     }
//   };

//   const removeGalleryImage = (index) => {
//     setGalleryImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   // ---------- SAVE HANDLER ----------
//   const handleSave = async () => {
//     try {
//       if (!title.trim()) {
//         alert("Please enter a name for the house/apartment.");
//         return;
//       }
//       if (!coverImage) {
//         alert("Please upload a cover image.");
//         return;
//       }

//       // ⬇️  Get token + host user from localStorage
//       const token = localStorage.getItem("roostrToken");
//       const storedUser = localStorage.getItem("roostrUser");

//       if (!token || !storedUser) {
//         alert("You must be logged in as a host to create a room.");
//         return;
//       }

//       let hostId = null;
//       try {
//         const parsed = JSON.parse(storedUser);
//         if (parsed && parsed.role === "host") {
//           // ✅ support both { id } and { _id } shapes
//           hostId = parsed.id || parsed._id;
//         }
//       } catch (e) {
//         console.error("Failed to parse roostrUser", e);
//       }

//       if (!hostId) {
//         alert(
//           "Host id not found. Please log in again as a host (Become a host → then log in again)."
//         );
//         return;
//       }

//       // collect checkbox selections (DOM query)
//       const checked = Array.from(
//         document.querySelectorAll('input[type="checkbox"]:checked')
//       ).map((el) => el.id);

//       const highlightIds = highlightDetails.map((h) => h.id);
//       const notIncludedCategory = amenityCategories.find(
//         (c) => c.title === "Not Included"
//       );
//       const notIncludedIds = notIncludedCategory
//         ? notIncludedCategory.items.map((i) => i.id)
//         : [];

//       const selectedHighlights = checked.filter((id) =>
//         highlightIds.includes(id)
//       );
//       const selectedNotIncluded = checked.filter((id) =>
//         notIncludedIds.includes(id)
//       );
//       const selectedAmenities = checked.filter(
//         (id) => !highlightIds.includes(id) && !notIncludedIds.includes(id)
//       );

//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", placeInfo);
//       formData.append("hostAbout", hostAbout);
//       formData.append("cancellationPolicy", cancellationPolicy);

//       // NEW – send location to backend (used by /api/rooms/search)
//       formData.append("city", city);
//       formData.append("country", country);

//       // ✅ append hostId – REQUIRED by backend
//       formData.append("hostId", hostId);

//       formData.append("houseRules", JSON.stringify(houseRules.filter((x) => x)));
//       formData.append("safetyRules", JSON.stringify(safetyRules.filter((x) => x)));
//       formData.append("highlights", JSON.stringify(selectedHighlights));
//       formData.append("amenities", JSON.stringify(selectedAmenities));
//       formData.append("notIncluded", JSON.stringify(selectedNotIncluded));

//       formData.append("coverImage", coverImage);
//       galleryImages.forEach((file) => {
//         formData.append("galleryImages", file);
//       });

//       const res = await axios.post(`${API_URL}/api/rooms`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("Room created:", res.data);

//       // 🔥 Show success modal
//       setShowSuccess(true);
//     } catch (err) {
//       console.error("Save error:", err.response?.data || err.message);
//       alert(
//         `Save button is working, but backend returned an error.\n\n${
//           err.response?.data?.message || err.message
//         }`
//       );
//     }
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-[#f4f4f4] py-10">
//         <div className="mx-auto max-w-[1120px] bg-white rounded-3xl shadow-[0_18px_55px_rgba(0,0,0,0.16)] px-12 pt-10 pb-12">
//           <h1 className="text-[18px] font-semibold mb-8">
//             Add a New House, Apartment
//           </h1>

//           {/* 1. Name */}
//           <section className="mb-8">
//             <h2 className="text-[14px] font-semibold mb-3">
//               1. Name of the House, Apartment
//             </h2>

//             {/* original name input */}
//             <input
//               type="text"
//               placeholder="Name"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="w-[320px] h-10 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
//             />

//             {/* NEW – city + country, same pill style */}
//             <div className="mt-4 flex flex-wrap gap-3">
//               <input
//                 type="text"
//                 placeholder="City (eg: Colombo)"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//                 className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
//               />
//               <select
//                 value={country}
//                 onChange={(e) => setCountry(e.target.value)}
//                 className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black bg-white"
//               >
//                 <option value="Sri Lanka">Sri Lanka</option>
//                 <option value="Japan">Japan</option>
//                 <option value="France">France</option>
//                 <option value="United Kingdom">United Kingdom</option>
//                 <option value="Dubai">Dubai</option>
//                 <option value="Brazil">Brazil</option>
//                 <option value="Thailand">Thailand</option>
//                 <option value="Italy">Italy</option>
//                 <option value="India">India</option>
//                 <option value="United States">United States</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//           </section>

//           {/* 2. Highlights */}
//           <section className="mb-10">
//             <h2 className="text-[14px] font-semibold mb-4">
//               2. Check The Needed Details You need to Show in the page
//             </h2>

//             <div className="space-y-4">
//               {highlightDetails.map((item) => (
//                 <AmenityCheckbox
//                   key={item.id}
//                   id={item.id}
//                   label={item.title}
//                   icon={item.icon}
//                   description={item.description}
//                 />
//               ))}
//             </div>
//           </section>

//           {/* 3. Message about place */}
//           <section className="mb-10">
//             <h2 className="text-[14px] font-semibold mb-3">
//               3. Put Some Message about the Place or Information
//             </h2>
//             <textarea
//               rows={5}
//               value={placeInfo}
//               onChange={(e) => setPlaceInfo(e.target.value)}
//               className="w-full max-w-[520px] px-4 py-3 text-[13px] border border-[#c4c4c4] rounded-2xl outline-none resize-none focus:border-black"
//             />
//           </section>

//           {/* 4. Amenities */}
//           <section className="mb-10">
//             <h2 className="text-[14px] font-semibold mb-5">
//               4. What this Place offers (Check the boxes to Show the Amenities in
//               the page)
//             </h2>

//             <div className="space-y-8">
//               {amenityCategories.map((cat) => (
//                 <div key={cat.title}>
//                   <h3 className="text-[13px] font-semibold mb-3">
//                     {cat.title}
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-x-14 gap-y-4">
//                     {cat.items.map((item) => (
//                       <AmenityCheckbox
//                         key={item.id}
//                         id={item.id}
//                         label={item.label}
//                         icon={item.icon}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* 5. Meet your host */}
//           <section className="mb-10">
//             <h2 className="text-[14px] font-semibold mb-3">
//               5. Meet Your host
//             </h2>
//             <p className="text-[13px] mb-2">About Yourself or business</p>
//             <textarea
//               rows={5}
//               value={hostAbout}
//               onChange={(e) => setHostAbout(e.target.value)}
//               className="w-full max-w-[520px] px-4 py-3 text-[13px] border border-[#c4c4c4] rounded-2xl outline-none resize-none focus:border-black"
//             />
//           </section>

//           {/* 6. Things to know */}
//           <section className="mb-10">
//             <h2 className="text-[14px] font-semibold mb-4">6. Things to Know</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
//               {/* House rules */}
//               <div>
//                 <h3 className="text-[13px] font-semibold mb-3">House rules</h3>
//                 <div className="space-y-3">
//                   {houseRules.map((value, idx) => (
//                     <input
//                       key={idx}
//                       type="text"
//                       placeholder="Name"
//                       value={value}
//                       onChange={(e) => {
//                         const copy = [...houseRules];
//                         copy[idx] = e.target.value;
//                         setHouseRules(copy);
//                       }}
//                       className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Safety & property */}
//               <div>
//                 <h3 className="text-[13px] font-semibold mb-3">
//                   Safety & property
//                 </h3>
//                 <div className="space-y-3">
//                   {safetyRules.map((value, idx) => (
//                     <input
//                       key={idx}
//                       type="text"
//                       placeholder="Name"
//                       value={value}
//                       onChange={(e) => {
//                         const copy = [...safetyRules];
//                         copy[idx] = e.target.value;
//                         setSafetyRules(copy);
//                       }}
//                       className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Cancellation policy */}
//               <div>
//                 <h3 className="text-[13px] font-semibold mb-3">
//                   Cancellation policy
//                 </h3>
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={cancellationPolicy}
//                   onChange={(e) => setCancellationPolicy(e.target.value)}
//                   className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
//                 />
//               </div>
//             </div>
//           </section>

//           {/* 7. Upload Images */}
//           <section className="mb-8">
//             <h2 className="text-[14px] font-semibold mb-4">7. Upload Images</h2>

//             <div className="flex flex-wrap gap-8 mb-8">
//               {/* Cover image */}
//               <div
//                 onClick={() => coverInputRef.current?.click()}
//                 onDragOver={(e) => e.preventDefault()}
//                 onDrop={onCoverDrop}
//                 className="
//                   w-[220px] h-[130px] border border-dashed border-[#ff5a5f]
//                   rounded-xl flex flex-col items-center justify-center
//                   text-center text-[11px] text-[#555555]
//                   cursor-pointer hover:bg-[#fff6f6] transition
//                   shadow-[0_8px_22px_rgba(0,0,0,0.06)]
//                 "
//               >
//                 <input
//                   ref={coverInputRef}
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   onChange={(e) => handleCoverChange(e.target.files?.[0])}
//                 />
//                 {coverImage ? (
//                   <div className="relative w-full h-full flex items-center justify-center px-2 py-2">
//                     <img
//                       src={URL.createObjectURL(coverImage)}
//                       alt="Cover"
//                       className="w-full h-full object-cover rounded-[10px]"
//                     />
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setCoverImage(null);
//                       }}
//                       className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/70 text-white text-[11px] flex items-center justify-center"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <img
//                       src={uploadIcon}
//                       alt="Upload"
//                       className="w-8 h-8 mb-2 object-contain"
//                     />
//                     <span className="font-semibold mb-1">Cover image</span>
//                     <span>Drag and drop or click here</span>
//                     <span>to upload image</span>
//                   </>
//                 )}
//               </div>

//               {/* Gallery images */}
//               <div
//                 onClick={() => galleryInputRef.current?.click()}
//                 onDragOver={(e) => e.preventDefault()}
//                 onDrop={onGalleryDrop}
//                 className="
//                   w-[220px] h-[130px] border border-dashed border-[#ff5a5f]
//                   rounded-xl flex flex-col items-center justify-center
//                   text-center text-[11px] text-[#555555]
//                   cursor-pointer hover:bg-[#fff6f6] transition
//                   shadow-[0_8px_22px_rgba(0,0,0,0.06)]
//                 "
//               >
//                 <input
//                   ref={galleryInputRef}
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   className="hidden"
//                   onChange={(e) => handleGalleryChange(e.target.files)}
//                 />

//                 {galleryImages.length > 0 ? (
//                   <div className="w-full h-full px-2 py-2 flex flex-col gap-1">
//                     <div className="text-left text-[11px] font-semibold mb-1">
//                       Gallery images ({galleryImages.length}/4)
//                     </div>
//                     <div className="grid grid-cols-4 gap-1 flex-1">
//                       {galleryImages.map((file, index) => (
//                         <div key={index} className="relative w-full h-full">
//                           <img
//                             src={URL.createObjectURL(file)}
//                             alt={`Gallery ${index + 1}`}
//                             className="w-full h-full object-cover rounded-[6px]"
//                           />
//                           <button
//                             type="button"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               removeGalleryImage(index);
//                             }}
//                             className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black/70 text-white text-[9px] flex items-center justify-center"
//                           >
//                             ×
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                     {galleryImages.length < 4 && (
//                       <div className="text-left text-[10px] text-gray-600 mt-1">
//                         Click or drop more images (max 4)
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <>
//                     <img
//                       src={uploadIcon}
//                       alt="Upload"
//                       className="w-8 h-8 mb-2 object-contain"
//                     />
//                     <span className="font-semibold mb-1">
//                       Gallery images (up to 4)
//                     </span>
//                     <span>Drag and drop or click here</span>
//                     <span>to upload image</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleSave}
//               className="
//                 w-[180px] h-10 rounded-full bg-[#ff5a5f]
//                 text-white text-[13px] font-semibold
//                 flex items-center justify-center
//                 hover:bg-[#ff4046] active:bg-[#e4373d]
//                 transition-colors
//               "
//             >
//               Save
//             </button>
//           </section>
//         </div>
//       </div>

//       {/* SUCCESS MODAL */}
//       <SuccessModal
//         open={showSuccess}
//         title="Successfully Added"
//         subtitle="Your Resident"
//         onClose={() => {
//           setShowSuccess(false);
//           navigate("/host/dashboard");
//         }}
//       />
//     </>
//   );
// };

// export default AddNewRoom;

// src/pages/AddNewRoom.jsx
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SuccessModal from "../components/SuccessModal";

// ----- ICON IMPORTS -----
import selfCheckIn from "../assets/roomicons/self-check-in.png";
import parkForFree from "../assets/roomicons/park-for-free.png";
import isSuperhost from "../assets/roomicons/is-superhost.png";
import outdoorEntertainment from "../assets/roomicons/outdoor-dinniig-area.png";

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
import dedicatedWorkspace from "../assets/roomicons/workspace-dedicated.png";

// Outdoor
import resortAccess from "../assets/roomicons/resort-access.png";
import outdoorDining from "../assets/roomicons/outdoor-dinniig-area.png";
import pool from "../assets/roomicons/pool.png";

// Services
import cleaning from "../assets/roomicons/cleaning-available-durig-stay.png";
import lockbox from "../assets/roomicons/lock-box.png";
import longTermStay from "../assets/roomicons/long-term-stay-allowed.png";
import selfCheckService from "../assets/roomicons/self-check-inn.png";

// Not included
import noWifi from "../assets/roomicons/no-wifi.png";
import noTv from "../assets/roomicons/no-tv.png";
import noLiquor from "../assets/roomicons/no-liquor.png";
import noSmoke from "../assets/roomicons/no-smoke.png";
import noHeater from "../assets/roomicons/no-heater.png";
import noCctv from "../assets/roomicons/no-cctv.png";

// Upload icon
import uploadIcon from "../assets/roomicons/upload-cloud.png";

// ------------ STATIC DATA ------------

const highlightDetails = [
  {
    id: "selfCheck",
    title: "Self Check-in",
    description: "Check yourself in with the lockbox.",
    icon: selfCheckIn,
  },
  {
    id: "parkFree",
    title: "Park for free",
    description: "One of the few places in this area with free parking.",
    icon: parkForFree,
  },
  {
    id: "superhost",
    title: "Sithum is a Superhost",
    description: "Superhosts are experienced, highly rated Hosts.",
    icon: isSuperhost,
  },
  {
    id: "outdoorEntertainment",
    title: "Outdoor entertainment",
    description: "The pool and outdoor seating are great for summer trips.",
    icon: outdoorEntertainment,
  },
];

const amenityCategories = [
  {
    title: "Bathroom",
    items: [
      { id: "hairDryer", label: "Hair dryer", icon: hairDryer },
      { id: "shampoo", label: "Shampoo", icon: shampoo },
      { id: "conditioner", label: "Conditioner", icon: conditioner },
      { id: "bodySoap", label: "Body soap", icon: bodySoap },
      { id: "hotWater", label: "Hot water", icon: hotWater },
      { id: "washerDryer", label: "Washing machine with dryer", icon: washerDryer },
      { id: "jacuzzi", label: "Jacuzzi", icon: jacuzzi },
      { id: "bath", label: "Bath", icon: bath },
    ],
  },
  {
    title: "Bedroom and laundry",
    items: [
      {
        id: "essentials",
        label: "Essentials (Towels, bed sheets etc.)",
        icon: essentials,
      },
      {
        id: "extraPillows",
        label: "Extra pillows and blankets",
        icon: extraPillows,
      },
      { id: "iron", label: "Iron", icon: iron },
      { id: "miniFridge", label: "Mini fridge with mini bar", icon: miniFridge },
      { id: "clothesStorage", label: "Clothes storage", icon: clothesStorage },
      { id: "hangers", label: "Hangers", icon: hangers },
    ],
  },
  {
    title: "Entertainment",
    items: [
      { id: "wifi", label: "Wifi", icon: wifi },
      { id: "tv", label: "TV", icon: tv },
      { id: "ethernet", label: "Ethernet", icon: ethernet },
      { id: "gamesConsole", label: "Games console", icon: gamesConsole },
      { id: "books", label: "Books and reading material", icon: books },
      { id: "outdoorPlayground", label: "Outdoor playground", icon: outdoorPlayground },
    ],
  },
  {
    title: "Home Safety",
    items: [
      { id: "smokeAlarm", label: "Smoke alarm", icon: smokeAlarm },
      { id: "carbonAlarm", label: "Carbon monoxide alarm", icon: carbonAlarm },
      {
        id: "securityCamera",
        label: "Exterior security cameras on property",
        icon: securityCamera,
      },
      {
        id: "fireExtinguisher",
        label: "Fire extinguisher",
        icon: fireExtinguisher,
      },
      { id: "firstAidKit", label: "First aid kit", icon: firstAidKit },
      { id: "security247", label: "24/7 Security", icon: security247 },
    ],
  },
  {
    title: "Heating and cooling",
    items: [
      { id: "ac", label: "Air conditioning", icon: ac },
      { id: "heater", label: "Heater", icon: heater },
    ],
  },
  {
    title: "Kitchen and dining",
    items: [
      { id: "kitchen", label: "Kitchen", icon: kitchen },
      { id: "fridge", label: "Fridge", icon: fridge },
      { id: "microwave", label: "Microwave", icon: microwave },
      {
        id: "cookingBasics",
        label: "Cooking basics (Pots, pans etc.)",
        icon: cookingBasics,
      },
      { id: "dishesCutlery", label: "Dishes and cutlery", icon: dishesCutlery },
      { id: "cooker", label: "Cooker", icon: cooker },
      { id: "kettle", label: "Kettle", icon: kettle },
      { id: "coffeeMaker", label: "Coffee maker: Nespresso", icon: coffeeMaker },
      { id: "freezer", label: "Freezer", icon: freezer },
      { id: "oven", label: "Oven", icon: oven },
      { id: "dishwasher", label: "Dishwasher", icon: dishwasher },
      { id: "toaster", label: "Toaster", icon: toaster },
      { id: "wineGlasses", label: "Wine glasses", icon: wineGlasses },
      { id: "liquor", label: "Liquor", icon: liquor },
      { id: "diningTable", label: "Dining table", icon: diningTable },
      { id: "wipes", label: "Wipes / tissues", icon: wipes },
    ],
  },
  {
    title: "Facilities",
    items: [
      { id: "freeParking", label: "Free parking on premises", icon: freeParking },
      { id: "paidParking", label: "Paid parking off premises", icon: paidParking },
      { id: "sauna", label: "Sauna", icon: sauna },
      { id: "bbq", label: "BBQ machine", icon: bbq },
      { id: "lift", label: "Lift", icon: lift },
      { id: "gym", label: "Gym", icon: gym },
      { id: "workspace", label: "Dedicated workspace", icon: dedicatedWorkspace },
    ],
  },
  {
    title: "Outdoor",
    items: [
      { id: "resortAccess", label: "Resort access", icon: resortAccess },
      { id: "outdoorDining", label: "Outdoor dining area", icon: outdoorDining },
      { id: "pool", label: "Pool", icon: pool },
    ],
  },
  {
    title: "Services",
    items: [
      { id: "selfCheckService", label: "Self check-in", icon: selfCheckService },
      { id: "cleaning", label: "Cleaning available during stay", icon: cleaning },
      { id: "lockbox", label: "Lockbox", icon: lockbox },
      { id: "longTermStay", label: "Long-term stays allowed", icon: longTermStay },
    ],
  },
  {
    title: "Not Included",
    items: [
      { id: "noWifi", label: "Wifi", icon: noWifi },
      { id: "noTv", label: "TV", icon: noTv },
      { id: "noLiquor", label: "Liquor (Mini bar)", icon: noLiquor },
      { id: "noSmoke", label: "Smoke area", icon: noSmoke },
      { id: "noHeater", label: "Heater", icon: noHeater },
      { id: "noCctv", label: "Exterior security cameras on property", icon: noCctv },
    ],
  },
];

// ------------- REUSABLE AMENITY ROW -------------

const AmenityCheckbox = ({ id, label, icon, description }) => (
  <label className="flex items-start justify-between gap-3 cursor-pointer text-[13px]">
    <div className="flex items-start gap-3">
      {icon && <img src={icon} alt={label} className="w-6 h-6 object-contain mt-[2px]" />}
      <div>
        <div className="font-normal text-[#222222]">{label}</div>
        {description && (
          <p className="text-[11px] text-[#777777] leading-snug mt-[2px]">{description}</p>
        )}
      </div>
    </div>

    <div className="mt-[2px]">
      <input id={id} name={id} type="checkbox" className="peer sr-only" />
      <span
        className="
          inline-flex w-[18px] h-[18px] rounded-[4px]
          border border-[#555555]
          items-center justify-center
          peer-checked:bg-[#ff5a5f] peer-checked:border-[#ff5a5f]
          transition-colors
        "
      >
        <svg
          className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </div>
  </label>
);

// ------------- MAIN COMPONENT -------------

const AddNewRoom = () => {
  const navigate = useNavigate();

  // text fields
  const [title, setTitle] = useState("");
  const [placeInfo, setPlaceInfo] = useState("");
  const [hostAbout, setHostAbout] = useState("");
  const [houseRules, setHouseRules] = useState(["", "", "", ""]);
  const [safetyRules, setSafetyRules] = useState(["", "", "", ""]);
  const [cancellationPolicy, setCancellationPolicy] = useState("");

  // location
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Sri Lanka");

  // images
  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  // success modal
  const [showSuccess, setShowSuccess] = useState(false);

  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleCoverChange = (file) => {
    if (!file) return;
    setCoverImage(file);
  };

  const handleGalleryChange = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    setGalleryImages((prev) => {
      const combined = [...prev, ...incoming];
      return combined.slice(0, 4);
    });
  };

  const onCoverDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleCoverChange(e.dataTransfer.files[0]);
    }
  };

  const onGalleryDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      handleGalleryChange(e.dataTransfer.files);
    }
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------- SAVE HANDLER ----------
  const handleSave = async () => {
    try {
      if (!title.trim()) {
        alert("Please enter a name for the house/apartment.");
        return;
      }
      if (!coverImage) {
        alert("Please upload a cover image.");
        return;
      }

      const token = localStorage.getItem("roostrToken");
      const storedUser = localStorage.getItem("roostrUser");

      if (!token || !storedUser) {
        alert("You must be logged in as a host to create a room.");
        return;
      }

      let hostId = null;
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.role === "host") {
          hostId = parsed.id || parsed._id;
        }
      } catch (e) {
        console.error("Failed to parse roostrUser", e);
      }

      if (!hostId) {
        alert("Host id not found. Please log in again as a host.");
        return;
      }

      // collect checkbox selections
      const checked = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(
        (el) => el.id
      );

      const highlightIds = highlightDetails.map((h) => h.id);
      const notIncludedCategory = amenityCategories.find((c) => c.title === "Not Included");
      const notIncludedIds = notIncludedCategory ? notIncludedCategory.items.map((i) => i.id) : [];

      const selectedHighlights = checked.filter((id) => highlightIds.includes(id));
      const selectedNotIncluded = checked.filter((id) => notIncludedIds.includes(id));
      const selectedAmenities = checked.filter((id) => !highlightIds.includes(id) && !notIncludedIds.includes(id));

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", placeInfo);
      formData.append("hostAbout", hostAbout);
      formData.append("cancellationPolicy", cancellationPolicy);

      formData.append("city", city);
      formData.append("country", country);

      formData.append("hostId", hostId);

      formData.append("houseRules", JSON.stringify(houseRules.filter((x) => x)));
      formData.append("safetyRules", JSON.stringify(safetyRules.filter((x) => x)));
      formData.append("highlights", JSON.stringify(selectedHighlights));
      formData.append("amenities", JSON.stringify(selectedAmenities));
      formData.append("notIncluded", JSON.stringify(selectedNotIncluded));

      formData.append("coverImage", coverImage);
      galleryImages.forEach((file) => {
        formData.append("galleryImages", file);
      });

      // ✅ IMPORTANT: use relative /api so it works on localhost (proxy) + vercel (rewrite)
      const res = await axios.post("/api/rooms", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("Room created:", res.data);

      setShowSuccess(true);
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Unknown error";

      alert(`Save failed.\n\n${msg}`);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#f4f4f4] py-10">
        <div className="mx-auto max-w-[1120px] bg-white rounded-3xl shadow-[0_18px_55px_rgba(0,0,0,0.16)] px-12 pt-10 pb-12">
          <h1 className="text-[18px] font-semibold mb-8">Add a New House, Apartment</h1>

          {/* 1. Name */}
          <section className="mb-8">
            <h2 className="text-[14px] font-semibold mb-3">1. Name of the House, Apartment</h2>

            <input
              type="text"
              placeholder="Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[320px] h-10 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="City (eg: Colombo)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
              />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black bg-white"
              >
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Japan">Japan</option>
                <option value="France">France</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Dubai">Dubai</option>
                <option value="Brazil">Brazil</option>
                <option value="Thailand">Thailand</option>
                <option value="Italy">Italy</option>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </section>

          {/* 2. Highlights */}
          <section className="mb-10">
            <h2 className="text-[14px] font-semibold mb-4">
              2. Check The Needed Details You need to Show in the page
            </h2>

            <div className="space-y-4">
              {highlightDetails.map((item) => (
                <AmenityCheckbox
                  key={item.id}
                  id={item.id}
                  label={item.title}
                  icon={item.icon}
                  description={item.description}
                />
              ))}
            </div>
          </section>

          {/* 3. Message about place */}
          <section className="mb-10">
            <h2 className="text-[14px] font-semibold mb-3">
              3. Put Some Message about the Place or Information
            </h2>
            <textarea
              rows={5}
              value={placeInfo}
              onChange={(e) => setPlaceInfo(e.target.value)}
              className="w-full max-w-[520px] px-4 py-3 text-[13px] border border-[#c4c4c4] rounded-2xl outline-none resize-none focus:border-black"
            />
          </section>

          {/* 4. Amenities */}
          <section className="mb-10">
            <h2 className="text-[14px] font-semibold mb-5">
              4. What this Place offers (Check the boxes to Show the Amenities in the page)
            </h2>

            <div className="space-y-8">
              {amenityCategories.map((cat) => (
                <div key={cat.title}>
                  <h3 className="text-[13px] font-semibold mb-3">{cat.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-14 gap-y-4">
                    {cat.items.map((item) => (
                      <AmenityCheckbox key={item.id} id={item.id} label={item.label} icon={item.icon} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Meet your host */}
          <section className="mb-10">
            <h2 className="text-[14px] font-semibold mb-3">5. Meet Your host</h2>
            <p className="text-[13px] mb-2">About Yourself or business</p>
            <textarea
              rows={5}
              value={hostAbout}
              onChange={(e) => setHostAbout(e.target.value)}
              className="w-full max-w-[520px] px-4 py-3 text-[13px] border border-[#c4c4c4] rounded-2xl outline-none resize-none focus:border-black"
            />
          </section>

          {/* 6. Things to know */}
          <section className="mb-10">
            <h2 className="text-[14px] font-semibold mb-4">6. Things to Know</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
              <div>
                <h3 className="text-[13px] font-semibold mb-3">House rules</h3>
                <div className="space-y-3">
                  {houseRules.map((value, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder="Name"
                      value={value}
                      onChange={(e) => {
                        const copy = [...houseRules];
                        copy[idx] = e.target.value;
                        setHouseRules(copy);
                      }}
                      className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-semibold mb-3">Safety & property</h3>
                <div className="space-y-3">
                  {safetyRules.map((value, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder="Name"
                      value={value}
                      onChange={(e) => {
                        const copy = [...safetyRules];
                        copy[idx] = e.target.value;
                        setSafetyRules(copy);
                      }}
                      className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-semibold mb-3">Cancellation policy</h3>
                <input
                  type="text"
                  placeholder="Name"
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  className="w-[260px] h-9 px-4 text-[13px] border border-[#c4c4c4] rounded-full outline-none focus:border-black"
                />
              </div>
            </div>
          </section>

          {/* 7. Upload Images */}
          <section className="mb-8">
            <h2 className="text-[14px] font-semibold mb-4">7. Upload Images</h2>

            <div className="flex flex-wrap gap-8 mb-8">
              {/* Cover image */}
              <div
                onClick={() => coverInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onCoverDrop}
                className="
                  w-[220px] h-[130px] border border-dashed border-[#ff5a5f]
                  rounded-xl flex flex-col items-center justify-center
                  text-center text-[11px] text-[#555555]
                  cursor-pointer hover:bg-[#fff6f6] transition
                  shadow-[0_8px_22px_rgba(0,0,0,0.06)]
                "
              >
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleCoverChange(e.target.files?.[0])}
                />
                {coverImage ? (
                  <div className="relative w-full h-full flex items-center justify-center px-2 py-2">
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover"
                      className="w-full h-full object-cover rounded-[10px]"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage(null);
                      }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/70 text-white text-[11px] flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <img src={uploadIcon} alt="Upload" className="w-8 h-8 mb-2 object-contain" />
                    <span className="font-semibold mb-1">Cover image</span>
                    <span>Drag and drop or click here</span>
                    <span>to upload image</span>
                  </>
                )}
              </div>

              {/* Gallery images */}
              <div
                onClick={() => galleryInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onGalleryDrop}
                className="
                  w-[220px] h-[130px] border border-dashed border-[#ff5a5f]
                  rounded-xl flex flex-col items-center justify-center
                  text-center text-[11px] text-[#555555]
                  cursor-pointer hover:bg-[#fff6f6] transition
                  shadow-[0_8px_22px_rgba(0,0,0,0.06)]
                "
              >
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleGalleryChange(e.target.files)}
                />

                {galleryImages.length > 0 ? (
                  <div className="w-full h-full px-2 py-2 flex flex-col gap-1">
                    <div className="text-left text-[11px] font-semibold mb-1">
                      Gallery images ({galleryImages.length}/4)
                    </div>
                    <div className="grid grid-cols-4 gap-1 flex-1">
                      {galleryImages.map((file, index) => (
                        <div key={index} className="relative w-full h-full">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover rounded-[6px]"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGalleryImage(index);
                            }}
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black/70 text-white text-[9px] flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {galleryImages.length < 4 && (
                      <div className="text-left text-[10px] text-gray-600 mt-1">
                        Click or drop more images (max 4)
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <img src={uploadIcon} alt="Upload" className="w-8 h-8 mb-2 object-contain" />
                    <span className="font-semibold mb-1">Gallery images (up to 4)</span>
                    <span>Drag and drop or click here</span>
                    <span>to upload image</span>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="
                w-[180px] h-10 rounded-full bg-[#ff5a5f]
                text-white text-[13px] font-semibold
                flex items-center justify-center
                hover:bg-[#ff4046] active:bg-[#e4373d]
                transition-colors
              "
            >
              Save
            </button>
          </section>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        title="Successfully Added"
        subtitle="Your Resident"
        onClose={() => {
          setShowSuccess(false);
          navigate("/host/dashboard");
        }}
      />
    </>
  );
};

export default AddNewRoom;
