// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "";


const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Try again.");
        setLoading(false);
        return;
      }

      // Save user authentication
      localStorage.setItem("roostrToken", data.token);
      localStorage.setItem("roostrUser", JSON.stringify(data.user));

      // Save host state
      localStorage.setItem("isHost", data.user.role === "host" ? "true" : "false");

      setLoading(false);

      // 🔥 DIRECT REDIRECT AFTER LOGIN — NO MESSAGE DELAYS
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-start justify-center pt-12 pb-16">

      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-xl border">
        <div className="border-b px-8 py-3 flex justify-center">
          <h1 className="text-[13px] font-semibold">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 text-[13px]">

          {error && <div className="mb-3 text-red-600">{error}</div>}

          <label>Email</label>
          <input
            className="w-full border rounded-full h-10 px-4 mb-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            className="w-full border rounded-full h-10 px-4 mb-6"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-[#ff5a5f] text-white rounded-full"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
