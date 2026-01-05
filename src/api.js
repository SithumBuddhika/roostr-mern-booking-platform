// // src/api.js
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// export async function registerUser(data) {
//   const res = await fetch(`${API_URL}/api/auth/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

//check

// export async function loginUser(data) {
//   const res = await fetch(`${API_URL}/api/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }

// src/api.js

// ✅ On Vercel serverless, backend is same domain.
// Use relative URLs so it works on BOTH localhost + Vercel.
const API_BASE = "";

// Helper to build URL
const url = (path) => `${API_BASE}${path}`;

export async function registerUser(data) {
  const res = await fetch(url("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅ important if you use cookies/JWT cookies
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(url("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return res.json();
}
