// src/pages/HostDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import profileImg from "../assets/roomimages/host.png";
import closeIcon from "../assets/roomimages/close.png";

const API_URL = "";


// ---------- small helpers ----------
const formatMoney = (v) => `$ ${Number(v || 0).toFixed(0)}`;
const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// given Date -> "YYYY-MM-DD"
const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

// expand booking range into individual dates
const expandBookingToDates = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const days = [];
  let cur = new Date(start);

  while (cur <= end) {
    days.push(dateKey(cur));
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
  }
  return days;
};

// ---------- ManageListingModal ----------
const ManageListingModal = ({ room, onClose, token, onRoomUpdated }) => {
  // lock body scroll while modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // tabs
  const [activeTab, setActiveTab] = useState("pricing"); // pricing first as you asked

  // pricing state
  const [basePrice, setBasePrice] = useState(
    room?.pricePerNight != null ? room.pricePerNight : ""
  );
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceMessage, setPriceMessage] = useState("");

  // basics state  ✅ read from correct fields in Mongo
  const [headline, setHeadline] = useState(room?.headline || "");
  const [roomTypeLabel, setRoomTypeLabel] = useState(room?.roomTypeLabel || "");
  const [guests, setGuests] = useState(
    room?.maxGuests != null ? room.maxGuests : 1
  );
  const [beds, setBeds] = useState(room?.beds != null ? room.beds : 1);
  const [baths, setBaths] = useState(room?.baths != null ? room.baths : 1);
  const [savingBasics, setSavingBasics] = useState(false);
  const [basicsMessage, setBasicsMessage] = useState("");

  // if selectedRoom changes while modal open, sync state
  useEffect(() => {
    if (!room) return;
    setBasePrice(room.pricePerNight != null ? room.pricePerNight : "");
    setHeadline(room.headline || "");
    setRoomTypeLabel(room.roomTypeLabel || "");
    setGuests(room.maxGuests != null ? room.maxGuests : 1);
    setBeds(room.beds != null ? room.beds : 1);
    setBaths(room.baths != null ? room.baths : 1);
  }, [room]);

  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [bookedDateSet, setBookedDateSet] = useState(() => new Set());
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  // ---- load bookings for this room (for availability calendar) ----
  useEffect(() => {
    if (!room?._id || !token) return;

    const fetchBookings = async () => {
      try {
        setLoadingCalendar(true);
        const res = await axios.get(
          `${API_URL}/api/bookings/room/${room._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bookings = res.data.bookings || [];
        const allDates = [];
        bookings.forEach((b) => {
          allDates.push(...expandBookingToDates(b.checkIn, b.checkOut));
        });

        setBookedDateSet(new Set(allDates));
      } catch (err) {
        console.error("Error loading room bookings:", err.response?.data || err);
      } finally {
        setLoadingCalendar(false);
      }
    };

    fetchBookings();
  }, [room?._id, token]);

  // ---- calendar grid for currentMonth ----
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay(); // 0=Sun

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    // empty cells before 1st
    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ key: `empty-${i}`, label: "", date: null, booked: false });
    }

    // actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const key = dateKey(dateObj);
      cells.push({
        key,
        label: d,
        date: dateObj,
        booked: bookedDateSet.has(key),
      });
    }

    return cells;
  }, [currentMonth, bookedDateSet]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      return new Date(d.getFullYear(), d.getMonth() - 1, 1);
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      return new Date(d.getFullYear(), d.getMonth() + 1, 1);
    });
  };

  // ---------- save price ----------
  const handleSavePrice = async () => {
    try {
      setSavingPrice(true);
      setPriceMessage("");

      const numericPrice = Number(basePrice);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        setPriceMessage("Enter a valid non-negative number.");
        setSavingPrice(false);
        return;
      }

      const res = await axios.patch(
        `${API_URL}/api/rooms/${room._id}/pricing`,
        { pricePerNight: numericPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedRoom = res.data.room;
      if (onRoomUpdated && updatedRoom) {
        onRoomUpdated(updatedRoom);
      }

      setPriceMessage("Saved to backend ✔");
    } catch (err) {
      console.error("Error saving price:", err.response?.data || err);
      setPriceMessage(
        err.response?.data?.message || "Failed to save price. Try again."
      );
    } finally {
      setSavingPrice(false);
      setTimeout(() => setPriceMessage(""), 4000);
    }
  };

  // ---------- save basics ----------
  const handleSaveBasics = async () => {
    try {
      setSavingBasics(true);
      setBasicsMessage("");

      const payload = {
        headline,
        roomTypeLabel,
        // ✅ backend expects maxGuests, not "guests"
        maxGuests: Number(guests) || 1,
        beds: Number(beds) || 1,
        baths: Number(baths) || 1,
      };

      const res = await axios.patch(
        `${API_URL}/api/rooms/${room._id}/basics`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedRoom = res.data.room;
      if (onRoomUpdated && updatedRoom) {
        onRoomUpdated(updatedRoom);
      }

      setBasicsMessage("Saved basics ✔");
    } catch (err) {
      console.error("Error saving basics:", err.response?.data || err);
      setBasicsMessage(
        err.response?.data?.message || "Failed to save basics. Try again."
      );
    } finally {
      setSavingBasics(false);
      setTimeout(() => setBasicsMessage(""), 4000);
    }
  };

  if (!room) return null;

  const monthName = monthLabels[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-[980px] px-8 py-7 relative max-h-[90vh] overflow-y-auto">
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-6 h-6 flex items-center justify-center"
        >
          <img
            src={closeIcon}
            alt="Close"
            className="w-full h-full object-contain"
          />
        </button>

        <h2 className="text-[20px] font-semibold mb-1">
          Manage listing – {room.title}
        </h2>
        <p className="text-[12px] text-gray-500 mb-5">
          Adjust room basics, change price, and review a simple availability
          calendar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-8">
          {/* LEFT COLUMN – Listing overview + tabs + content */}
          <div className="space-y-6">
            {/* listing overview */}
            <div className="border border-[#eceff4] rounded-2xl px-6 py-5">
              <p className="text-[12px] font-semibold text-gray-600 mb-1">
                Listing overview
              </p>
              <p className="text-[15px] font-semibold mb-3 truncate">
                {room.title}
              </p>

              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-gray-500">Bookings</span>
                <span className="font-semibold">–</span>
              </div>

              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-gray-500">Est. revenue</span>
                <span className="font-semibold">
                  {formatMoney(room.pricePerNight || 0)}
                </span>
              </div>

              <div className="flex justify-between text-[12px] mb-1">
                <span className="text-gray-500">Occupancy</span>
                <span className="font-semibold">–</span>
              </div>

              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Rating</span>
                <span className="font-semibold">
                  {room.rating?.toFixed(1) || "5.0"} ★
                </span>
              </div>
            </div>

            {/* TABS */}
            <div className="border border-[#eceff4] rounded-2xl">
              {/* tab header */}
              <div className="flex bg-[#f5f7fb] rounded-t-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab("basics")}
                  className={`flex-1 py-2 text-[13px] ${
                    activeTab === "basics"
                      ? "bg-white font-semibold shadow-inner"
                      : "text-gray-500"
                  }`}
                >
                  Room basics
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("pricing")}
                  className={`flex-1 py-2 text-[13px] ${
                    activeTab === "pricing"
                      ? "bg-white font-semibold shadow-inner"
                      : "text-gray-500"
                  }`}
                >
                  Price management
                </button>
              </div>

              {/* tab content */}
              <div className="px-6 py-5">
                {activeTab === "basics" && (
                  <div className="space-y-4 text-[13px]">
                    <p className="font-semibold text-[13px] mb-1">Room basics</p>

                    <div>
                      <p className="text-[11px] text-gray-500 mb-1">
                        Headline (shown under photos)
                      </p>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full h-9 border border-[#d3d9e3] rounded-full px-3 text-[13px] outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <p className="text-[11px] text-gray-500 mb-1">
                        Room type label
                      </p>
                      <input
                        type="text"
                        value={roomTypeLabel}
                        onChange={(e) => setRoomTypeLabel(e.target.value)}
                        placeholder="Studio, Apartment, Private room…"
                        className="w-full h-9 border border-[#d3d9e3] rounded-full px-3 text-[13px] outline-none focus:border-black"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-[11px] text-gray-500 mb-1">Guests</p>
                        <input
                          type="number"
                          min="1"
                          value={guests}
                          onChange={(e) => setGuests(e.target.value)}
                          className="w-full h-9 border border-[#d3d9e3] rounded-full px-3 text-[13px] outline-none focus:border-black"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-gray-500 mb-1">Beds</p>
                        <input
                          type="number"
                          min="1"
                          value={beds}
                          onChange={(e) => setBeds(e.target.value)}
                          className="w-full h-9 border border-[#d3d9e3] rounded-full px-3 text-[13px] outline-none focus:border-black"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-gray-500 mb-1">Baths</p>
                        <input
                          type="number"
                          min="1"
                          value={baths}
                          onChange={(e) => setBaths(e.target.value)}
                          className="w-full h-9 border border-[#d3d9e3] rounded-full px-3 text-[13px] outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveBasics}
                      disabled={savingBasics}
                      className="mt-2 w-full h-9 rounded-full bg-black text-white text-[12px] font-medium hover:bg-gray-900 disabled:opacity-60"
                    >
                      {savingBasics ? "Saving..." : "Save basics"}
                    </button>

                    {basicsMessage && (
                      <p
                        className={`text-[11px] mt-2 ${
                          basicsMessage.toLowerCase().includes("fail")
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {basicsMessage}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="text-[13px]">
                    <p className="text-[12px] font-semibold text-gray-600 mb-3">
                      Price management
                    </p>
                    <p className="text-[11px] text-gray-500 mb-1">
                      Base price per night (USD)
                    </p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[13px] text-gray-600">$</span>
                      <input
                        type="number"
                        min="0"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="flex-1 h-9 border border-[#d3d9e3] rounded-full px-3 text-[13px] outline-none focus:border-black"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSavePrice}
                      disabled={savingPrice}
                      className="mt-1 w-full h-9 rounded-full bg-black text-white text-[12px] font-medium hover:bg-gray-900 disabled:opacity-60"
                    >
                      {savingPrice ? "Saving..." : "Save price"}
                    </button>

                    <p className="text-[11px] text-gray-500 mt-2">
                      Once saved, this value is stored in the backend and can be
                      used for future bookings.
                    </p>
                    {priceMessage && (
                      <p
                        className={`text-[11px] mt-2 ${
                          priceMessage.toLowerCase().includes("fail")
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {priceMessage}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Availability calendar */}
          <div className="border border-[#eceff4] rounded-2xl px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-semibold text-gray-600">
                Availability calendar
              </p>
              <div className="flex items-center gap-3 text-[12px]">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="w-6 h-6 rounded-full border border-[#d3d9e3] flex items-center justify-center"
                >
                  ‹
                </button>
                <span className="font-medium">
                  {monthName} {year}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-6 h-6 rounded-full border border-[#d3d9e3] flex items-center justify-center"
                >
                  ›
                </button>
              </div>
            </div>

            {/* weekdays header */}
            <div className="grid grid-cols-7 text-center text-[11px] text-gray-400 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* days grid */}
            <div className="grid grid-cols-7 gap-[6px] text-[12px]">
              {calendarDays.map((cell) => {
                if (!cell.date) {
                  return <div key={cell.key} />;
                }

                const classes = [
                  "h-9 rounded-lg flex items-center justify-center border text-center select-none",
                  cell.booked
                    ? "bg-[#ffe3e3] border-[#ff8a8a] text-[#cc3a3a] font-medium"
                    : "bg-[#f7f9fc] border-[#e3e8f0] text-gray-700",
                ].join(" ");

                return (
                  <div key={cell.key} className={classes}>
                    {cell.label}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-500">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-[4px] bg-[#ffe3e3] border border-[#ff8a8a]" />
                <span>Booked / blocked</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-[4px] bg-[#f7f9fc] border border-[#e3e8f0]" />
                <span>Available</span>
              </div>
              {loadingCalendar && <span>Loading calendar…</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- MAIN HOST DASHBOARD ----------
const HostDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hostError, setHostError] = useState("");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [manageOpen, setManageOpen] = useState(false);

  // dashboard numbers (wired to real bookings)
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));

  const token = useMemo(() => localStorage.getItem("roostrToken"), []);

  useEffect(() => {
    const storedUser = localStorage.getItem("roostrUser");
    const tokenLocal = localStorage.getItem("roostrToken");

    if (!storedUser || !tokenLocal) {
      setHostError("You are not logged in as a host. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);

      if (!parsed || parsed.role !== "host") {
        setHostError("You are not a host. Please become a host first.");
        setLoading(false);
        return;
      }

      setUser(parsed);

      const hostId = parsed.id || parsed._id;

      const fetchRooms = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/rooms/host/${hostId}`, {
            headers: {
              "x-auth-token": tokenLocal, // backward compat
              Authorization: `Bearer ${tokenLocal}`,
            },
          });
          setRooms(res.data.rooms || []);
        } catch (err) {
          console.error(
            "Error fetching host rooms:",
            err.response?.data || err
          );
          setHostError(
            err.response?.data?.message ||
              "Failed to load your rooms. Please try again."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchRooms();
    } catch (e) {
      console.error("Failed to parse roostrUser:", e);
      setHostError("Invalid user session. Please login again.");
      setLoading(false);
    }
  }, []);

  // ---- aggregate bookings for all rooms to power stats + chart ----
  useEffect(() => {
    if (!rooms.length || !token) return;

    const fetchBookingsForRooms = async () => {
      try {
        const requests = rooms.map((room) =>
          axios.get(`${API_URL}/api/bookings/room/${room._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-auth-token": token,
            },
          })
        );

        const results = await Promise.allSettled(requests);

        let allBookings = [];
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            const list = result.value.data.bookings || [];
            allBookings = allBookings.concat(list);
          }
        });

        let bookingCount = 0;
        let earnings = 0;
        const monthly = Array(12).fill(0);

        allBookings.forEach((b) => {
          bookingCount += 1;

          const amountRaw =
            b.totalPrice ?? b.amount ?? b.price ?? b.total ?? 0;
          const amount = Number(amountRaw) || 0;
          earnings += amount;

          const dateStr = b.checkIn || b.createdAt || b.bookingDate;
          if (dateStr) {
            const d = new Date(dateStr);
            if (!Number.isNaN(d.getTime())) {
              const m = d.getMonth();
              monthly[m] += amount;
            }
          }
        });

        setTotalBookings(bookingCount);
        setTotalEarnings(earnings);
        setMonthlyRevenue(monthly);

        // reviews / reports can be wired later
        setTotalReviews(0);
        setTotalReports(0);
      } catch (err) {
        console.error("Error loading bookings for dashboard:", err);
      }
    };

    fetchBookingsForRooms();
  }, [rooms, token]);

  const handleAddNewHouse = () => {
    navigate("/host/AddNewRoom");
  };

  const handleOpenManage = (room) => {
    setSelectedRoom(room);
    setManageOpen(true);
  };

  const handleRoomUpdated = (updatedRoom) => {
    setRooms((prev) =>
      prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r))
    );
    setSelectedRoom(updatedRoom);
  };

  // derive bar data: last 6 months from today
  const now = new Date();
  const lastSixMonths = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = monthLabels[d.getMonth()];
    const value = monthlyRevenue[d.getMonth()] || 0;
    lastSixMonths.push({ label, value });
  }
  const maxRevenue = Math.max(...lastSixMonths.map((m) => m.value), 0);

  const barHeights = lastSixMonths.map((m) => {
    if (!maxRevenue || m.value <= 0) return 10; // tiny bar if no data
    // between 30% and 90% for visibility
    return 30 + (m.value / maxRevenue) * 60;
  });

  const avgNightlyRate =
    totalBookings > 0 ? totalEarnings / totalBookings : 0;

  return (
    <div className="bg-[#f0f4fa] min-h-screen px-4 md:px-12 pt-8 pb-16">
      <div className="bg-white rounded-[20px] shadow-xl p-6 md:p-10">
        {/* TOP SECTION: PROFILE + STATS */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* LEFT: PROFILE CARD */}
          <div className="w-full max-w-[260px] flex-shrink-0">
            <div className="bg-white rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.2)] p-5 text-center">
              <img
                src={profileImg}
                alt="Host Profile"
                className="w-[80px] h-[80px] rounded-full object-cover mx-auto mb-3"
              />
              <p className="font-semibold text-[16px]">
                {user?.name || "Your name"}
              </p>
              <p className="text-[14px] text-gray-500 mb-3">Superhost</p>
              <button className="px-4 py-[6px] bg-black text-white text-[13px] rounded-md w-full">
                Update Info
              </button>
            </div>
          </div>

          {/* RIGHT: STATS CARDS */}
          <div className="flex-1">
            <p className="text-[20px] font-semibold mb-6">
              Welcome Back, Host !!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] px-6 py-6 text-center">
                <p className="text-[18px] font-semibold">
                  {formatMoney(totalEarnings)}
                </p>
                <p className="text-[14px] text-gray-500">Earnings</p>
              </div>
              <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] px-6 py-6 text-center">
                <p className="text-[18px] font-semibold">
                  {totalBookings || 0}
                </p>
                <p className="text-[14px] text-gray-500">Bookings</p>
              </div>
              <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] px-6 py-6 text-center">
                <p className="text-[18px] font-semibold">
                  {totalReviews || 0}
                </p>
                <p className="text-[14px] text-gray-500">Reviews</p>
              </div>
              <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] px-6 py-6 text-center">
                <p className="text-[18px] font-semibold">
                  {totalReports || 0}
                </p>
                <p className="text-[14px] text-gray-500">Reports / Messages</p>
              </div>
            </div>
          </div>
        </div>

        {/* BUSINESS PERFORMANCE + GUEST COMMUNICATION */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8">
          {/* Business performance card – bars */}
          <div className="flex-1 bg-white rounded-[18px] shadow-[0_8px_25px_rgba(0,0,0,0.08)] px-8 py-7">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[12px] font-semibold text-gray-600">
                  BUSINESS PERFORMANCE
                </p>
                <p className="text-[26px] font-semibold mt-1">
                  {formatMoney(totalEarnings)}
                </p>
                <p className="text-[11px] text-gray-500">
                  Total revenue across all listings
                </p>
              </div>
              <div className="text-right text-[11px] text-gray-500">
                <p className="font-semibold text-gray-800 text-[12px]">
                  Active properties
                </p>
                <p className="text-[18px] font-semibold text-gray-800">
                  {rooms.length}
                </p>
                <p>
                  {totalBookings || 0} booking
                  {totalBookings === 1 ? "" : "s"} this period
                </p>
              </div>
            </div>

            {/* little metrics row */}
            <div className="grid grid-cols-3 gap-6 mb-6 text-[11px] text-gray-600">
              <div>
                <p className="font-semibold text-[12px]">Occupancy rate</p>
                <p className="text-[16px] font-semibold text-gray-900">
                  64.0%
                </p>
                <p className="text-green-600">+5.2% vs last month</p>
              </div>
              <div>
                <p className="font-semibold text-[12px]">Avg. nightly rate</p>
                <p className="text-[16px] font-semibold text-gray-900">
                  {formatMoney(avgNightlyRate)}
                </p>
                <p>Based on confirmed bookings</p>
              </div>
              <div>
                <p className="font-semibold text-[12px]">
                  Booking conversion rate
                </p>
                <p className="text-[16px] font-semibold text-gray-900">
                  72%
                </p>
                <p>Views → requests → confirmed</p>
              </div>
            </div>

            {/* bars – driven by monthlyRevenue */}
            <div className="flex items-end gap-4 h-[110px]">
              {lastSixMonths.map((month, idx) => (
                <div
                  key={month.label + idx}
                  className="flex-1 flex flex-col items-center"
                >
                  <div className="w-full h-[90px] bg-[#eef3ff] rounded-[12px] flex items-end justify-center">
                    <div
                      className="w-[80%] rounded-[10px] bg-[#1ecc61]"
                      style={{ height: `${barHeights[idx]}%` }}
                    />
                  </div>
                  <span className="mt-1 text-[11px] text-gray-500">
                    {month.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guest communication card – line chart style */}
          <div className="w-full xl:w-[380px] bg-white rounded-[18px] shadow-[0_8px_25px_rgba(0,0,0,0.08)] px-8 py-7">
            <p className="text-[12px] font-semibold text-gray-600 mb-1">
              GUEST COMMUNICATION
            </p>
            <p className="text-[22px] font-semibold">75% response rate</p>
            <p className="text-[11px] text-gray-500 mb-4">
              Last 30 days · quick replies boost your ranking
            </p>

            {/* simple fake line – looks good, not wired yet */}
            <div className="h-[90px] mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#e5f9ea] to-white rounded-xl border border-[#e3e8f0]" />
              <svg
                viewBox="0 0 100 40"
                className="relative w-full h-full"
                preserveAspectRatio="none"
              >
                <polyline
                  fill="none"
                  stroke="#1ecc61"
                  strokeWidth="2"
                  points="0,25 16,30 32,18 48,24 64,14 80,20 100,10"
                />
                {[0, 16, 32, 48, 64, 80, 100].map((x, i) => {
                  const ys = [25, 30, 18, 24, 14, 20, 10];
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={ys[i]}
                      r="1.8"
                      fill="#1ecc61"
                      stroke="white"
                      strokeWidth="0.8"
                    />
                  );
                })}
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-5 text-[11px] text-gray-600">
              <div>
                <p className="text-gray-500">Inquiries</p>
                <p className="font-semibold text-[14px]">4</p>
                <p>6 yesterday</p>
              </div>
              <div>
                <p className="text-gray-500">Accepted inquiries</p>
                <p className="font-semibold text-[14px]">3</p>
                <p>4 yesterday</p>
              </div>
              <div>
                <p className="text-gray-500">Avg. first reply time</p>
                <p className="font-semibold text-[14px]">01:24 m</p>
                <p>02:07 m yesterday</p>
              </div>
              <div>
                <p className="text-gray-500">Open tickets</p>
                <p className="font-semibold text-[14px]">2</p>
                <p>Follow up to keep 5★ ratings</p>
              </div>
            </div>
          </div>
        </div>

        {/* LISTINGS */}
        <div className="mt-4">
          <h2 className="font-semibold text-[16px] mb-3">
            Homes, Apartments, Services
          </h2>

          {hostError && (
            <p className="text-[13px] text-red-600 mb-4">{hostError}</p>
          )}

          {loading ? (
            <p className="text-[13px] text-gray-500">Loading your rooms...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Old static Home 1 */}
              <div className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-[16px] px-4 py-10 text-center text-[14px] font-medium text-gray-800">
                Home 1
              </div>

              {/* Dynamic room cards */}
              {rooms.map((room) => (
                <button
                  key={room._id}
                  type="button"
                  onClick={() => handleOpenManage(room)}
                  className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-[16px] px-4 py-6 text-center text-[14px] font-medium text-gray-800 hover:shadow-xl transition"
                >
                  <p className="mb-1 truncate">{room.title}</p>
                  <p className="text-[11px] text-gray-500">
                    Created:{" "}
                    {room.createdAt
                      ? new Date(room.createdAt).toLocaleDateString()
                      : "-"}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Tap to manage listing
                  </p>
                </button>
              ))}

              {/* Add new house card */}
              <button
                type="button"
                onClick={handleAddNewHouse}
                className="bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)] rounded-[16px] px-4 py-10 text-center text-[14px] font-medium text-gray-800 hover:shadow-xl transition"
              >
                Add new house
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MANAGE LISTING MODAL */}
      {manageOpen && selectedRoom && (
        <ManageListingModal
          room={selectedRoom}
          onClose={() => setManageOpen(false)}
          token={token}
          onRoomUpdated={handleRoomUpdated}
        />
      )}
    </div>
  );
};

export default HostDashboard;
