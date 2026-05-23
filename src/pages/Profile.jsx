// // src/pages/Profile.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { jsPDF } from "jspdf";

// import backimg from "../assets/paymentimages/backimg.png";
// import profilePlaceholder from "../assets/roomimages/host.png";
// import deleteIcon from "../assets/roomimages/delete.png";
// import downloadIcon from "../assets/paymentimages/download.png";
// import roomPlaceholder from "../assets/paymentimages/roomimg.png";
// import logo from "../assets/logo.png";

// // const API_BASE = "http://localhost:5000/api";
// const API_BASE = "";


// const CARD_W = "max-w-[640px]";
// const CARD_PAD = "px-6 py-6";

// // helper for loading logo into jsPDF
// const loadImage = (src) =>
//   new Promise((resolve, reject) => {
//     const img = new Image();
//     img.crossOrigin = "Anonymous";
//     img.onload = () => resolve(img);
//     img.onerror = reject;
//     img.src = src;
//   });

// const Profile = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // which tab to show first – default "trips"
//   const [activeTab, setActiveTab] = useState(() => {
//     const init = location.state?.initialTab;
//     return init === "about" || init === "trips" ? init : "trips";
//   });

//   // if we navigate again with different initialTab, update
//   useEffect(() => {
//     const init = location.state?.initialTab;
//     if (init === "about" || init === "trips") {
//       setActiveTab(init);
//     }
//   }, [location.state?.initialTab]);

//   // ----------- USER PROFILE -----------
//   const [user, setUser] = useState(null);
//   const [profileLoading, setProfileLoading] = useState(true);

//   const [editOpen, setEditOpen] = useState(false);
//   const [editData, setEditData] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const fileInputRef = useRef(null);

//   // host session (for "Go to Host dashboard" button)
//   const [hostSession, setHostSession] = useState(null);

//   // ----------- BOOKINGS (PAST TRIPS) ----------
//   const [trips, setTrips] = useState([]);
//   const [tripsLoading, setTripsLoading] = useState(false);

//   // ---------- load current user ----------
//   useEffect(() => {
//     const loadUser = async () => {
//       setProfileLoading(true);
//       try {
//         let loadedUser = null;

//         // 🔐 include both snake_case and camelCase token keys
//         const token =
//           localStorage.getItem("token") ||
//           localStorage.getItem("authToken") ||
//           localStorage.getItem("roostr_token") ||
//           localStorage.getItem("roostrToken");

//         if (token) {
//           try {
//             const res = await axios.get(`${API_BASE}/users/me`, {
//               headers: { Authorization: `Bearer ${token}` },
//               withCredentials: true,
//             });
//             loadedUser = res.data.user || res.data;
//           } catch (err) {
//             console.warn("Falling back to localStorage user:", err.message);
//           }
//         }

//         if (!loadedUser) {
//           // 🔐 include both roostr_user and roostrUser
//           const possibleKeys = [
//             "roostr_user",
//             "roostrUser",
//             "user",
//             "currentUser",
//           ];
//           for (const key of possibleKeys) {
//             const raw = localStorage.getItem(key);
//             if (raw) {
//               try {
//                 loadedUser = JSON.parse(raw);
//                 break;
//               } catch {
//                 // ignore parse errors
//               }
//             }
//           }
//         }

//         setUser(loadedUser || null);
//         setEditData(loadedUser || null);
//         setAvatarPreview(loadedUser?.avatar || null);
//       } finally {
//         setProfileLoading(false);
//       }
//     };

//     loadUser();
//   }, []);

//   // ---------- load host session for button ----------
//   useEffect(() => {
//     try {
//       const rawHostUser = localStorage.getItem("roostrUser");
//       const hostToken = localStorage.getItem("roostrToken");
//       if (rawHostUser && hostToken) {
//         const parsed = JSON.parse(rawHostUser);
//         setHostSession({ ...parsed, token: hostToken });
//       } else {
//         setHostSession(null);
//       }
//     } catch (err) {
//       console.warn("Failed to read host session:", err);
//       setHostSession(null);
//     }
//   }, []);

//   // ---------- load bookings (STRICTLY per current user) ----------
//   useEffect(() => {
//     const loadBookings = async () => {
//       const guestId = user && (user._id || user.id);

//       // 🚫 if no logged-in user, do NOT fetch global bookings
//       if (!guestId) {
//         setTrips([]);
//         return;
//       }

//       setTripsLoading(true);
//       try {
//         const res = await axios.get(`${API_BASE}/bookings`, {
//           params: { guestId },
//         });
//         setTrips(res.data.bookings || []);
//       } catch (err) {
//         console.error("Error loading bookings:", err);
//         setTrips([]);
//       } finally {
//         setTripsLoading(false);
//       }
//     };

//     loadBookings();
//   }, [user]);

