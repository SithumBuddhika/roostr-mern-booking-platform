// // src/pages/HomeScreen.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// import heart from "../assets/heart.png";
// import placeholderImg from "../assets/home1.png"; // fallback

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const HomeScreen = () => {
//   const navigate = useNavigate();
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const getImageUrl = (path) => {
//     if (!path) return placeholderImg;
//     if (path.startsWith("http")) return path;
//     return `${API_URL}/${
//       path.startsWith("uploads/") ? path : `uploads/${path}`
//     }`;
//   };

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/rooms`);
//         setRooms(res.data.rooms || []);
//       } catch (err) {
//         console.error("Error loading rooms:", err.response?.data || err);
//         setError("Failed to load homes. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   const goToRoomDetails = (roomId) => {
//     navigate(`/room/${roomId}`);
//   };

//   // ---- group rooms by country (front-end only) ----
//   const roomsByCountry = useMemo(() => {
//     const groups = {};
//     rooms.forEach((room) => {
//       const country =
//         (room.country && room.country.trim()) ||
//         "Other locations";

//       if (!groups[country]) {
//         groups[country] = [];
//       }
//       groups[country].push(room);
//     });
//     return groups;
//   }, [rooms]);

//   const countryList = Object.keys(roomsByCountry);

//   if (loading) {
//     return (
//       <div className="px-14 mt-10 text-sm text-gray-600">
//         Loading homes...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="px-14 mt-10 text-sm text-red-600">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="px-14 mt-10">
//       {countryList.length === 0 ? (
//         <p className="text-sm text-gray-500">
//           No homes added yet. Please check back later.
//         </p>
//       ) : (
//         countryList.map((country) => (
//           <section key={country} className="mb-10">
//             <h2 className="text-xl font-semibold mb-5">
//               Stays in {country}
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
//               {roomsByCountry[country].map((room) => {
//                 const imageUrl = getImageUrl(
//                   room.coverImage ||
//                     (room.galleryImages && room.galleryImages[0])
//                 );

//                 const pricePerNight =
//                   room.pricePerNight && room.pricePerNight > 0
//                     ? room.pricePerNight
//                     : 80; // fallback if not set

//                 const rating =
//                   typeof room.rating === "number"
//                     ? room.rating
//                     : 4.84;
//                 const reviewCount = room.reviewCount || 0;

//                 return (
//                   <div
//                     key={room._id}
//                     className="relative cursor-pointer"
//                     onClick={() => goToRoomDetails(room._id)}
//                   >
//                     <img
//                       src={imageUrl}
//                       alt={room.title}
//                       className="rounded-xl w-full h-[150px] object-cover"
//                     />
//                     <img
//                       src={heart}
//                       alt="like"
//                       className="absolute top-2 right-2 h-5 w-5"
//                     />

//                     {/* title (prefer headline if present) */}
//                     <div className="mt-1 text-sm font-medium truncate">
//                       {room.headline || room.title || "Beautiful stay"}
//                     </div>

//                     {/* city + country, if available */}
//                     {(room.city || country) && (
//                       <div className="text-[11px] text-gray-500 truncate">
//                         {room.city ? `${room.city}, ` : ""}
//                         {country}
//                       </div>
//                     )}

//                     <div className="text-xs text-gray-500">
//                       ${pricePerNight} / night{" "}
//                       <span className="ml-1">
//                         ⭐ {rating.toFixed(2)}
//                         {reviewCount > 0 && ` · ${reviewCount}`}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         ))
//       )}
//     </div>
//   );
// };

// export default HomeScreen;









// // src/pages/HomeScreen.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// import heart from "../assets/heart.png";
// import placeholderImg from "../assets/home1.png"; // fallback

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const HomeScreen = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // 🔍 filters coming from Navbar → navigate('/', { state: { searchFilters } })
//   const searchFilters = location.state?.searchFilters || null;

//   const getImageUrl = (path) => {
//     if (!path) return placeholderImg;
//     if (path.startsWith("http")) return path;
//     return `${API_URL}/${
//       path.startsWith("uploads/") ? path : `uploads/${path}`
//     }`;
//   };

//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/rooms`);
//         setRooms(res.data.rooms || []);
//       } catch (err) {
//         console.error("Error loading rooms:", err.response?.data || err);
//         setError("Failed to load homes. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   const goToRoomDetails = (roomId) => {
//     navigate(`/room/${roomId}`);
//   };

//   // ---- apply filters from Navbar (country + guests) ----
//   const filteredRooms = useMemo(() => {
//     if (!searchFilters) return rooms;

//     return rooms.filter((room) => {
//       // 1) country match (if provided)
//       if (searchFilters.country) {
//         const roomCountry = (room.country || "").toString().toLowerCase();
//         const filterCountry = searchFilters.country.toString().toLowerCase();
//         if (!roomCountry || roomCountry !== filterCountry) {
//           return false;
//         }
//       }

//       // 2) guests match (only if we know capacity)
//       const totalGuests = searchFilters.totalGuests || 0;
//       if (totalGuests > 0) {
//         // try a few possible capacity fields; if none exist, don't filter by guests
//         const capacity =
//           room.maxGuests ||
//           room.guests ||
//           room.maxOccupancy ||
//           room.capacity;

//         if (capacity && Number(capacity) < totalGuests) {
//           return false;
//         }
//       }

//       // ⛔ we are NOT filtering by dates here yet (availability is separate)
//       return true;
//     });
//   }, [rooms, searchFilters]);

//   // ---- group (filtered) rooms by country (front-end only) ----
//   const roomsByCountry = useMemo(() => {
//     const groups = {};
//     filteredRooms.forEach((room) => {
//       const country =
//         (room.country && room.country.trim()) || "Other locations";

//       if (!groups[country]) {
//         groups[country] = [];
//       }
//       groups[country].push(room);
//     });
//     return groups;
//   }, [filteredRooms]);

//   const countryList = Object.keys(roomsByCountry);

//   if (loading) {
//     return (
//       <div className="px-14 mt-10 text-sm text-gray-600">
//         Loading homes...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="px-14 mt-10 text-sm text-red-600">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="px-14 mt-10">
//       {countryList.length === 0 ? (
//         <p className="text-sm text-gray-500">
//           {searchFilters
//             ? "No homes match your search. Try changing your filters."
//             : "No homes added yet. Please check back later."}
//         </p>
//       ) : (
//         countryList.map((country) => (
//           <section key={country} className="mb-10">
//             <h2 className="text-xl font-semibold mb-5">
//               Stays in {country}
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
//               {roomsByCountry[country].map((room) => {
//                 const imageUrl = getImageUrl(
//                   room.coverImage ||
//                     (room.galleryImages && room.galleryImages[0])
//                 );

//                 const pricePerNight =
//                   room.pricePerNight && room.pricePerNight > 0
//                     ? room.pricePerNight
//                     : 80; // fallback if not set

//                 const rating =
//                   typeof room.rating === "number"
//                     ? room.rating
//                     : 4.84;
//                 const reviewCount = room.reviewCount || 0;

//                 return (
//                   <div
//                     key={room._id}
//                     className="relative cursor-pointer"
//                     onClick={() => goToRoomDetails(room._id)}
//                   >
//                     <img
//                       src={imageUrl}
//                       alt={room.title}
//                       className="rounded-xl w-full h-[150px] object-cover"
//                     />
//                     <img
//                       src={heart}
//                       alt="like"
//                       className="absolute top-2 right-2 h-5 w-5"
//                     />

//                     {/* title (prefer headline if present) */}
//                     <div className="mt-1 text-sm font-medium truncate">
//                       {room.headline || room.title || "Beautiful stay"}
//                     </div>

//                     {/* city + country, if available */}
//                     {(room.city || country) && (
//                       <div className="text-[11px] text-gray-500 truncate">
//                         {room.city ? `${room.city}, ` : ""}
//                         {country}
//                       </div>
//                     )}

//                     <div className="text-xs text-gray-500">
//                       ${pricePerNight} / night{" "}
//                       <span className="ml-1">
//                         ⭐ {rating.toFixed(2)}
//                         {reviewCount > 0 && ` · ${reviewCount}`}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         ))
//       )}
//     </div>
//   );
// };

// export default HomeScreen;







// // src/pages/HomeScreen.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// import heart from "../assets/heart.png";
// import placeholderImg from "../assets/home1.png"; // fallback

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const HomeScreen = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [rooms, setRooms] = useState([]);
//   const [filteredRooms, setFilteredRooms] = useState(null); // null = no search filters applied
//   const [loading, setLoading] = useState(true);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🔎 searchFilters passed from Navbar: navigate('/', { state: { searchFilters: filters } })
//   const searchFilters = location.state?.searchFilters || null;

//   const getImageUrl = (path) => {
//     if (!path) return placeholderImg;
//     if (path.startsWith("http")) return path;
//     return `${API_URL}/${
//       path.startsWith("uploads/") ? path : `uploads/${path}`
//     }`;
//   };

//   // ----------------- LOAD ROOMS -----------------
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/rooms`);
//         setRooms(res.data.rooms || []);
//       } catch (err) {
//         console.error("Error loading rooms:", err.response?.data || err);
//         setError("Failed to load homes. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   // navigate to room details
//   const goToRoomDetails = (roomId) => {
//     navigate(`/room/${roomId}`);
//   };

//   // ----------------- APPLY SEARCH FILTERS (destination + dates) -----------------
//   useEffect(() => {
//     // ❌ No search -> show all rooms
//     if (!searchFilters) {
//       setFilteredRooms(null);
//       setSearchLoading(false);
//       return;
//     }

//     // Wait until rooms are loaded
//     if (!rooms || rooms.length === 0) {
//       setFilteredRooms([]);
//       return;
//     }

//     const { country, totalGuests, checkIn, checkOut } = searchFilters;

//     // 1) Base filter: by destination (country) + guest count (if capacity is defined)
//     let result = [...rooms];

//     if (country) {
//       const targetCountry = country.trim().toLowerCase();
//       result = result.filter((room) => {
//         const roomCountry = (room.country || "").trim().toLowerCase();
//         return roomCountry === targetCountry;
//       });
//     }

//     if (totalGuests && Number(totalGuests) > 0 && result.length > 0) {
//       result = result.filter((room) => {
//         const maxGuests = room.maxGuests || room.capacity || null;
//         if (!maxGuests) return true; // if no capacity set, don't block
//         return Number(maxGuests) >= Number(totalGuests);
//       });
//     }

//     // 2) If no dates selected, just use destination/guest filter
//     if (!checkIn || !checkOut) {
//       setFilteredRooms(result);
//       setSearchLoading(false);
//       return;
//     }

//     const checkInDate = new Date(checkIn);
//     const checkOutDate = new Date(checkOut);

//     if (
//       Number.isNaN(checkInDate.getTime()) ||
//       Number.isNaN(checkOutDate.getTime())
//     ) {
//       setFilteredRooms(result);
//       setSearchLoading(false);
//       return;
//     }

//     // helper: check if two date ranges overlap: [start, end)
//     const rangesOverlap = (startA, endA, startB, endB) =>
//       startA < endB && endA > startB;

//     // 3) Filter by availability using existing /api/bookings/room/:roomId
//     const filterByAvailability = async () => {
//       setSearchLoading(true);
//       try {
//         const availableRooms = [];

//         for (const room of result) {
//           try {
//             const res = await axios.get(
//               `${API_URL}/api/bookings/room/${room._id}`
//             );
//             const bookings = res.data.bookings || [];

//             // /api/bookings/room already skips cancelled ones in your backend
//             const hasConflict = bookings.some((b) => {
//               const bIn = new Date(b.checkIn);
//               const bOut = new Date(b.checkOut);
//               if (
//                 Number.isNaN(bIn.getTime()) ||
//                 Number.isNaN(bOut.getTime())
//               ) {
//                 return false;
//               }
//               return rangesOverlap(checkInDate, checkOutDate, bIn, bOut);
//             });

//             if (!hasConflict) {
//               availableRooms.push(room);
//             }
//           } catch (err) {
//             console.error(
//               "Error checking availability for room",
//               room._id,
//               err
//             );
//             // if booking lookup fails, we keep the room (don't hide everything by mistake)
//             availableRooms.push(room);
//           }
//         }

//         setFilteredRooms(availableRooms);
//       } finally {
//         setSearchLoading(false);
//       }
//     };

//     filterByAvailability();
//   }, [rooms, searchFilters]);

//   // ----------------- WHICH ROOMS TO RENDER -----------------
//   const sourceRooms = filteredRooms !== null ? filteredRooms : rooms;

//   // ---- group rooms by country (front-end only) ----
//   const roomsByCountry = useMemo(() => {
//     const groups = {};
//     sourceRooms.forEach((room) => {
//       const country =
//         (room.country && room.country.trim()) || "Other locations";

//       if (!groups[country]) {
//         groups[country] = [];
//       }
//       groups[country].push(room);
//     });
//     return groups;
//   }, [sourceRooms]);

//   const countryList = Object.keys(roomsByCountry);

//   // ----------------- RENDER -----------------
//   if (loading || searchLoading) {
//     return (
//       <div className="px-14 mt-10 text-sm text-gray-600">
//         {loading ? "Loading homes..." : "Applying date filters..."}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="px-14 mt-10 text-sm text-red-600">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="px-14 mt-10">
//       {countryList.length === 0 ? (
//         <p className="text-sm text-gray-500">
//           No homes match your search. Try different dates or destination.
//         </p>
//       ) : (
//         countryList.map((country) => (
//           <section key={country} className="mb-10">
//             <h2 className="text-xl font-semibold mb-5">
//               Stays in {country}
//             </h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
//               {roomsByCountry[country].map((room) => {
//                 const imageUrl = getImageUrl(
//                   room.coverImage ||
//                     (room.galleryImages && room.galleryImages[0])
//                 );

//                 const pricePerNight =
//                   room.pricePerNight && room.pricePerNight > 0
//                     ? room.pricePerNight
//                     : 80; // fallback if not set

//                 const rating =
//                   typeof room.rating === "number" ? room.rating : 4.84;
//                 const reviewCount = room.reviewCount || 0;

//                 return (
//                   <div
//                     key={room._id}
//                     className="relative cursor-pointer"
//                     onClick={() => goToRoomDetails(room._id)}
//                   >
//                     <img
//                       src={imageUrl}
//                       alt={room.title}
//                       className="rounded-xl w-full h-[150px] object-cover"
//                     />
//                     <img
//                       src={heart}
//                       alt="like"
//                       className="absolute top-2 right-2 h-5 w-5"
//                     />

//                     {/* title (prefer headline if present) */}
//                     <div className="mt-1 text-sm font-medium truncate">
//                       {room.headline || room.title || "Beautiful stay"}
//                     </div>

//                     {/* city + country, if available */}
//                     {(room.city || country) && (
//                       <div className="text-[11px] text-gray-500 truncate">
//                         {room.city ? `${room.city}, ` : ""}
//                         {country}
//                       </div>
//                     )}

//                     <div className="text-xs text-gray-500">
//                       ${pricePerNight} / night{" "}
//                       <span className="ml-1">
//                         ⭐ {rating.toFixed(2)}
//                         {reviewCount > 0 && ` · ${reviewCount}`}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         ))
//       )}
//     </div>
//   );
// };

// export default HomeScreen;





// src/pages/HomeScreen.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import heart from "../assets/heart.png";
import placeholderImg from "../assets/home1.png"; // fallback

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 👇 searchFilters are passed from Navbar via:
  // navigate('/', { state: { searchFilters: filters } })
  const searchFilters = location.state?.searchFilters || null;

  const [rooms, setRooms] = useState([]);
  const [searchRooms, setSearchRooms] = useState(null); // null = no search
  const [loading, setLoading] = useState(true); // loading base rooms
  const [searchLoading, setSearchLoading] = useState(false); // loading search results
  const [error, setError] = useState("");

  const getImageUrl = (path) => {
    if (!path) return placeholderImg;
    if (path.startsWith("http")) return path;
    return `${API_URL}/${
      path.startsWith("uploads/") ? path : `uploads/${path}`
    }`;
  };

  // --------- LOAD ALL ROOMS (default home view) ---------
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/rooms`);
        setRooms(res.data.rooms || []);
      } catch (err) {
        console.error("Error loading rooms:", err.response?.data || err);
        setError("Failed to load homes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const goToRoomDetails = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  // --------- APPLY SEARCH FILTERS (destination + dates + guests) ---------
  useEffect(() => {
    // No search -> show all rooms
    if (!searchFilters) {
      setSearchRooms(null);
      setSearchLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setSearchLoading(true);

        const params = new URLSearchParams();

        // From Navbar filters:
        // destination.country  -> filters.country
        // checkIn / checkOut   -> ISO strings
        // totalGuests          -> number
        if (searchFilters.country) {
          params.append("country", searchFilters.country);
        }
        if (searchFilters.checkIn) {
          params.append("checkIn", searchFilters.checkIn);
        }
        if (searchFilters.checkOut) {
          params.append("checkOut", searchFilters.checkOut);
        }
        if (searchFilters.totalGuests) {
          params.append(
            "totalGuests",
            String(searchFilters.totalGuests)
          );
        }

        const res = await axios.get(
          `${API_URL}/api/search/available-rooms?${params.toString()}`
        );

        setSearchRooms(res.data.rooms || []);
      } catch (err) {
        console.error("Error searching rooms:", err.response?.data || err);
        // If search fails, we just show empty result for search mode
        setSearchRooms([]);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchFilters]);

  // --------- WHICH ROOMS TO DISPLAY ---------
  const sourceRooms = searchRooms !== null ? searchRooms : rooms;

  // group rooms by country (for the same UI)
  const roomsByCountry = useMemo(() => {
    const groups = {};
    sourceRooms.forEach((room) => {
      const country =
        (room.country && room.country.trim()) || "Other locations";

      if (!groups[country]) {
        groups[country] = [];
      }
      groups[country].push(room);
    });
    return groups;
  }, [sourceRooms]);

  const countryList = Object.keys(roomsByCountry);

  // --------- RENDER ---------
  if (loading || searchLoading) {
    return (
      <div className="px-14 mt-10 text-sm text-gray-600">
        {loading
          ? "Loading homes..."
          : "Applying search filters (dates & availability)..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-14 mt-10 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="px-14 mt-10">
      {countryList.length === 0 ? (
        <p className="text-sm text-gray-500">
          No homes match your search. Try different dates, destination or guest count.
        </p>
      ) : (
        countryList.map((country) => (
          <section key={country} className="mb-10">
            <h2 className="text-xl font-semibold mb-5">
              Stays in {country}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {roomsByCountry[country].map((room) => {
                const imageUrl = getImageUrl(
                  room.coverImage ||
                    (room.galleryImages && room.galleryImages[0])
                );

                const pricePerNight =
                  room.pricePerNight && room.pricePerNight > 0
                    ? room.pricePerNight
                    : 80; // fallback if not set

                const rating =
                  typeof room.rating === "number" ? room.rating : 4.84;
                const reviewCount = room.reviewCount || 0;

                return (
                  <div
                    key={room._id}
                    className="relative cursor-pointer"
                    onClick={() => goToRoomDetails(room._id)}
                  >
                    <img
                      src={imageUrl}
                      alt={room.title}
                      className="rounded-xl w-full h-[150px] object-cover"
                    />
                    <img
                      src={heart}
                      alt="like"
                      className="absolute top-2 right-2 h-5 w-5"
                    />

                    {/* title (prefer headline if present) */}
                    <div className="mt-1 text-sm font-medium truncate">
                      {room.headline || room.title || "Beautiful stay"}
                    </div>

                    {/* city + country, if available */}
                    {(room.city || country) && (
                      <div className="text-[11px] text-gray-500 truncate">
                        {room.city ? `${room.city}, ` : ""}
                        {country}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      ${pricePerNight} / night{" "}
                      <span className="ml-1">
                        ⭐ {rating.toFixed(2)}
                        {reviewCount > 0 && ` · ${reviewCount}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default HomeScreen;

