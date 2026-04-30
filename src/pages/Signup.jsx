// // src/pages/Signup.jsx
// import React, { useState } from 'react';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// const Signup = () => {
//   const [countryOpen, setCountryOpen] = useState(false);
//   const [country, setCountry] = useState('Sri Lanka');

//   // DOB state
//   const [dobOpen, setDobOpen] = useState(false);
//   const [dobDay, setDobDay] = useState('');
//   const [dobMonth, setDobMonth] = useState('');
//   const [dobYear, setDobYear] = useState('');

//   // Form states
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [idNumber, setIdNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   // UI states
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const countries = ['Sri Lanka', 'India', 'United States', 'United Kingdom'];

//   const handleCountrySelect = (c) => {
//     setCountry(c);
//     setCountryOpen(false);
//   };

//   // Create DOB string
//   const formattedDob =
//     dobDay && dobMonth && dobYear ? `${dobDay}/${dobMonth}/${dobYear}` : '';

//   const handleDobSelect = (type, value) => {
//     const newDay = type === 'day' ? value : dobDay;
//     const newMonth = type === 'month' ? value : dobMonth;
//     const newYear = type === 'year' ? value : dobYear;

//     if (type === 'day') setDobDay(value);
//     if (type === 'month') setDobMonth(value);
//     if (type === 'year') setDobYear(value);

//     if (newDay && newMonth && newYear) setDobOpen(false);
//   };

//   // Days/months/years for picker
//   const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
//   const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 100 }, (_, i) => String(currentYear - 18 - i));

//   // ==========================
//   //     HANDLE SUBMIT
//   // ==========================
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     // validation
//     if (!firstName.trim() || !lastName.trim()) {
//       setError('Please enter your first and last name.');
//       return;
//     }
//     if (!email.trim()) {
//       setError('Please enter your email.');
//       return;
//     }
//     if (!formattedDob) {
//       setError('Please select your date of birth.');
//       return;
//     }
//     if (!password || !confirmPassword) {
//       setError('Please enter and confirm your password.');
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     const fullName = `${firstName.trim()} ${lastName.trim()}`;

//     // FINAL payload sent to backend
//     const payload = {
//       name: fullName,
//       email: email.trim().toLowerCase(),
//       password,
//       role: 'customer',
//       idNumber,
//       dateOfBirth: formattedDob,
//       phone,
//       country,
//     };

//     try {
//       setLoading(true);

//       const res = await fetch(`${API_URL}/api/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || 'Signup failed. Try again.');
//         setLoading(false);
//         return;
//       }

//       // Save auth
//       if (data.token) {
//         localStorage.setItem('roostrToken', data.token);
//       }
//       if (data.user) {
//         localStorage.setItem('roostrUser', JSON.stringify(data.user));
//       }

//       setSuccess('Signup successful! You are now logged in.');
//       setLoading(false);

//     } catch (err) {
//       console.error('Signup error:', err);
//       setError('Something went wrong. Please try again.');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f7f7f7] flex items-start justify-center pt-6 pb-16">
//       <div className="w-full max-w-[430px] bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.12)] border border-[#e3e3e3]">

//         {/* Header */}
//         <div className="border-b border-[#e4e4e4] px-8 py-3 flex justify-center">
//           <h1 className="text-[13px] font-semibold text-[#222222] tracking-[0.01em]">
//             Sign up
//           </h1>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="px-8 pt-7 pb-8 text-[13px] text-[#222222]">

//           {error && <div className="mb-3 text-[12px] text-red-600">{error}</div>}
//           {success && <div className="mb-3 text-[12px] text-green-600">{success}</div>}

//           {/* Name */}
//           <section className="mb-5">
//             <h2 className="text-[13px] font-semibold mb-3">Name</h2>

//             <input
//               type="text"
//               placeholder="First Name"
//               value={firstName}
//               onChange={(e) => setFirstName(e.target.value)}
//               className="w-full h-10 mb-3 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
//             />

//             <input
//               type="text"
//               placeholder="Last Name"
//               value={lastName}
//               onChange={(e) => setLastName(e.target.value)}
//               className="w-full h-10 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
//             />
//           </section>

//           {/* ID */}
//           <section className="mb-5">
//             <span className="block text-[12px] mb-1">ID</span>
//             <input
//               type="text"
//               placeholder="ID"
//               value={idNumber}
//               onChange={(e) => setIdNumber(e.target.value)}
//               className="w-full h-10 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
//             />
//           </section>

//           {/* DOB Picker */}
//           <section className="mb-6">
//             <span className="block text-[12px] mb-1">Date of Birth</span>

//             <button
//               type="button"
//               onClick={() => setDobOpen((o) => !o)}
//               className="w-full h-10 px-4 pr-10 text-left border border-[#c4c4c4] rounded-full bg-white"
//             >
//               {formattedDob || 'DD/MM/YYYY'}
//             </button>

//             {dobOpen && (
//               <div className="mt-2 border rounded-xl shadow bg-white p-3 grid grid-cols-3 gap-3 text-[12px] z-40 absolute w-[350px]">
//                 {/* Day */}
//                 <div className="max-h-40 overflow-y-auto">
//                   <div className="font-semibold mb-1">Day</div>
//                   {days.map((d) => (
//                     <button
//                       key={d}
//                       type="button"
//                       onClick={() => handleDobSelect('day', d)}
//                       className={`block w-full text-left px-2 py-1 rounded ${
//                         dobDay === d ? 'bg-[#ff5a5f] text-white' : 'hover:bg-[#eee]'
//                       }`}
//                     >
//                       {d}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Month */}
//                 <div className="max-h-40 overflow-y-auto">
//                   <div className="font-semibold mb-1">Month</div>
//                   {months.map((m) => (
//                     <button
//                       key={m}
//                       type="button"
//                       onClick={() => handleDobSelect('month', m)}
//                       className={`block w-full text-left px-2 py-1 rounded ${
//                         dobMonth === m ? 'bg-[#ff5a5f] text-white' : 'hover:bg-[#eee]'
//                       }`}
//                     >
//                       {m}
//                     </button>
//                   ))}
//                 </div>

//                 {/* Year */}
//                 <div className="max-h-40 overflow-y-auto">
//                   <div className="font-semibold mb-1">Year</div>
//                   {years.map((y) => (
//                     <button
//                       key={y}
//                       type="button"
//                       onClick={() => handleDobSelect('year', y)}
//                       className={`block w-full text-left px-2 py-1 rounded ${
//                         dobYear === y ? 'bg-[#ff5a5f] text-white' : 'hover:bg-[#eee]'
//                       }`}
//                     >
//                       {y}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </section>

//           {/* Contact Info */}
//           <section className="mb-6">
//             <h2 className="text-[13px] font-semibold mb-3">Contact Info</h2>

//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full h-10 mb-3 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
//             />

//             <input
//               type="tel"
//               placeholder="Phone Number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full h-10 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
//             />
//           </section>

//           {/* Country */}
//           <section className="mb-6">
//             <h2 className="text-[13px] font-semibold mb-3">Country / Region</h2>

//             <button
//               type="button"
//               onClick={() => setCountryOpen(!countryOpen)}
//               className="w-full h-10 px-4 pr-8 text-left border border-[#c4c4c4] rounded-full bg-white"
//             >
//               {country}
//             </button>

//             {countryOpen && (
//               <div className="mt-1 border rounded-xl shadow bg-white z-20">
//                 {countries.map((c) => (
//                   <button
//                     key={c}
//                     type="button"
//                     onClick={() => handleCountrySelect(c)}
//                     className="w-full text-left px-4 py-2 hover:bg-[#eee]"
//                   >
//                     {c}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </section>

//           {/* Password */}
//           <section className="mb-5">
//             <h2 className="text-[13px] font-semibold mb-3">Password</h2>

//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full h-10 mb-3 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
//             />

//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               className="w-full h-10 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
//             />
//           </section>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full h-10 rounded-full bg-[#ff5a5f] text-white font-semibold disabled:opacity-60"
//           >
//             {loading ? 'Creating account...' : 'Agree and continue'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// src/pages/Signup.jsx
import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL ?? "";

const Signup = () => {
  const [countryOpen, setCountryOpen] = useState(false);
  const [country, setCountry] = useState("Sri Lanka");

  // DOB state
  const [dobOpen, setDobOpen] = useState(false);
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const countries = ["Sri Lanka", "India", "United States", "United Kingdom"];

  const handleCountrySelect = (c) => {
    setCountry(c);
    setCountryOpen(false);
  };

  // Create DOB string
  const formattedDob =
    dobDay && dobMonth && dobYear ? `${dobDay}/${dobMonth}/${dobYear}` : "";

  const handleDobSelect = (type, value) => {
    const newDay = type === "day" ? value : dobDay;
    const newMonth = type === "month" ? value : dobMonth;
    const newYear = type === "year" ? value : dobYear;

    if (type === "day") setDobDay(value);
    if (type === "month") setDobMonth(value);
    if (type === "year") setDobYear(value);

    if (newDay && newMonth && newYear) setDobOpen(false);
  };

  // Days/months/years for picker
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    String(currentYear - 18 - i)
  );

  // ==========================
  //     HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!formattedDob) {
      setError("Please select your date of birth.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Payload to backend
    const payload = {
      name: fullName,
      email: email.trim().toLowerCase(),
      password,
      role: "customer", // default role
      idNumber,
      dateOfBirth: formattedDob,
      phone,
      country,
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed. Try again.");
        setLoading(false);
        return;
      }

      // Save auth
      if (data.token) {
        localStorage.setItem("roostrToken", data.token);
      }
      if (data.user) {
        localStorage.setItem("roostrUser", JSON.stringify(data.user));
      }

      // If backend already returns a host user, store host info too
      if (data.user && data.user.role === "host") {
        if (data.user._id) {
          localStorage.setItem("hostId", data.user._id);
        }
        if (data.token) {
          localStorage.setItem("hostToken", data.token);
        }
        localStorage.setItem("isHost", "true");
      }

      setSuccess("Signup successful! You are now logged in.");
      setLoading(false);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-start justify-center pt-6 pb-16">
      <div className="w-full max-w-[430px] bg-white rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.12)] border border-[#e3e3e3]">
        {/* Header */}
        <div className="border-b border-[#e4e4e4] px-8 py-3 flex justify-center">
          <h1 className="text-[13px] font-semibold text-[#222222] tracking-[0.01em]">
            Sign up
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 pt-7 pb-8 text-[13px] text-[#222222]"
        >
          {error && <div className="mb-3 text-[12px] text-red-600">{error}</div>}
          {success && (
            <div className="mb-3 text-[12px] text-green-600">{success}</div>
          )}

          {/* Name */}
          <section className="mb-5">
            <h2 className="text-[13px] font-semibold mb-3">Name</h2>

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-10 mb-3 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-10 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
            />
          </section>

          {/* ID */}
          <section className="mb-5">
            <span className="block text-[12px] mb-1">ID</span>
            <input
              type="text"
              placeholder="ID"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full h-10 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
            />
          </section>

          {/* DOB Picker */}
          <section className="mb-6 relative">
            <span className="block text-[12px] mb-1">Date of Birth</span>

            <button
              type="button"
              onClick={() => setDobOpen((o) => !o)}
              className="w-full h-10 px-4 pr-10 text-left border border-[#c4c4c4] rounded-full bg-white"
            >
              {formattedDob || "DD/MM/YYYY"}
            </button>

            {dobOpen && (
              <div className="mt-2 border rounded-xl shadow bg-white p-3 grid grid-cols-3 gap-3 text-[12px] z-40 absolute w-[350px]">
                {/* Day */}
                <div className="max-h-40 overflow-y-auto">
                  <div className="font-semibold mb-1">Day</div>
                  {days.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDobSelect("day", d)}
                      className={`block w-full text-left px-2 py-1 rounded ${
                        dobDay === d ? "bg-[#ff5a5f] text-white" : "hover:bg-[#eee]"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Month */}
                <div className="max-h-40 overflow-y-auto">
                  <div className="font-semibold mb-1">Month</div>
                  {months.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleDobSelect("month", m)}
                      className={`block w-full text-left px-2 py-1 rounded ${
                        dobMonth === m
                          ? "bg-[#ff5a5f] text-white"
                          : "hover:bg-[#eee]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Year */}
                <div className="max-h-40 overflow-y-auto">
                  <div className="font-semibold mb-1">Year</div>
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => handleDobSelect("year", y)}
                      className={`block w-full text-left px-2 py-1 rounded ${
                        dobYear === y
                          ? "bg-[#ff5a5f] text-white"
                          : "hover:bg-[#eee]"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Contact Info */}
          <section className="mb-6">
            <h2 className="text-[13px] font-semibold mb-3">Contact Info</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 mb-3 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-10 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
            />
          </section>

          {/* Country */}
          <section className="mb-6">
            <h2 className="text-[13px] font-semibold mb-3">Country / Region</h2>

            <button
              type="button"
              onClick={() => setCountryOpen(!countryOpen)}
              className="w-full h-10 px-4 pr-8 text-left border border-[#c4c4c4] rounded-full bg-white"
            >
              {country}
            </button>

            {countryOpen && (
              <div className="mt-1 border rounded-xl shadow bg-white z-20">
                {countries.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className="w-full text-left px-4 py-2 hover:bg-[#eee]"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Password */}
          <section className="mb-5">
            <h2 className="text-[13px] font-semibold mb-3">Password</h2>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 mb-3 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-10 px-4 border border-[#c4c4c4] rounded-full focus:border-black"
            />
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-full bg-[#ff5a5f] text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Agree and continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