//   // ---------- update profile handlers ----------
//   const openEdit = () => {
//     if (!user) return;
//     setEditData({
//       name: user.name || "",
//       email: user.email || "",
//       phone: user.phone || "",
//       country: user.country || "",
//     });
//     setAvatarPreview(user.avatar || null);
//     setEditOpen(true);
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setAvatarPreview(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   const saveProfile = async () => {
//     if (!editData) return;
//     try {
//       const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("authToken") ||
//         localStorage.getItem("roostr_token") ||
//         localStorage.getItem("roostrToken");

//       const payload = {
//         ...editData,
//         avatar: avatarPreview || null,
//       };

//       const persistUserLocally = (updated) => {
//         setUser(updated);
//         setEditData(updated);
//         setAvatarPreview(updated.avatar || null);
//         // 🔐 keep both keys in sync
//         localStorage.setItem("roostr_user", JSON.stringify(updated));
//         localStorage.setItem("roostrUser", JSON.stringify(updated));
//       };

//       if (token && user && (user._id || user.id)) {
//         try {
//           const res = await axios.put(
//             `${API_BASE}/users/${user._id || user.id}`,
//             payload,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//               withCredentials: true,
//             }
//           );
//           const updated = res.data.user || res.data;
//           persistUserLocally(updated);
//         } catch (err) {
//           console.warn(
//             "Failed to update user via backend, updating only localStorage:",
//             err.message
//           );
//           const updated = { ...(user || {}), ...payload };
//           persistUserLocally(updated);
//         }
//       } else {
//         const updated = { ...(user || {}), ...payload };
//         persistUserLocally(updated);
//       }

//       setEditOpen(false);
//     } catch (err) {
//       console.error("saveProfile error:", err);
//     }
//   };

//   // ---------- cancel booking ----------
//   const handleCancelBooking = async (bookingId) => {
//     const ok = window.confirm("Are you sure you want to cancel this booking?");
//     if (!ok) return;
//     try {
//       await axios.patch(`${API_BASE}/bookings/${bookingId}/cancel`);
//       setTrips((prev) =>
//         prev.map((b) =>
//           b._id === bookingId ? { ...b, status: "cancelled" } : b
//         )
//       );
//     } catch (err) {
//       console.error("Cancel booking error:", err);
//       alert("Could not cancel booking. Please try again.");
//     }
//   };

//   // ---------- download receipt (matches your slip design) ----------
//   const handleDownloadReceipt = async (booking) => {
//     try {
//       // PDF page == slip size (horizontal)
//       const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "pt",
//         format: [900, 360], // width, height
//       });

//       const pageWidth = doc.internal.pageSize.getWidth();
//       const pageHeight = doc.internal.pageSize.getHeight();

//       // Background (white card)
//       doc.setFillColor(255, 255, 255);
//       doc.rect(0, 0, pageWidth, pageHeight, "F");

//       // light border around slip
//       doc.setDrawColor(230, 230, 230);
//       doc.setLineWidth(1);
//       doc.rect(0.5, 0.5, pageWidth - 1, pageHeight - 1);

//       const margin = 54; // same vibe as your design
//       const contentWidth = pageWidth - margin * 2;
//       const bottomBandHeight = 52;
//       const topBottomY = pageHeight - bottomBandHeight;

//       // content columns
//       const col1Width = 260;
//       const col2Width = 260;
//       const col3Width = contentWidth - col1Width - col2Width;

//       const col1X = margin;
//       const col2X = margin + col1Width;
//       const col3X = margin + col1Width + col2Width;

//       const bodyBottomY = topBottomY - 16;

//       // vertical separators
//       doc.setDrawColor(220, 220, 220);
//       doc.setLineWidth(0.8);
//       doc.line(col2X, margin, col2X, bodyBottomY);
//       doc.line(col3X, margin, col3X, bodyBottomY);

//       // ---- Logo (top-left) ----  (bigger & slightly higher)
//       try {
//         const logoImg = await loadImage(logo);
//         const logoHeight = 64; // bigger
//         const ratio =
//           logoImg.width && logoImg.height ? logoImg.width / logoImg.height : 3;
//         const logoWidth = logoHeight * ratio;
//         const logoX = margin;
//         const logoY = margin - 24; // moved up a bit
//         doc.addImage(logoImg, "PNG", logoX, logoY, logoWidth, logoHeight);
//       } catch (err) {
//         console.warn("Failed to load Roostr logo for receipt:", err);
//       }

//       const labelColor = [120, 120, 120];
//       const textColor = [0, 0, 0];

//       // format date parts like "Dec 22" + "2025"
//       const formatDateParts = (value) => {
//         const d = new Date(value);
//         if (!value || Number.isNaN(d.getTime())) {
//           return { line1: "-", line2: "" };
//         }
//         return {
//           line1: d.toLocaleDateString("en-US", {
//             month: "short",
//             day: "2-digit",
//           }),
//           line2: d.getFullYear().toString(),
//         };
//       };

//       const checkInParts = formatDateParts(booking.checkIn);
//       const checkOutParts = formatDateParts(booking.checkOut);

//       const guests = booking.guests || {};
//       const adults = guests.adults ?? 1;
//       const children = guests.children ?? 0;
//       const infants = guests.infants ?? 0;
//       const pets = guests.pets ?? 0;

//       let nights = booking.totalNights;
//       if (!nights && booking.checkIn && booking.checkOut) {
//         const start = new Date(booking.checkIn);
//         const end = new Date(booking.checkOut);
//         const diff = Math.round(
//           (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
//         );
//         nights = diff || 1;
//       }
//       nights = nights || 1;

//       const totalPrice = Number(booking.totalPrice || 0);

//       // ============ LEFT COLUMN (Reservation code) ============
//       const resLabelY = margin + 90;

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...labelColor);
//       doc.text("RESERVATION CODE", col1X, resLabelY);

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(28);
//       doc.setTextColor(...textColor);
//       doc.text(String(booking.reservationCode || "—"), col1X, resLabelY + 32);

//       // ============ MIDDLE COLUMN (Check-in / Check-out) ============
//       const dateLabelX = col2X + 26;
//       const firstDateLabelY = margin + 40;

//       // CHECK IN
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...labelColor);
//       doc.text("CHECK IN", dateLabelX, firstDateLabelY);

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(20);
//       doc.setTextColor(...textColor);
//       doc.text(checkInParts.line1, dateLabelX, firstDateLabelY + 28);

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...labelColor);
//       doc.text(checkInParts.line2, dateLabelX, firstDateLabelY + 44);

//       // CHECK OUT
//       const secondDateLabelY = firstDateLabelY + 90;
//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...labelColor);
//       doc.text("CHECK OUT", dateLabelX, secondDateLabelY);

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(20);
//       doc.setTextColor(...textColor);
//       doc.text(checkOutParts.line1, dateLabelX, secondDateLabelY + 28);

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...labelColor);
//       doc.text(checkOutParts.line2, dateLabelX, secondDateLabelY + 44);

//       // ============ RIGHT COLUMN (Guests + total) ============
//       const guestsLeftX = col3X + 32;
//       const guestsRightX = guestsLeftX + 130;
//       const row1Y = margin + 40;
//       const row2Y = row1Y + 70;

//       const drawCount = (label, value, x, y) => {
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(10);
//         doc.setTextColor(...labelColor);
//         doc.text(label.toUpperCase(), x, y);

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(18);
//         doc.setTextColor(...textColor);
//         doc.text(String(value), x, y + 26);
//       };

//       drawCount("Adults", adults, guestsLeftX, row1Y);
//       drawCount("Infants", infants, guestsRightX, row1Y);
//       drawCount("Childrens", children, guestsLeftX, row2Y); // match your label
//       drawCount("Pets", pets, guestsRightX, row2Y);

