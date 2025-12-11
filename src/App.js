// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// import RoomDetails from "./pages/RoomDetails";
// import Navbar from './components/Navbar';
// import NoSearchNav from './components/NoSearchNav.jsx';
// import HomeScreen from './pages/HomeScreen';
// import Footer from './components/Footer';
// import SearchRibbonNavbar from './components/SearchRibbon';
// import PaymentPage from './pages/PaymentPage';
// import FinishBooking from './pages/FinishBooking';
// import HostDashboard from './pages/HostDashboard.jsx';
// import Profile from './pages/Profile.jsx';
// import Signup from "./pages/Signup";
// import JustNav from './components/JustNav';
// import Login from "./pages/Login.jsx";
// import AddNewRoom from './pages/AddNewRoom.jsx';
// import BecomeHost from './pages/BecomeHost.jsx';

// function LayoutWrapper({ children }) {
//   const location = useLocation();
//   const path = location.pathname.toLowerCase(); // make checks -insensitive

//   const isRoomDetails   = path.startsWith('/room/');
//   const isPaymentPage   = path === '/payment';
//   const isFinishPage    = path === '/finish';
//   const isHostDashboard = path === '/host/dashboard';
//   const isProfile       = path === '/profile';
//   const isSignup        = path === '/signup';
//   const isLogin         = path === '/login';

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* top nav switcher */}
//       {!isPaymentPage && !isFinishPage && (
//         isRoomDetails ? (
//           <SearchRibbonNavbar />
//         ) : isHostDashboard || isProfile ? (
//           <NoSearchNav />
//         ) : (isSignup || isLogin) ? (
//           <JustNav />
//         ) : (
//           <Navbar />
//         )
//       )}

//       {/* page content */}
//       <div className="flex-grow">
//         {children}
//       </div>

//       {/* footer (hidden on payment / finish / signup / login) */}
//       {!isPaymentPage && !isFinishPage && !isSignup && !isLogin && <Footer />}
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <LayoutWrapper>
//         <Routes>
//           <Route path="/" element={<HomeScreen />} />
//           <Route path="/room/:id" element={<RoomDetails />} />
//           <Route path="/payment" element={<PaymentPage />} />
//           <Route path="/finish" element={<FinishBooking />} />
//           <Route path="/host/dashboard" element={<HostDashboard />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/login" element={<Login />} />   {/* you can keep /Login if you prefer, just update links */}
//           <Route path="/host/AddNewRoom" element={<AddNewRoom />} />
//           <Route path="/become-host" element={<BecomeHost />} />



//         </Routes>
//       </LayoutWrapper>
//     </Router>
//   );
// }


// // src/App.js
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
// } from "react-router-dom";

// import RoomDetails from "./pages/RoomDetails";
// import Navbar from "./components/Navbar";
// import NoSearchNav from "./components/NoSearchNav.jsx";
// import HomeScreen from "./pages/HomeScreen";
// import Footer from "./components/Footer";
// import SearchRibbonNavbar from "./components/SearchRibbon";
// import PaymentPage from "./pages/PaymentPage";
// import FinishBooking from "./pages/FinishBooking";
// import HostDashboard from "./pages/HostDashboard.jsx";
// import Profile from "./pages/Profile.jsx";
// import Signup from "./pages/Signup";
// import JustNav from "./components/JustNav";
// import Login from "./pages/Login.jsx";
// import AddNewRoom from "./pages/AddNewRoom.jsx";
// import BecomeHost from "./pages/BecomeHost.jsx";

// // 🔹 search context
// import { SearchProvider } from "./context/SearchContext";

// function LayoutWrapper({ children }) {
//   const location = useLocation();
//   const path = location.pathname.toLowerCase(); // make checks case-insensitive

//   const isRoomDetails = path.startsWith("/room/");
//   const isPaymentPage = path === "/payment";
//   const isFinishPage = path === "/finish";
//   const isHostDashboard = path === "/host/dashboard";
//   const isProfile = path === "/profile";
//   const isSignup = path === "/signup";
//   const isLogin = path === "/login";

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* top nav switcher */}
//       {!isPaymentPage && !isFinishPage && (
//         isRoomDetails ? (
//           <SearchRibbonNavbar />
//         ) : isHostDashboard || isProfile ? (
//           <NoSearchNav />
//         ) : isSignup || isLogin ? (
//           <JustNav />
//         ) : (
//           <Navbar />
//         )
//       )}

//       {/* page content */}
//       <div className="flex-grow">{children}</div>

//       {/* footer (hidden on payment / finish / signup / login) */}
//       {!isPaymentPage && !isFinishPage && !isSignup && !isLogin && <Footer />}
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       {/* 🔹 Make search state global for Navbar + HomeScreen */}
//       <SearchProvider>
//         <LayoutWrapper>
//           <Routes>
//             <Route path="/" element={<HomeScreen />} />
//             <Route path="/room/:id" element={<RoomDetails />} />
//             <Route path="/payment" element={<PaymentPage />} />
//             <Route path="/finish" element={<FinishBooking />} />
//             <Route path="/host/dashboard" element={<HostDashboard />} />
//             <Route path="/profile" element={<Profile />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/host/AddNewRoom" element={<AddNewRoom />} />
//             <Route path="/become-host" element={<BecomeHost />} />
//           </Routes>
//         </LayoutWrapper>
//       </SearchProvider>
//     </Router>
//   );
// }


// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import RoomDetails from "./pages/RoomDetails";
import Navbar from './components/Navbar';
import NoSearchNav from './components/NoSearchNav.jsx';
import HomeScreen from './pages/HomeScreen';
import Footer from './components/Footer';
import SearchRibbonNavbar from './components/SearchRibbon';
import PaymentPage from './pages/PaymentPage';
import FinishBooking from './pages/FinishBooking';
import HostDashboard from './pages/HostDashboard.jsx';
import Profile from './pages/Profile.jsx';
import Signup from "./pages/Signup";
import JustNav from './components/JustNav';
import Login from "./pages/Login.jsx";
import AddNewRoom from './pages/AddNewRoom.jsx';
import BecomeHost from './pages/BecomeHost.jsx';

function LayoutWrapper({ children }) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const isRoomDetails   = path.startsWith('/room/');
  const isPaymentPage   = path === '/payment';
  const isFinishPage    = path === '/finish';
  const isHostDashboard = path === '/host/dashboard';
  const isProfile       = path === '/profile';
  const isSignup        = path === '/signup';
  const isLogin         = path === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top nav switcher */}
      {!isPaymentPage && !isFinishPage && (
        isRoomDetails ? (
          <SearchRibbonNavbar />
        ) : isHostDashboard || isProfile ? (
          <NoSearchNav />
        ) : (isSignup || isLogin) ? (
          <JustNav />
        ) : (
          <Navbar />
        )
      )}

      {/* Page content */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Footer (hidden on payment / finish / signup / login) */}
      {!isPaymentPage && !isFinishPage && !isSignup && !isLogin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/finish" element={<FinishBooking />} />
          <Route path="/host/dashboard" element={<HostDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/host/AddNewRoom" element={<AddNewRoom />} />
          <Route path="/become-host" element={<BecomeHost />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}
