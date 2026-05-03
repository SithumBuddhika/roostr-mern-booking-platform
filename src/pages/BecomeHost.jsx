// // src/pages/BecomeHost.jsx
// import React, { useState, useEffect } from "react";

// const API_URL = "";

// export default function BecomeHost() {
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("roostrUser");
//     if (stored) setUser(JSON.parse(stored));
//   }, []);

//   const handleUpgrade = async () => {
//     if (!user) {
//       setError("You must be logged in first.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetch(`${API_URL}/api/auth/become-host`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: user.id }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Upgrade failed.");
//         setLoading(false);
//         return;
//       }

//       // Save new role
//       localStorage.setItem("roostrUser", JSON.stringify(data.user));
//       localStorage.setItem("isHost", "true");

//       setSuccess("You are now a host!");
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setError("Server error.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f4f4f4] py-10">
//       {/* main card */}
//       <div className="mx-auto max-w-[520px] bg-white rounded-3xl shadow-[0_18px_55px_rgba(0,0,0,0.16)] px-10 pt-8 pb-10">
//         <h1 className="text-[18px] font-semibold mb-4">Become a Host</h1>

//         {error && (
//           <p className="text-[13px] text-red-500 mb-3 leading-snug">{error}</p>
//         )}
//         {success && (
//           <p className="text-[13px] text-green-600 mb-3 leading-snug">
//             {success}
//           </p>
//         )}

//         {user && (
//           <div className="border border-[#e4e4e4] p-4 rounded-2xl bg-[#f9fafb] mb-6 text-[14px]">
//             <p className="mb-1">
//               <span className="font-semibold">Name:</span> {user.name}
//             </p>
//             <p className="mb-1">
//               <span className="font-semibold">Email:</span> {user.email}
//             </p>
//             <p>
//               <span className="font-semibold">Country:</span> {user.country}
//             </p>
//           </div>
//         )}

//         <button
//           onClick={handleUpgrade}
//           className="
//             w-full h-10 rounded-full
//             bg-[#ff5a5f] text-white text-[14px] font-semibold
//             flex items-center justify-center
//             hover:bg-[#ff4046] active:bg-[#e4373d]
//             transition-colors
//           "
//         >
//           {loading ? "Upgrading..." : "Confirm & Become a Host"}
//         </button>
//       </div>
//     </div>
//   );
// }

// src/pages/BecomeHost.jsx
import React, { useState, useEffect } from "react";

export default function BecomeHost() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("roostrUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid roostrUser in localStorage");
      }
    }
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      setError("You must be logged in first.");
      return;
    }

    const token = localStorage.getItem("roostrToken");
    if (!token) {
      setError("Authentication token missing. Please log in again.");
      return;
    }

    // ✅ support both id / _id
    const userId = user.id || user._id;
    if (!userId) {
      setError("User ID not found. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // ✅ IMPORTANT: relative /api (works on localhost + vercel)
      const res = await fetch("/api/auth/become-host", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Upgrade failed.");
        setLoading(false);
        return;
      }

      // ✅ Save updated user
      localStorage.setItem("roostrUser", JSON.stringify(data.user));
      localStorage.setItem("isHost", "true");

      setSuccess("You are now a host!");
      setUser(data.user);
      setLoading(false);
    } catch (err) {
      console.error("Become host error:", err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] py-10">
      <div className="mx-auto max-w-[520px] bg-white rounded-3xl shadow-[0_18px_55px_rgba(0,0,0,0.16)] px-10 pt-8 pb-10">
        <h1 className="text-[18px] font-semibold mb-4">Become a Host</h1>

        {error && (
          <p className="text-[13px] text-red-500 mb-3 leading-snug">
            {error}
          </p>
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
            {user.country && (
              <p>
                <span className="font-semibold">Country:</span> {user.country}
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="
            w-full h-10 rounded-full
            bg-[#ff5a5f] text-white text-[14px] font-semibold
            flex items-center justify-center
            hover:bg-[#ff4046] active:bg-[#e4373d]
            transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {loading ? "Upgrading..." : "Confirm & Become a Host"}
        </button>
      </div>
    </div>
  );
}
