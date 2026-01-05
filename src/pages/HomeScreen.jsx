// // src/pages/HomeScreen.jsx
// import React, { useEffect, useState, useMemo } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// import heart from "../assets/heart.png";
// import placeholderImg from "../assets/home1.png"; // fallback

// const API_URL = "";


// const HomeScreen = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 👇 searchFilters are passed from Navbar via:
//   // navigate('/', { state: { searchFilters: filters } })
//   const searchFilters = location.state?.searchFilters || null;

//   const [rooms, setRooms] = useState([]);
//   const [searchRooms, setSearchRooms] = useState(null); // null = no search
//   const [loading, setLoading] = useState(true); // loading base rooms
//   const [searchLoading, setSearchLoading] = useState(false); // loading search results
//   const [error, setError] = useState("");

//   const getImageUrl = (path) => {
//     if (!path) return placeholderImg;
//     if (path.startsWith("http")) return path;
//     return `${API_URL}/${
//       path.startsWith("uploads/") ? path : `uploads/${path}`
//     }`;
//   };

//   // --------- LOAD ALL ROOMS (default home view) ---------
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

//   // --------- APPLY SEARCH FILTERS (destination + dates + guests) ---------
//   useEffect(() => {
//     // No search -> show all rooms
//     if (!searchFilters) {
//       setSearchRooms(null);
//       setSearchLoading(false);
//       return;
//     }

//     const fetchSearchResults = async () => {
//       try {
//         setSearchLoading(true);

//         const params = new URLSearchParams();

//         // From Navbar filters:
//         // destination.country  -> filters.country
//         // checkIn / checkOut   -> ISO strings
//         // totalGuests          -> number
//         if (searchFilters.country) {
//           params.append("country", searchFilters.country);
//         }
//         if (searchFilters.checkIn) {
//           params.append("checkIn", searchFilters.checkIn);
//         }
//         if (searchFilters.checkOut) {
//           params.append("checkOut", searchFilters.checkOut);
//         }
//         if (searchFilters.totalGuests) {
//           params.append(
//             "totalGuests",
//             String(searchFilters.totalGuests)
//           );
//         }

//         const res = await axios.get(
//           `${API_URL}/api/search/available-rooms?${params.toString()}`
//         );

//         setSearchRooms(res.data.rooms || []);
//       } catch (err) {
//         console.error("Error searching rooms:", err.response?.data || err);
//         // If search fails, we just show empty result for search mode
//         setSearchRooms([]);
//       } finally {
//         setSearchLoading(false);
//       }
//     };

//     fetchSearchResults();
//   }, [searchFilters]);

//   // --------- WHICH ROOMS TO DISPLAY ---------
//   const sourceRooms = searchRooms !== null ? searchRooms : rooms;

//   // group rooms by country (for the same UI)
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

//   // --------- RENDER ---------
//   if (loading || searchLoading) {
//     return (
//       <div className="px-14 mt-10 text-sm text-gray-600">
//         {loading
//           ? "Loading homes..."
//           : "Applying search filters (dates & availability)..."}
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
//           No homes match your search. Try different dates, destination or guest count.
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
import placeholderImg from "../assets/home1.png";

// ✅ If you have CRA proxy in package.json, you can keep this empty.
// ✅ Otherwise set REACT_APP_API_URL=http://localhost:5000 in .env
const API_URL = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

const HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // searchFilters passed from Navbar:
  // navigate("/", { state: { searchFilters: filters } })
  const searchFilters = location.state?.searchFilters || null;

  const [rooms, setRooms] = useState([]);
  const [searchRooms, setSearchRooms] = useState(null); // null = no search
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Always normalize image URLs safely
  const getImageUrl = (path) => {
    if (!path) return placeholderImg;
    if (typeof path !== "string") return placeholderImg;

    // already full URL
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    // normalize leading slash
    const clean = path.replace(/^\/+/, ""); // "uploads/x.png" or "x.png"

    // If backend returns "uploads/xxx" use it as-is.
    // If backend returns "xxx.png" assume it is inside uploads/
    const finalPath = clean.startsWith("uploads/") ? clean : `uploads/${clean}`;

    // If API_URL is "", this returns "/uploads/..." (works with CRA proxy/static)
    // If API_URL is "http://localhost:5000", this returns "http://localhost:5000/uploads/..."
    return API_URL ? `${API_URL}/${finalPath}` : `/${finalPath}`;
  };

  // ---------------- LOAD ALL ROOMS ----------------
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ If API_URL is "", this is "/api/rooms"
        // ✅ If API_URL set, this is "http://localhost:5000/api/rooms"
        const res = await axios.get(`${API_URL}/api/rooms`);
        setRooms(res.data?.rooms || []);
      } catch (err) {
        console.error("Error loading rooms:", err?.response?.data || err);
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

  // ---------------- APPLY SEARCH FILTERS ----------------
  useEffect(() => {
    if (!searchFilters) {
      setSearchRooms(null);
      setSearchLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setSearchLoading(true);

        const params = new URLSearchParams();

        if (searchFilters.country) params.append("country", searchFilters.country);
        if (searchFilters.checkIn) params.append("checkIn", searchFilters.checkIn);
        if (searchFilters.checkOut) params.append("checkOut", searchFilters.checkOut);
        if (searchFilters.totalGuests)
          params.append("totalGuests", String(searchFilters.totalGuests));

        const url = `${API_URL}/api/search/available-rooms?${params.toString()}`;
        const res = await axios.get(url);

        setSearchRooms(res.data?.rooms || []);
      } catch (err) {
        console.error("Error searching rooms:", err?.response?.data || err);
        setSearchRooms([]); // search mode but empty
      } finally {
        setSearchLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchFilters]);

  // ---------------- WHICH ROOMS TO DISPLAY ----------------
  const sourceRooms = searchRooms !== null ? searchRooms : rooms;

  const roomsByCountry = useMemo(() => {
    const groups = {};
    sourceRooms.forEach((room) => {
      const country = (room?.country && String(room.country).trim()) || "Other locations";
      if (!groups[country]) groups[country] = [];
      groups[country].push(room);
    });
    return groups;
  }, [sourceRooms]);

  const countryList = Object.keys(roomsByCountry);

  // ---------------- RENDER ----------------
  if (loading || searchLoading) {
    return (
      <div className="px-14 mt-10 text-sm text-gray-600">
        {loading ? "Loading homes..." : "Applying search filters (dates & availability)..."}
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
            <h2 className="text-xl font-semibold mb-5">Stays in {country}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {roomsByCountry[country].map((room) => {
                const imageUrl = getImageUrl(
                  room?.coverImage || (room?.galleryImages && room.galleryImages[0])
                );

                const rawPrice =
                  room?.pricePerNight ??
                  room?.basePricePerNight ??
                  room?.basePrice ??
                  room?.nightlyRate ??
                  80;

                const pricePerNight = Number(rawPrice) > 0 ? Number(rawPrice) : 80;

                const rating = typeof room?.rating === "number" ? room.rating : 4.84;
                const reviewCount = Number(room?.reviewCount || 0);

                return (
                  <div
                    key={room?._id}
                    className="relative cursor-pointer"
                    onClick={() => goToRoomDetails(room._id)}
                  >
                    <img
                      src={imageUrl}
                      alt={room?.title || "Room"}
                      className="rounded-xl w-full h-[150px] object-cover"
                      onError={(e) => {
                        e.currentTarget.src = placeholderImg;
                      }}
                    />

                    <img
                      src={heart}
                      alt="like"
                      className="absolute top-2 right-2 h-5 w-5"
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="mt-1 text-sm font-medium truncate">
                      {room?.headline || room?.title || "Beautiful stay"}
                    </div>

                    {(room?.city || country) && (
                      <div className="text-[11px] text-gray-500 truncate">
                        {room?.city ? `${room.city}, ` : ""}
                        {country}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      ${pricePerNight} / night{" "}
                      <span className="ml-1">
                        ⭐ {Number(rating).toFixed(2)}
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