//       // Total amount (right-aligned in this column)
//       const totalX = margin + contentWidth - 16;
//       const totalLabelY = row2Y + 70;

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...labelColor);
//       doc.text("TOTAL AMOUNT", totalX, totalLabelY, { align: "right" });

//       doc.setFont("helvetica", "bold");
//       doc.setFontSize(28);
//       doc.setTextColor(231, 76, 60); // Roostr-ish red
//       doc.text(`$${totalPrice.toFixed(2)}`, totalX, totalLabelY + 30, {
//         align: "right",
//       });

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(11);
//       doc.setTextColor(...labelColor);
//       doc.text(
//         `${nights} NIGHT${nights === 1 ? "" : "S"}`,
//         totalX,
//         totalLabelY + 48,
//         { align: "right" }
//       );

//       // ============ BOTTOM BAND ============
//       const bandY = topBottomY;
//       doc.setFillColor(245, 245, 245);
//       doc.rect(0, bandY, pageWidth, bottomBandHeight, "F");

//       doc.setDrawColor(225, 225, 225);
//       doc.setLineWidth(0.8);
//       doc.line(0, bandY, pageWidth, bandY);

//       const bottomTextY = bandY + bottomBandHeight / 2 + 4;
//       const bottomLabelColor = [100, 100, 100];

//       const bookingIdText = `Booking ID: #RH-${booking.reservationCode || "—"}`;
//       const generatedDate = new Date();
//       const generatedText = `Receipt Generated: ${generatedDate.toLocaleDateString(
//         "en-US",
//         { month: "long", day: "numeric", year: "numeric" }
//       )}`;
//       const helpText = "Need help? contact@roostr.com";

//       doc.setFont("helvetica", "normal");
//       doc.setFontSize(10);
//       doc.setTextColor(...bottomLabelColor);

//       doc.text(bookingIdText, margin, bottomTextY);
//       doc.text(generatedText, pageWidth / 2, bottomTextY, {
//         align: "center",
//       });
//       doc.text(helpText, pageWidth - margin, bottomTextY, {
//         align: "right",
//       });

//       doc.save(`Roostr_Receipt_${booking.reservationCode}.pdf`);
//     } catch (err) {
//       console.error("Receipt generation failed:", err);
//       alert("Could not generate receipt. Please try again.");
//     }
//   };

//   // ---------- UI helpers ----------
//   const avatarSrc = avatarPreview || profilePlaceholder;

//   const goBack = () => navigate(-1);
//   const goToHostDashboard = () => {
//     navigate("/host/dashboard");
//   };

//   const baseUserIsHost =
//     user &&
//     (String(user.role || "")
//       .toLowerCase()
//       .includes("host") ||
//       (Array.isArray(user.roles) &&
//         user.roles.some((r) => String(r).toLowerCase().includes("host"))));

//   const hostSessionIsHost =
//     hostSession && String(hostSession.role || "").toLowerCase().includes("host");

//   const isHostUser = !!(baseUserIsHost || hostSessionIsHost);

//   // ==========================================================
//   // RENDER
//   // ==========================================================
//   return (
//     <div className="min-h-screen bg-[#eef4fb]">
//       <div className="mx-auto max-w-[1160px] px-5 pt-5 pb-10">
//         {/* Header */}
//         <div className="flex items-center gap-3 mb-5">
//           <button onClick={goBack}>
//             <img src={backimg} alt="Back" className="w-5 h-5" />
//           </button>
//           <h1 className="text-[20px] font-semibold leading-none">Profile</h1>

//           {/* Host dashboard shortcut – shows if there is any host session */}
//           {isHostUser && (
//             <button
//               onClick={goToHostDashboard}
//               className="ml-6 px-4 py-2 rounded-[999px] bg-black text-white text-[13px]"
//             >
//               Go to Host dashboard
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-[200px_1fr] gap-8">
//           {/* Left rail */}
//           <aside className="border-r pr-5">
//             <nav className="flex flex-col gap-4 text-[15px]">
//               <button
//                 onClick={() => setActiveTab("about")}
//                 className={`text-left ${
//                   activeTab === "about"
//                     ? "font-semibold text-black"
//                     : "text-gray-500"
//                 }`}
//               >
//                 About me
//               </button>
//               <button
//                 onClick={() => setActiveTab("trips")}
//                 className={`text-left ${
//                   activeTab === "trips"
//                     ? "font-semibold text-black"
//                     : "text-gray-500"
//                 }`}
//               >
//                 Past Trips
//               </button>
//             </nav>
//           </aside>

//           {/* Right content */}
//           <section>
//             {/* ABOUT ME */}
//             {activeTab === "about" && (
//               <>
//                 <h2 className="text-[18px] font-semibold mb-6">About me</h2>

//                 <div
//                   className={[
//                     "bg-white rounded-[16px] shadow-[0_6px_22px_rgba(0,0,0,0.12)]",
//                     CARD_W,
//                     CARD_PAD,
//                   ].join(" ")}
//                 >
//                   {profileLoading ? (
//                     <div className="text-[14px] text-gray-500">
//                       Loading profile...
//                     </div>
//                   ) : !user ? (
//                     <div className="text-[14px] text-gray-500">
//                       No user details are available.
//                     </div>
//                   ) : (
//                     <>
//                       {/* avatar */}
//                       <div className="w-full flex justify-center mb-6">
//                         <img
//                           src={avatarSrc}
//                           alt="avatar"
//                           className="w-[72px] h-[72px] rounded-full object-cover"
//                         />
//                       </div>

//                       {/* details */}
//                       <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
//                         <div className="flex gap-4">
//                           <span className="text-gray-500 min-w-[95px] text-[12px]">
//                             Name:
//                           </span>
//                           <span className="font-medium">
//                             {user.name || "—"}
//                           </span>
//                         </div>
//                         <div className="flex gap-4">
//                           <span className="text-gray-500 min-w-[130px] text-[12px]">
//                             Contact Number :
//                           </span>
//                           <span className="font-medium truncate">
//                             {user.phone || "—"}
//                           </span>
//                         </div>

//                         <div className="flex gap-4">
//                           <span className="text-gray-500 min-w-[95px] text-[12px]">
//                             Country:
//                           </span>
//                           <span className="font-medium">
//                             {user.country || "—"}
//                           </span>
//                         </div>

