// src/components/BurgerMenu.jsx
import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import burgerIcon from "../assets/burger.png";
import heartIcon from "../assets/menu-heart.png";
import tripsIcon from "../assets/menu-trips.png";
import messageIcon from "../assets/menu-message.png";
import profileIcon from "../assets/menu-profile.png";
import notificationIcon from "../assets/menu-notification.png";
import settingsIcon from "../assets/menu-setting.png";
import globeIcon from "../assets/menu-globe.png";
import helpIcon from "../assets/menu-help.png";
import homeIcon from "../assets/menu-home.png";

const API_BASE = process.env.REACT_APP_API_URL;

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [user, setUser] = useState(null); // 👈 logged-in / not
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // ---------- read user from localStorage ----------
  const readUserFromStorage = () => {
    try {
      const stored =
        localStorage.getItem("roostrUser") || // host
        localStorage.getItem("roostr_user") || // guest
        localStorage.getItem("user") ||
        localStorage.getItem("currentUser");

      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn("Failed to parse stored user:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    readUserFromStorage();
  }, []);

  const toggleMenu = () => {
    // refresh user in case login/logout happened recently
    readUserFromStorage();
    setIsOpen((prev) => !prev);
  };
  const closeMenu = () => setIsOpen(false);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------- NAVIGATION HANDLERS -------

  const goToTrips = () => {
    closeMenu();
    navigate("/profile", { state: { initialTab: "trips" } });
  };

  const goToProfile = () => {
    closeMenu();
    navigate("/profile", { state: { initialTab: "about" } });
  };

  const goToBecomeHost = () => {
    closeMenu();
    navigate("/become-host");
  };

  const goToLogin = () => {
    closeMenu();
    navigate("/login");
  };

  const goToSignup = () => {
    closeMenu();
    navigate("/signup");
  };

  // ------- LOGOUT -------

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = async () => {
    try {
      await axios.post(
        `${API_BASE}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.warn("Logout API error (continuing anyway):", err.message);
    }

    // clear all possible auth data on the frontend
    const keysToClear = [
      "token",
      "authToken",
      "roostr_token",
      "roostr_user",
      "roostrUser",
      "roostrToken",
      "isHost",
      "user",
      "currentUser",
    ];
    keysToClear.forEach((k) => localStorage.removeItem(k));

    setUser(null);
    setShowLogoutModal(false);
    closeMenu();
    navigate("/login");
  };

  const isLoggedIn = !!user;

  return (
    <>
      {/* BURGER BUTTON + DROPDOWN */}
      <div className="relative z-50" ref={menuRef}>
        <button onClick={toggleMenu}>
          <img src={burgerIcon} alt="menu" className="h-8 w-8" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="absolute right-0 top-10 bg-white shadow-xl rounded-xl p-3 w-64"
            >
              <ul className="text-sm divide-y divide-gray-200">
                {/* Section 1 */}
                <div className="space-y-0.5">
                  {isLoggedIn ? (
                    <>
                      <MenuItem icon={heartIcon} label="Wishlists" />
                      <MenuItem
                        icon={tripsIcon}
                        label="Trips"
                        onClick={goToTrips}
                      />
                      <MenuItem
                        icon={messageIcon}
                        label="Messages"
                        // you can hook this later
                      />
                      <MenuItem
                        icon={profileIcon}
                        label="Profile"
                        onClick={goToProfile}
                      />
                    </>
                  ) : (
                    <>
                      <MenuItem label="Sign up" onClick={goToSignup} />
                      <MenuItem label="Log in" onClick={goToLogin} />
                    </>
                  )}
                </div>

                {/* Section 2 */}
                <div className="space-y-0.5 pt-2">
                  <MenuItem
                    icon={notificationIcon}
                    label="Notifications"
                  />
                  <MenuItem icon={settingsIcon} label="Account Settings" />
                  <MenuItem
                    icon={globeIcon}
                    label="Language & currency"
                  />
                  <MenuItem icon={helpIcon} label="Help Center" />
                </div>

                {/* Section 3 - Become a host (same design) */}
                <div className="pt-2">
                  <li
                    className="flex justify-between items-start px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                    onClick={goToBecomeHost}
                  >
                    <div className="flex flex-col pr-2">
                      <span className="font-semibold text-[15px] leading-snug">
                        Become a host
                      </span>
                      <span className="text-gray-500 text-sm leading-snug mt-0.5">
                        It’s easy to start hosting and earn extra income
                      </span>
                    </div>
                    <img
                      src={homeIcon}
                      alt="host"
                      className="h-10 w-10 mt-1"
                    />
                  </li>
                </div>

                {/* Section 4 */}
                <div className="space-y-0.5 pt-2">
                  <MenuItem label="Refer a Host" />
                  <MenuItem label="Find a co-host" />
                  <MenuItem label="Gift Cards" />
                  {isLoggedIn && (
                    <MenuItem label="Log out" onClick={openLogoutModal} />
                  )}
                </div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl px-6 pt-5 pb-4 w-full max-w-[360px]"
            >
              <h3 className="text-[18px] font-semibold mb-2">
                Log out of Roostr?
              </h3>
              <p className="text-[13px] text-gray-600 mb-5">
                You’ll need to sign in again to access your trips and hosting
                tools.
              </p>

              <div className="flex justify-end gap-3 text-[13px]">
                <button
                  onClick={cancelLogout}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const MenuItem = ({ icon, label, onClick }) => (
  <li
    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition text-[15px]"
    onClick={onClick}
  >
    {icon && <img src={icon} alt="" className="h-5 w-5" />}
    <span>{label}</span>
  </li>
);

export default BurgerMenu;
