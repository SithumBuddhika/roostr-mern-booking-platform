// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import roomImg from "../assets/paymentimages/roomimg.png";
import cards from "../assets/paymentimages/cards.png";
import backimg from "../assets/paymentimages/backimg.png";
import logo from "../assets/logo.png";

// 🔹 Helper to read the currently logged-in user from localStorage
const getCurrentUserId = () => {
  try {
    const raw =
      localStorage.getItem("roostrUser") || // host / new login
      localStorage.getItem("roostr_user") ||
      localStorage.getItem("user") ||
      localStorage.getItem("currentUser");

    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed._id || parsed.id || null;
  } catch (err) {
    console.warn("Failed to read current user from localStorage:", err);
    return null;
  }
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------- GET DATA FROM NAVIGATION STATE -----------------
  const {
    roomId,
    roomTitle,
    roomImage,
    checkInDate,
    checkOutDate,
    totalNights,
    totalPrice,
    pricePerNight,
    guestSummary,
    guests,
  } = location.state || {};

  const displayRoomImage = roomImage || roomImg;
  const displayRoomTitle = roomTitle || "Roostr Listing";

  useEffect(() => {
    if (!location.state) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  const formattedCheckIn = checkInDate ? dayjs(checkInDate) : null;
  const formattedCheckOut = checkOutDate ? dayjs(checkOutDate) : null;

  // 🔹 Stable user id for this flow
  const [currentUserId] = useState(() => getCurrentUserId());

  // ----------------- LOCAL STATE -----------------
  const [step, setStep] = useState(1);

  const [cardNumber, setCardNumber] = useState(""); // formatted "#### #### #### ####"
  const [exp, setExp] = useState(""); // formatted "MM/YY"
  const [cvv, setCvv] = useState("");
  const [message, setMessage] = useState("");

  const [address, setAddress] = useState({
    street: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    exp: "",
    cvv: "",
    street: "",
    city: "",
    zip: "",
    country: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Stable reservation code (generated once)
  const [reservationCode] = useState(() => {
    const random = Math.floor(Math.random() * 90 + 10); // 2 digits
    return `${Date.now().toString().slice(-5)}${random}`;
  });

  // ----------------- VALIDATION HELPERS -----------------
  const buildStep1Errors = () => {
    const errs = {
      cardNumber: "",
      exp: "",
      cvv: "",
      street: "",
      city: "",
      zip: "",
      country: "",
    };

    const digitsCard = cardNumber.replace(/\D/g, "");

    if (!digitsCard) {
      errs.cardNumber = "Card number is required.";
    } else if (digitsCard.length < 16) {
      errs.cardNumber = "Card number must be 16 digits.";
    }

    if (!exp) {
      errs.exp = "Expiry date is required.";
    } else {
      const digitsExp = exp.replace(/\D/g, "");
      if (digitsExp.length !== 4) {
        errs.exp = "Use MM/YY format.";
      } else {
        const month = Number(digitsExp.slice(0, 2));
        const year = 2000 + Number(digitsExp.slice(2));
        if (month < 1 || month > 12) {
          errs.exp = "Invalid expiry month.";
        } else {
          const now = dayjs();
          const expDate = dayjs(`${year}-${month}-01`).endOf("month");
          if (expDate.isBefore(now, "day")) {
            errs.exp = "Card has expired.";
          }
        }
      }
    }

    if (!cvv) {
      errs.cvv = "CVV is required.";
    } else if (cvv.length < 3) {
      errs.cvv = "CVV must be 3 or 4 digits.";
    }

    if (!address.street.trim()) {
      errs.street = "Street address is required.";
    }

    if (!address.city.trim()) {
      errs.city = "City is required.";
    } else if (/\d/.test(address.city)) {
      errs.city = "City name cannot contain numbers.";
    }

    if (!address.zip.trim()) {
      errs.zip = "ZIP / postal code is required.";
    } else if (address.zip.trim().length < 3) {
      errs.zip = "ZIP / postal code seems too short.";
    }

    if (!address.country) {
      errs.country = "Country / region is required.";
    }

    return errs;
  };

  const validateMessage = () => {
    const text = message.trim();
    if (!text) return "Please write a short message to your host.";
    if (text.length < 10) return "Message should be at least 10 characters.";
    return "";
  };

  const hasAnyError = (errObj) =>
    Object.values(errObj).some((msg) => msg && msg.length > 0);

  // ----------------- CHANGE HANDLERS (REAL-TIME INPUT FILTERING) -----------------
  const handleCardNumberChange = (e) => {
    // allow only digits, auto format #### #### #### ####
    const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = rawDigits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpChange = (e) => {
    // only digits, auto MM/YY
    let digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      digits = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setExp(digits);
  };

  const handleCvvChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(digits);
  };

  const handleAddressChange = (field, value) => {
    let v = value;

    if (field === "city") {
      // no digits for city
      v = v.replace(/\d/g, "");
    }
    if (field === "zip") {
      // digits only for zip
      v = v.replace(/\D/g, "").slice(0, 10);
    }

    setAddress((prev) => ({
      ...prev,
      [field]: v,
    }));
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // ----------------- BLUR HANDLERS (SHOW ERROR WHEN FIELD LOSES FOCUS) -----------------
  const handleFieldBlur = (field) => {
    const step1Errs = buildStep1Errors();
    if (field in step1Errs) {
      setErrors((prev) => ({
        ...prev,
        [field]: step1Errs[field],
      }));
    }
    if (field === "message") {
      setErrors((prev) => ({
        ...prev,
        message: validateMessage(),
      }));
    }
  };

  // ----------------- STEP NAVIGATION -----------------
  const handleNextFromStep1 = () => {
    const step1Errs = buildStep1Errors();
    setErrors((prev) => ({
      ...prev,
      ...step1Errs,
    }));
    if (!hasAnyError(step1Errs)) {
      setError("");
      setStep(2);
    } else {
      setError("Please fix the highlighted card and billing details.");
    }
  };

  const handleNextFromStep2 = () => {
    const msgErr = validateMessage();
    setErrors((prev) => ({
      ...prev,
      message: msgErr,
    }));
    if (!msgErr) {
      setError("");
      setStep(3);
    } else {
      setError("Please complete your message to the host.");
    }
  };

  // ----------------- CONFIRM & SAVE -----------------
  const handleConfirmAndSave = async () => {
    const step1Errs = buildStep1Errors();
    const msgErr = validateMessage();

    setErrors((prev) => ({
      ...prev,
      ...step1Errs,
      message: msgErr,
    }));

    if (hasAnyError(step1Errs)) {
      setStep(1);
      setError("Please fix the highlighted card and billing details.");
      return;
    }
    if (msgErr) {
      setStep(2);
      setError("Please complete your message to the host.");
      return;
    }
    if (!roomId || !checkInDate || !checkOutDate) {
      setError("Missing booking information. Please go back and try again.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalNights,
        pricePerNight,
        totalPrice,
        guests: guests || null,
        guestSummary: guestSummary || "",
        reservationCode,
        noteToHost: message.trim(),
        billingAddress: { ...address },

        // 🔥 KEY: link booking to logged-in user
        guestId: currentUserId || null,
      };

      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        payload
      );
      const booking = res.data?.booking;

      navigate("/finish", {
        state: {
          roomTitle: displayRoomTitle,
          roomImage: displayRoomImage,
          checkInDate,
          checkOutDate,
          guestSummary,
          totalPrice,
          reservationCode,
          bookingId: booking?._id,
        },
      });
    } catch (err) {
      console.error("Booking create failed:", err);
      setError("Failed to save booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------- RENDER -----------------
  return (
    <>
      {/* Top logo nav (no main site navbar/footer here) */}
      <nav className="bg-[#f3f8fe] shadow-md px-10 py-5 rounded-t-xl">
        <img src={logo} alt="Roostr" className="h-20 w-auto" />
      </nav>

      <div className="min-h-screen bg-white px-4 py-6 lg:px-28 xl:px-48">
        {/* Title */}
        <div className="flex items-center gap-2 mb-8">
          <img
            src={backimg}
            alt="Back"
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h2 className="text-xl font-semibold">Request to book</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 justify-center">
          {/* LEFT SECTION */}
          <div className="w-full lg:w-[500px] space-y-6">
            {/* Step 1 */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-3">
                1. Add a payment method
              </h3>
              <p className="text-sm mb-1">Credit or debit card</p>
              <img src={cards} alt="cards" className="h-5 mb-2" />
              <p className="text-[11px] text-gray-500 mb-4">
                Test tip: you can use{" "}
                <span className="font-semibold">4242 4242 4242 4242</span>, any
                future expiry, any 3-digit CVV.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Card number"
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onBlur={() => handleFieldBlur("cardNumber")}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="w-1/2">
                    <input
                      type="text"
                      placeholder="Exp (MM/YY)"
                      className="w-full px-4 py-2 rounded-md border border-gray-300"
                      value={exp}
                      onChange={handleExpChange}
                      onBlur={() => handleFieldBlur("exp")}
                    />
                    {errors.exp && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.exp}
                      </p>
                    )}
                  </div>
                  <div className="w-1/2">
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-full px-4 py-2 rounded-md border border-gray-300"
                      value={cvv}
                      onChange={handleCvvChange}
                      onBlur={() => handleFieldBlur("cvv")}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-medium mt-4">Billing address</h4>

                <div>
                  <input
                    type="text"
                    placeholder="Street address"
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                    value={address.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("street")}
                  />
                  {errors.street && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.street}
                    </p>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Apt or suite number (optional)"
                  className="w-full px-4 py-2 rounded-md border border-gray-300"
                  value={address.apt}
                  onChange={(e) =>
                    handleAddressChange("apt", e.target.value)
                  }
                />

                <div>
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                    value={address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("city")}
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="State / province (optional)"
                    className="w-1/2 px-4 py-2 rounded-md border border-gray-300"
                    value={address.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                  />
                  <div className="w-1/2">
                    <input
                      type="text"
                      placeholder="ZIP code"
                      className="w-full px-4 py-2 rounded-md border border-gray-300"
                      value={address.zip}
                      onChange={(e) =>
                        handleAddressChange("zip", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("zip")}
                    />
                    {errors.zip && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.zip}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <select
                    className="w-full px-4 py-2 rounded-md border border-gray-300"
                    value={address.country}
                    onChange={(e) =>
                      handleAddressChange("country", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("country")}
                  >
                    <option value="">Country / region</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="IN">India</option>
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleNextFromStep1}
                className="mt-6 bg-black text-white py-2 px-6 rounded-md font-semibold"
              >
                Next
              </button>
            </div>

            {/* Step 2 (Visible but collapsible) */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-3">
                2. Write a message to the host
              </h3>
              {step >= 2 ? (
                <>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
                    placeholder="Introduce yourself, share trip details, or ask questions..."
                    value={message}
                    onChange={handleMessageChange}
                    onBlur={() => handleFieldBlur("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.message}
                    </p>
                  )}
                  <button
                    onClick={handleNextFromStep2}
                    className="mt-4 bg-black text-white py-2 px-6 rounded-md font-semibold"
                  >
                    Next
                  </button>
                </>
              ) : null}
            </div>

            {/* Step 3 (Visible but collapsible) */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-3">
                3. Review your request.
              </h3>
              {step >= 3 ? (
                <div className="bg-white p-4 rounded-xl border shadow-sm w-full max-w-md">
                  <div className="flex gap-4 items-start mb-4">
                    <img
                      src={displayRoomImage}
                      alt="room"
                      className="w-[100px] h-[80px] object-cover rounded-lg"
                    />
                    <div className="text-sm">
                      <p className="font-semibold mb-1">
                        {displayRoomTitle}
                      </p>
                      <p className="text-gray-600">
                        {guestSummary || "1 guest"}
                      </p>
                    </div>
                  </div>
                  <div className="border-t pt-2 mt-2 text-sm">
                    <div className="flex justify-between mb-2">
                      <p className="text-gray-600">Reservation code</p>
                      <p className="font-semibold">{reservationCode}</p>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <p>Total USD</p>
                      <p>${Number(totalPrice || 0).toFixed(2)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmAndSave}
                    disabled={isSubmitting}
                    className="mt-4 w-full bg-[#FF5A5F] text-white font-semibold py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Confirm & Save"}
                  </button>
                  {error && (
                    <p className="mt-2 text-xs text-red-600 text-center">
                      {error}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* RIGHT SECTION – Booking Summary */}
          <div className="w-full lg:w-[320px] bg-white shadow-lg rounded-2xl p-4 h-fit">
            <img
              src={displayRoomImage}
              alt="room"
              className="rounded-lg h-[130px] w-full object-cover mb-3"
            />
            <h4 className="text-sm font-semibold">{displayRoomTitle}</h4>
            <p className="text-sm text-gray-600 mb-2">
              This reservation is non-refundable.
            </p>

            <div className="flex justify-between items-center mb-1 text-sm">
              <p className="text-gray-600">Trip details</p>
              <button className="bg-[#e6e6e6] px-6 py-2.5 rounded-xl text-[12px] font-medium mb-2">
                Change
              </button>
            </div>

            <p className="text-sm mb-2">
              {formattedCheckIn && formattedCheckOut
                ? `${formattedCheckIn.format(
                    "MMM D, YYYY"
                  )} - ${formattedCheckOut.format("MMM D, YYYY")}`
                : "No dates selected"}
              <br />
              {guestSummary || "1 guest"}
            </p>

            <div className="border-t my-3" />

            <div className="text-sm">
              <div className="flex justify-between">
                <p className="text-gray-600">
                  ${pricePerNight}.00 × {totalNights} night
                  {totalNights > 1 ? "s" : ""}
                </p>
                <p>${Number(totalPrice || 0).toFixed(2)}</p>
              </div>

              <div className="border-t my-2" />

              <div className="flex justify-between font-semibold">
                <p>Total USD</p>
                <p>${Number(totalPrice || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full border-t text-sm text-gray-600 py-4 px-6 flex justify-start bg-gray-50">
        <span className="mr-2">Privacy</span>·
        <span className="ml-2">Terms</span>
      </footer>
    </>
  );
};

export default PaymentPage;