//                         <div className="flex gap-4 col-span-2">
//                           <span className="text-gray-500 min-w-[95px] text-[12px]">
//                             Email:
//                           </span>
//                           <span className="font-medium truncate">
//                             {user.email || "—"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* actions */}
//                       <div className="mt-6 flex gap-3 justify-center">
//                         <button
//                           onClick={openEdit}
//                           className="px-4 py-2 rounded-md bg-black text-white text-[13px]"
//                         >
//                           Update Info
//                         </button>
//                         <button className="px-4 py-2 rounded-md bg-gray-200 text-[13px]">
//                           Delete Account
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Edit modal */}
//                 {editOpen && (
//                   <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
//                     <div className="bg-white rounded-[16px] p-6 w-full max-w-[420px]">
//                       <h3 className="text-[16px] font-semibold mb-4">
//                         Edit Profile
//                       </h3>

//                       <div className="flex justify-center mb-4">
//                         <img
//                           src={avatarPreview || profilePlaceholder}
//                           alt="avatar"
//                           className="w-[72px] h-[72px] rounded-full object-cover"
//                         />
//                       </div>

//                       <div className="flex justify-center mb-4">
//                         <button
//                           className="text-[12px] px-3 py-1 border rounded-full"
//                           onClick={() => fileInputRef.current?.click()}
//                         >
//                           Change Photo
//                         </button>
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept="image/*"
//                           className="hidden"
//                           onChange={handleAvatarChange}
//                         />
//                       </div>

//                       <div className="space-y-3 text-[13px]">
//                         <div>
//                           <label className="block text-gray-500 mb-1">
//                             Name
//                           </label>
//                           <input
//                             name="name"
//                             value={editData?.name || ""}
//                             onChange={handleEditChange}
//                             className="w-full border rounded-md px-3 py-2 text-[13px]"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-gray-500 mb-1">
//                             Email
//                           </label>
//                           <input
//                             name="email"
//                             value={editData?.email || ""}
//                             onChange={handleEditChange}
//                             className="w-full border rounded-md px-3 py-2 text-[13px]"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-gray-500 mb-1">
//                             Phone
//                           </label>
//                           <input
//                             name="phone"
//                             value={editData?.phone || ""}
//                             onChange={handleEditChange}
//                             className="w-full border rounded-md px-3 py-2 text-[13px]"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-gray-500 mb-1">
//                             Country
//                           </label>
//                           <input
//                             name="country"
//                             value={editData?.country || ""}
//                             onChange={handleEditChange}
//                             className="w-full border rounded-md px-3 py-2 text-[13px]"
//                           />
//                         </div>
//                       </div>

//                       <div className="mt-5 flex justify-end gap-3">
//                         <button
//                           onClick={() => setEditOpen(false)}
//                           className="px-4 py-2 text-[13px]"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={saveProfile}
//                           className="px-4 py-2 rounded-md bg-black text-white text-[13px]"
//                         >
//                           Save
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* PAST TRIPS */}
//             {activeTab === "trips" && (
//               <>
//                 <h2 className="text-[18px] font-semibold mb-6">Past Trips</h2>

//                 {tripsLoading ? (
//                   <div className="text-[14px] text-gray-500">
//                     Loading your bookings...
//                   </div>
//                 ) : trips.length === 0 ? (
//                   <div className="text-[14px] text-gray-500">
//                     You don&apos;t have any bookings yet.
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-start gap-5">
//                     {trips.map((t) => {
//                       const room = t.roomId || {};
//                       const checkIn = new Date(t.checkIn);
//                       const checkOut = new Date(t.checkOut);

//                       return (
//                         <div
//                           key={t._id}
//                           className={[
//                             "bg-white rounded-[16px] shadow-[0_6px_22px_rgba(0,0,0,0.12)]",
//                             CARD_W,
//                             CARD_PAD,
//                           ].join(" ")}
//                         >
//                           {/* top row */}
//                           <div className="grid grid-cols-[64px_1fr_1fr_1fr] gap-6 items-start">
//                             <img
//                               src={room.coverImage || roomPlaceholder}
//                               alt="Room"
//                               className="w-[64px] h-[64px] rounded-[10px] object-cover"
//                             />

//                             <div>
//                               <div className="text-gray-500 text-[12px] mb-0.5">
//                                 Reservation code
//                               </div>
//                               <div className="text-[16px] font-semibold tracking-tight">
//                                 {t.reservationCode}
//                               </div>
//                               <div className="text-[11px] uppercase text-gray-500 mt-1">
//                                 {t.status?.toUpperCase()}
//                               </div>
//                             </div>

//                             <div>
//                               <div className="text-gray-500 text-[12px] mb-0.5">
//                                 Check In
//                               </div>
//                               <div className="text-[13px]">
//                                 {checkIn.toLocaleDateString("en-US", {
//                                   month: "long",
//                                   day: "numeric",
//                                   year: "numeric",
//                                 })}
//                               </div>
//                             </div>

//                             <div>
//                               <div className="text-gray-500 text-[12px] mb-0.5">
//                                 Check Out
//                               </div>
//                               <div className="text-[13px]">
//                                 {checkOut.toLocaleDateString("en-US", {
//                                   month: "long",
//                                   day: "numeric",
//                                   year: "numeric",
//                                 })}
//                               </div>
//                             </div>
//                           </div>

//                           {/* counts */}
//                           <div className="grid grid-cols-4 gap-5 mt-6">
//                             {[
//                               {
//                                 label: "Adults",
//                                 value: t.guests?.adults ?? 1,
//                               },
//                               {
//                                 label: "Children",
//                                 value: t.guests?.children ?? 0,
//                               },
//                               {
//                                 label: "Infants",
//                                 value: t.guests?.infants ?? 0,
//                               },
//                               { label: "Pets", value: t.guests?.pets ?? 0 },
//                             ].map((item) => (
//                               <div key={item.label}>
//                                 <div className="text-gray-500 text-[12px] mb-1">
//                                   {item.label}
//                                 </div>
//                                 <div className="text-[18px] font-semibold">
//                                   {String(item.value).padStart(2, "0")}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>

