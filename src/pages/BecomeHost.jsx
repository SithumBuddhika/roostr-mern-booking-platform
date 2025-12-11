// src/pages/BecomeHost.jsx
import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function BecomeHost() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("roostrUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      setError("You must be logged in first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/auth/become-host`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Upgrade failed.");
        setLoading(false);
        return;
      }

      // Save new role
      localStorage.setItem("roostrUser", JSON.stringify(data.user));
      localStorage.setItem("isHost", "true");

      setSuccess("You are now a host!");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Server error.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-10">
      {/* main card */}
      <div className="mx-auto max-w-[520px] bg-white rounded-3xl shadow-[0_18px_55px_rgba(0,0,0,0.16)] px-10 pt-8 pb-10">
        <h1 className="text-[18px] font-semibold mb-4">Become a Host</h1>

        {error && (
          <p className="text-[13px] text-red-500 mb-3 leading-snug">{error}</p>
        )}
        {success && (
          <p className="text-[13px] text-green-600 mb-3 leading-snug">
            {success}
          </p>
        )}

        {user && (
          <div className="border border-[#e4e4e4] p-4 rounded-2xl bg-[#f9fafb] mb-6 text-[14px]">
            <p className="mb-1">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Country:</span> {user.country}
            </p>
          </div>
        )}

        <button
          onClick={handleUpgrade}
          className="
            w-full h-10 rounded-full
            bg-[#ff5a5f] text-white text-[14px] font-semibold
            flex items-center justify-center
            hover:bg-[#ff4046] active:bg-[#e4373d]
            transition-colors
          "
        >
          {loading ? "Upgrading..." : "Confirm & Become a Host"}
        </button>
      </div>
    </div>
  );
}