//                           {/* host + total */}
//                           <div className="grid grid-cols-2 gap-6 mt-6 text-[13px]">
//                             <div>
//                               <div className="text-gray-500 text-[12px] mb-1">
//                                 Host Name
//                               </div>
//                               <div className="font-medium">
//                                 {room.hostName || "Roostr Host"}
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-gray-500 text-[12px] mb-1">
//                                 Host Email
//                               </div>
//                               <div className="font-medium truncate">
//                                 {room.hostEmail || "—"}
//                               </div>
//                             </div>

//                             <div>
//                               <div className="text-gray-500 text-[12px] mb-1">
//                                 Host Contact Number
//                               </div>
//                               <div className="font-medium">
//                                 {room.hostPhone || "—"}
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-gray-500 text-[12px] mb-1">
//                                 Total Payment
//                               </div>
//                               <div className="text-[14px] font-semibold">
//                                 ${Number(t.totalPrice || 0).toFixed(2)}
//                               </div>
//                             </div>
//                           </div>

//                           {/* actions */}
//                           <div className="mt-6 grid grid-cols-3 items-center">
//                             <div />
//                             <button
//                               onClick={() => handleCancelBooking(t._id)}
//                               className="justify-self-center text-[13px] flex items-center gap-2"
//                             >
//                               <img
//                                 src={deleteIcon}
//                                 className="w-[16px] h-[16px]"
//                                 alt=""
//                               />
//                               Cancel Booking
//                             </button>
//                             <button
//                               onClick={() => handleDownloadReceipt(t)}
//                               className="justify-self-end text-[13px] flex items-center gap-2"
//                             >
//                               <img
//                                 src={downloadIcon}
//                                 className="w-[16px] h-[16px]"
//                                 alt=""
//                               />
//                               Download Receipt
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </>
//             )}
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


// src/pages/Profile.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

import backimg from "../assets/paymentimages/backimg.png";
import deleteIcon from "../assets/roomimages/delete.png";
import downloadIcon from "../assets/paymentimages/download.png";
import roomPlaceholder from "../assets/paymentimages/roomimg.png";
import logo from "../assets/logo.png";

// ✅ If you use Vite proxy, keep "". If not, set "http://localhost:5000"
const API_BASE = "";


// helper for loading logo into jsPDF
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

// 🔹 Auth header helper (supports both token keys)
const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("roostr_token") ||
    localStorage.getItem("roostrToken");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

// 🔹 Build image url (same logic as HomeScreen)
const getImageUrl = (path) => {
  if (!path) return roomPlaceholder;
  if (typeof path !== "string") return roomPlaceholder;
  if (path.startsWith("http")) return path;

  // If API_BASE is "", this becomes "/uploads/..", which works if backend serves uploads on same origin via proxy
  const base = API_BASE || "";
  const clean = path.startsWith("uploads/") ? path : `uploads/${path}`;
  return `${base}/${clean}`;
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // which tab to show first – default "trips"
  const [activeTab, setActiveTab] = useState(() => {
    const init = location.state?.initialTab;
    return init === "about" || init === "trips" ? init : "trips";
  });

  useEffect(() => {
    const init = location.state?.initialTab;
    if (init === "about" || init === "trips") setActiveTab(init);
  }, [location.state?.initialTab]);

  // ----------- USER PROFILE -----------
  const [user, setUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // host session (for "Go to Host dashboard" button)
  const [hostSession, setHostSession] = useState(null);

  // ----------- BOOKINGS (PAST TRIPS) ----------
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  const renderAvatar = (sizeClass = "w-20 h-20 text-[24px]") => {
    const currentAvatar = avatarPreview || user?.avatar;
    const isPlaceholder = !currentAvatar || currentAvatar.includes("host.png");
    if (!isPlaceholder) {
      return (
        <img
          src={currentAvatar}
          alt="avatar"
          className={`${sizeClass.split(" ")[0]} ${sizeClass.split(" ")[1]} rounded-full object-cover border-4 border-white shadow-md`}
        />
      );
    }

    const firstLetter = (user?.name || "U")[0].toUpperCase();
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-tr from-[#FF5A5F] to-[#FF7A85] text-white flex items-center justify-center font-bold shadow-md border-4 border-white`}>
        {firstLetter}
      </div>
    );
  };

  // ---------- load current user ----------
  useEffect(() => {
    const loadUser = async () => {
      setProfileLoading(true);
      try {
        let loadedUser = null;

        // Try backend first (if token exists)
        const headers = getAuthHeader();
        if (headers.Authorization) {
          try {
            const res = await axios.get(`${API_BASE}/api/users/me`, {
              headers,
              withCredentials: true,
            });
            loadedUser = res.data.user || res.data;
          } catch (err) {
            console.warn("Falling back to localStorage user:", err.message);
          }
        }

        // Fallback to localStorage
        if (!loadedUser) {
          const possibleKeys = ["roostr_user", "roostrUser", "user", "currentUser"];
          for (const key of possibleKeys) {
            const raw = localStorage.getItem(key);
            if (raw) {
              try {
                loadedUser = JSON.parse(raw);
                break;
              } catch {
                // ignore parse errors
              }
            }
          }
        }

        setUser(loadedUser || null);
        setEditData(loadedUser || null);
        setAvatarPreview(loadedUser?.avatar || null);
      } finally {
        setProfileLoading(false);
      }
    };

    loadUser();
  }, []);

  // ---------- load host session for button ----------
  useEffect(() => {
    try {
      const rawHostUser = localStorage.getItem("roostrUser");
      const hostToken = localStorage.getItem("roostrToken");
      if (rawHostUser && hostToken) {
        const parsed = JSON.parse(rawHostUser);
        setHostSession({ ...parsed, token: hostToken });
      } else {
        setHostSession(null);
      }
    } catch (err) {
      console.warn("Failed to read host session:", err);
      setHostSession(null);
    }
  }, []);

  // ---------- load bookings (STRICTLY per current user) ----------
  useEffect(() => {
    const loadBookings = async () => {
      const guestId = user && (user._id || user.id);

      // 🚫 if no logged-in user, do NOT fetch global bookings
      if (!guestId) {
        setTrips([]);
        return;
      }

      setTripsLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/bookings`, {
          params: { guestId },
          headers: getAuthHeader(),
          withCredentials: true,
        });
        setTrips(res.data.bookings || []);
      } catch (err) {
        console.error("Error loading bookings:", err);
        setTrips([]);
      } finally {
        setTripsLoading(false);
      }
    };

    loadBookings();
  }, [user]);

  // ---------- update profile handlers ----------
  const openEdit = () => {
    if (!user) return;
    setEditData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      country: user.country || "",
    });
    setAvatarPreview(user.avatar || null);
    setEditOpen(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!editData) return;

    try {
      const payload = { ...editData, avatar: avatarPreview || null };

      const persistUserLocally = (updated) => {
        setUser(updated);
        setEditData(updated);
        setAvatarPreview(updated.avatar || null);
        localStorage.setItem("roostr_user", JSON.stringify(updated));
        localStorage.setItem("roostrUser", JSON.stringify(updated));
      };

      const id = user?._id || user?.id;

      if (id) {
        try {
          const res = await axios.put(`${API_BASE}/api/users/${id}`, payload, {
            headers: getAuthHeader(),
            withCredentials: true,
          });
          persistUserLocally(res.data.user || res.data);
        } catch (err) {
          console.warn("Backend update failed; saving locally only:", err.message);
          persistUserLocally({ ...(user || {}), ...payload });
        }
      } else {
        persistUserLocally({ ...(user || {}), ...payload });
      }

      setEditOpen(false);
    } catch (err) {
      console.error("saveProfile error:", err);
    }
  };

  // ---------- cancel booking ----------
  const handleCancelBooking = async (bookingId) => {
    const ok = window.confirm("Are you sure you want to cancel this booking?");
    if (!ok) return;

    try {
      await axios.patch(`${API_BASE}/api/bookings/${bookingId}/cancel`, null, {
        headers: getAuthHeader(),
        withCredentials: true,
      });

      setTrips((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert("Could not cancel booking. Please try again.");
    }
  };

  // ---------- download receipt ----------
  const handleDownloadReceipt = async (booking) => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [900, 360],
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(1);
      doc.rect(0.5, 0.5, pageWidth - 1, pageHeight - 1);

      const margin = 54;
      const contentWidth = pageWidth - margin * 2;
      const bottomBandHeight = 52;
      const topBottomY = pageHeight - bottomBandHeight;

      const col1Width = 260;
      const col2Width = 260;

      const col1X = margin;
      const col2X = margin + col1Width;
      const col3X = margin + col1Width + col2Width;

      const bodyBottomY = topBottomY - 16;

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.8);
      doc.line(col2X, margin, col2X, bodyBottomY);
      doc.line(col3X, margin, col3X, bodyBottomY);

      // Logo
      try {
        const logoImg = await loadImage(logo);
        const logoHeight = 64;
        const ratio =
          logoImg.width && logoImg.height ? logoImg.width / logoImg.height : 3;
        const logoWidth = logoHeight * ratio;
        doc.addImage(logoImg, "PNG", margin, margin - 24, logoWidth, logoHeight);
      } catch (err) {
        console.warn("Failed to load logo for receipt:", err);
      }

      const labelColor = [120, 120, 120];
      const textColor = [0, 0, 0];

      const formatDateParts = (value) => {
        const d = new Date(value);
        if (!value || Number.isNaN(d.getTime())) return { line1: "-", line2: "" };
        return {
          line1: d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
          line2: d.getFullYear().toString(),
        };
      };

      const checkInParts = formatDateParts(booking.checkIn);
      const checkOutParts = formatDateParts(booking.checkOut);

      const g = booking.guests || {};
      const adults = g.adults ?? 1;
      const children = g.children ?? 0;
      const infants = g.infants ?? 0;
      const pets = g.pets ?? 0;

      let nights = booking.totalNights;
      if (!nights && booking.checkIn && booking.checkOut) {
        const start = new Date(booking.checkIn);
        const end = new Date(booking.checkOut);
        const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
        nights = diff || 1;
      }
      nights = nights || 1;

      const totalPrice = Number(booking.totalPrice || 0);

      // Left: reservation
      const resLabelY = margin + 90;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...labelColor);
      doc.text("RESERVATION CODE", col1X, resLabelY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(...textColor);
      doc.text(String(booking.reservationCode || "—"), col1X, resLabelY + 32);

      // Middle: dates
      const dateLabelX = col2X + 26;
      const firstDateLabelY = margin + 40;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...labelColor);
      doc.text("CHECK IN", dateLabelX, firstDateLabelY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...textColor);
      doc.text(checkInParts.line1, dateLabelX, firstDateLabelY + 28);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...labelColor);
      doc.text(checkInParts.line2, dateLabelX, firstDateLabelY + 44);

      const secondDateLabelY = firstDateLabelY + 90;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...labelColor);
      doc.text("CHECK OUT", dateLabelX, secondDateLabelY);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...textColor);
      doc.text(checkOutParts.line1, dateLabelX, secondDateLabelY + 28);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...labelColor);
      doc.text(checkOutParts.line2, dateLabelX, secondDateLabelY + 44);

      // Right: guests + total
      const guestsLeftX = col3X + 32;
      const guestsRightX = guestsLeftX + 130;
      const row1Y = margin + 40;
      const row2Y = row1Y + 70;

      const drawCount = (label, value, x, y) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...labelColor);
        doc.text(label.toUpperCase(), x, y);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(...textColor);
        doc.text(String(value), x, y + 26);
      };

      drawCount("Adults", adults, guestsLeftX, row1Y);
      drawCount("Infants", infants, guestsRightX, row1Y);
      drawCount("Childrens", children, guestsLeftX, row2Y);
      drawCount("Pets", pets, guestsRightX, row2Y);

      const totalX = margin + contentWidth - 16;
      const totalLabelY = row2Y + 70;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...labelColor);
      doc.text("TOTAL AMOUNT", totalX, totalLabelY, { align: "right" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(231, 76, 60);
      doc.text(`$${totalPrice.toFixed(2)}`, totalX, totalLabelY + 30, {
        align: "right",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(...labelColor);
      doc.text(`${nights} NIGHT${nights === 1 ? "" : "S"}`, totalX, totalLabelY + 48, {
        align: "right",
      });

      // bottom band
      const bandY = topBottomY;
      doc.setFillColor(245, 245, 245);
      doc.rect(0, bandY, pageWidth, 52, "F");

      doc.setDrawColor(225, 225, 225);
      doc.setLineWidth(0.8);
      doc.line(0, bandY, pageWidth, bandY);

      const bottomTextY = bandY + 52 / 2 + 4;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);

      const code = booking.reservationCode || "—";
      doc.text(`Booking ID: #RH-${code}`, margin, bottomTextY);
      doc.text(
        `Receipt Generated: ${new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}`,
        pageWidth / 2,
        bottomTextY,
        { align: "center" }
      );
      doc.text("Need help? contact@roostr.com", pageWidth - margin, bottomTextY, {
        align: "right",
      });

      doc.save(`Roostr_Receipt_${code}.pdf`);
    } catch (err) {
      console.error("Receipt generation failed:", err);
      alert("Could not generate receipt. Please try again.");
    }
  };


  const goBack = () => navigate(-1);
  const goToHostDashboard = () => navigate("/host/dashboard");

  const baseUserIsHost =
    user &&
    (String(user.role || "").toLowerCase().includes("host") ||
      (Array.isArray(user.roles) &&
        user.roles.some((r) => String(r).toLowerCase().includes("host"))));

  const hostSessionIsHost =
    hostSession && String(hostSession.role || "").toLowerCase().includes("host");

  const isHostUser = !!(baseUserIsHost || hostSessionIsHost);

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <div className="min-h-screen bg-[#eef4fb]">
      <div className="mx-auto max-w-[1160px] px-5 pt-5 pb-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={goBack}>
            <img src={backimg} alt="Back" className="w-5 h-5" />
          </button>
          <h1 className="text-[20px] font-semibold leading-none">Profile</h1>

          {isHostUser && (
            <button
              onClick={goToHostDashboard}
              className="ml-6 px-4 py-2 rounded-[999px] bg-black text-white text-[13px]"
            >
              Go to Host dashboard
            </button>
          )}
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[200px_1fr] gap-8">
          {/* Left rail */}
          <aside className="md:border-r md:pr-5">
            <nav className="flex md:flex-col gap-4 text-[15px] border-b md:border-b-0 pb-3 md:pb-0">
              <button
                onClick={() => setActiveTab("about")}
                className={`text-left ${
                  activeTab === "about" ? "font-semibold text-black" : "text-gray-500"
                }`}
              >
                About me
              </button>
              <button
                onClick={() => setActiveTab("trips")}
                className={`text-left ${
                  activeTab === "trips" ? "font-semibold text-black" : "text-gray-500"
                }`}
              >
                Past Trips
              </button>
            </nav>
          </aside>

          {/* Right content */}
          <section>
            {/* ABOUT ME */}
            {activeTab === "about" && (
              <>
                <h2 className="text-[18px] font-semibold mb-6">About me</h2>

                <div
                  className="bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden w-full max-w-[640px]"
                >
                  {profileLoading ? (
                    <div className="p-8 text-center text-[14px] text-gray-500">
                      <div className="animate-pulse flex flex-col items-center space-y-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full" />
                        <div className="w-40 h-4 bg-gray-200 rounded" />
                        <div className="w-60 h-3 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ) : !user ? (
                    <div className="p-8 text-center text-[14px] text-gray-500">
                      No user details are available.
                    </div>
                  ) : (
                    <>
                      {/* Top Banner & Profile Intro */}
                      <div className="relative bg-gradient-to-r from-[#FF5A5F] to-[#FF7A85] h-28" />
                      <div className="px-6 pb-6 relative">
                        {/* Avatar position overlapping banner */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
                          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 text-center sm:text-left">
                            {renderAvatar("w-[96px] h-[96px] text-[32px]")}
                            <div className="mb-1">
                              <h3 className="text-xl font-bold text-gray-800">
                                {user.name}
                              </h3>
                              <p className="text-[12px] text-gray-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
                                {user.role === "host" ? "Roostr Host" : "Roostr Guest"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={openEdit}
                              className="px-4 py-2.5 text-[12px] font-bold rounded-xl bg-black text-white hover:bg-gray-800 transition duration-200 shadow-sm"
                            >
                              Edit Profile
                            </button>
                            <button 
                              className="px-4 py-2.5 text-[12px] font-semibold rounded-xl border border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50/30 transition duration-200"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>

                        {/* Profile Info Details Grid */}
                        <div className="border-t border-gray-100 pt-6">
                          <h4 className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Personal Information
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
                            {/* Email Card */}
                            <div className="bg-gray-50/50 rounded-xl p-3.5 border border-gray-100 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-[#FF5A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                                <p className="font-semibold text-gray-700 truncate mt-0.5">{user.email || "—"}</p>
                              </div>
                            </div>

                            {/* Phone Card */}
                            <div className="bg-gray-50/50 rounded-xl p-3.5 border border-gray-100 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-[#FF5A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Contact Number</p>
                                <p className="font-semibold text-gray-700 truncate mt-0.5">{user.phone || "—"}</p>
                              </div>
                            </div>

                            {/* Country Card */}
                            <div className="bg-gray-50/50 rounded-xl p-3.5 border border-gray-100 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-[#FF5A5F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5A2.5 2.5 0 0019 9.5V8a2 2 0 00-2-2h-1a2 2 0 00-2-2v-.065M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Country / Region</p>
                                <p className="font-semibold text-gray-700 truncate mt-0.5">{user.country || "—"}</p>
                              </div>
                            </div>

                            {/* Trust Card */}
                            <div className="bg-gray-50/50 rounded-xl p-3.5 border border-gray-100 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Trust & Safety</p>
                                <p className="font-semibold text-green-600 truncate mt-0.5">
                                  Verified Member
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Edit modal */}
                {editOpen && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-45 p-4">
                    <div className="bg-white rounded-[24px] p-6 w-full max-w-[440px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-[18px] font-bold text-gray-800">Edit Profile</h3>
                        <button 
                          onClick={() => setEditOpen(false)}
                          className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Image Editor */}
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative group cursor-pointer rounded-full overflow-hidden" onClick={() => fileInputRef.current?.click()}>
                          {renderAvatar("w-[96px] h-[96px] text-[32px]")}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="mt-3 text-[12px] font-semibold text-[#FF5A5F] hover:text-[#e04f53] transition"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload New Photo
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>

                      <div className="space-y-4 text-[13px]">
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">Name</label>
                          <input
                            name="name"
                            value={editData?.name || ""}
                            onChange={handleEditChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">Email</label>
                          <input
                            name="email"
                            value={editData?.email || ""}
                            onChange={handleEditChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">Phone</label>
                          <input
                            name="phone"
                            value={editData?.phone || ""}
                            onChange={handleEditChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-semibold mb-1">Country</label>
                          <input
                            name="country"
                            value={editData?.country || ""}
                            onChange={handleEditChange}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition"
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          onClick={() => setEditOpen(false)}
                          className="px-4 py-2.5 text-[13px] font-semibold text-gray-500 hover:text-gray-800 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveProfile}
                          className="px-5 py-2.5 rounded-xl bg-black text-white text-[13px] font-bold hover:bg-gray-800 transition shadow-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* PAST TRIPS */}
            {activeTab === "trips" && (
              <>
                <h2 className="text-[18px] font-semibold mb-6">Past Trips</h2>

                {tripsLoading ? (
                  <div className="text-[14px] text-gray-500">Loading your bookings...</div>
                ) : trips.length === 0 ? (
                  <div className="text-[14px] text-gray-500">You don&apos;t have any bookings yet.</div>
                ) : (
                  <div className="flex flex-col items-stretch sm:items-start gap-5 w-full">
                    {trips.map((t) => {
                      const room = t.roomId || {};
                      const checkIn = new Date(t.checkIn);
                      const checkOut = new Date(t.checkOut);

                      const tripImg = getImageUrl(
                        room.coverImage || (room.galleryImages && room.galleryImages[0])
                      );

                      return (
                        <div
                          key={t._id}
                          className="bg-white rounded-[16px] shadow-[0_6px_22px_rgba(0,0,0,0.08)] w-full max-w-[640px] px-4 py-5 sm:px-6 sm:py-6 border border-gray-100"
                        >
                          <div className="flex flex-col gap-5">
                            {/* Card Header (Image + Reservation details + Dates) */}
                            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[64px_1.2fr_1fr_1fr] sm:gap-6 items-start pb-4 border-b border-gray-100">
                              <div className="flex items-center gap-4 w-full sm:w-auto">
                                <img
                                  src={tripImg}
                                  alt="Room"
                                  className="w-[64px] h-[64px] rounded-[10px] object-cover flex-shrink-0"
                                  onError={(e) => (e.currentTarget.src = roomPlaceholder)}
                                />
                                {/* Mobile-only reservation header details */}
                                <div className="sm:hidden flex-grow">
                                  <div className="text-gray-400 text-[11px] mb-0.5">Reservation code</div>
                                  <div className="text-[15px] font-bold tracking-tight text-gray-800">
                                    {t.reservationCode}
                                  </div>
                                  <div className="inline-block text-[9px] uppercase font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-100">
                                    {t.status?.toUpperCase()}
                                  </div>
                                </div>
                              </div>

                              {/* Desktop-only reservation code info */}
                              <div className="hidden sm:block">
                                <div className="text-gray-500 text-[12px] mb-0.5">Reservation code</div>
                                <div className="text-[16px] font-semibold tracking-tight text-gray-800">
                                  {t.reservationCode}
                                </div>
                                <div className="inline-block text-[11px] uppercase font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-100">
                                  {t.status?.toUpperCase()}
                                </div>
                              </div>

                              {/* Dates: grid 2-cols on mobile, separate grid cells on desktop */}
                              <div className="grid grid-cols-2 gap-4 w-full sm:contents">
                                <div>
                                  <div className="text-gray-500 text-[12px] mb-0.5">Check In</div>
                                  <div className="text-[13px] font-semibold text-gray-800">
                                    {checkIn.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-gray-500 text-[12px] mb-0.5">Check Out</div>
                                  <div className="text-[13px] font-semibold text-gray-800">
                                    {checkOut.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Guests Segment */}
                            <div>
                              <h4 className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2">Guests</h4>
                              <div className="grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xl">
                                {[
                                  { label: "Adults", value: t.guests?.adults ?? 1 },
                                  { label: "Children", value: t.guests?.children ?? 0 },
                                  { label: "Infants", value: t.guests?.infants ?? 0 },
                                  { label: "Pets", value: t.guests?.pets ?? 0 },
                                ].map((item) => (
                                  <div key={item.label} className="text-center sm:text-left">
                                    <div className="text-gray-450 text-[11px]">{item.label}</div>
                                    <div className="text-[15px] font-bold text-gray-800">
                                      {String(item.value).padStart(2, "0")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Host details & Payment (Grid for mobile and desktop) */}
                            <div className="grid grid-cols-2 gap-4 text-[13px] pt-1">
                              <div>
                                <div className="text-gray-500 text-[11px] mb-0.5">Host Name</div>
                                <div className="font-semibold text-gray-800">{room.hostName || "Roostr Host"}</div>
                              </div>
                              <div>
                                <div className="text-gray-500 text-[11px] mb-0.5">Total Payment</div>
                                <div className="text-[15px] font-bold text-black">
                                  ${Number(t.totalPrice || 0).toFixed(2)}
                                </div>
                              </div>

                              <div className="col-span-2 sm:col-span-1">
                                <div className="text-gray-500 text-[11px] mb-0.5">Host Email</div>
                                <div className="font-medium text-gray-700 truncate">{room.hostEmail || "—"}</div>
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <div className="text-gray-500 text-[11px] mb-0.5">Host Contact Number</div>
                                <div className="font-medium text-gray-700">{room.hostPhone || "—"}</div>
                              </div>
                            </div>

                            {/* Actions footer */}
                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-row gap-3 items-center justify-between w-full">
                              <button
                                onClick={() => handleCancelBooking(t._id)}
                                className="text-[13px] flex items-center gap-2 font-medium text-red-500 hover:text-red-600 transition-colors"
                              >
                                <img src={deleteIcon} className="w-[16px] h-[16px] opacity-80" alt="" />
                                Cancel Booking
                              </button>
                              <button
                                onClick={() => handleDownloadReceipt(t)}
                                className="text-[13px] flex items-center gap-2 font-medium text-gray-700 hover:text-black transition-colors"
                              >
                                <img src={downloadIcon} className="w-[16px] h-[16px] opacity-80" alt="" />
                                Download Receipt
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
