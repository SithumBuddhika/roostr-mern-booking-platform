// import React from 'react';
// import copyrightIcon from '../assets/copyright.png';
// import globeIcon from '../assets/globe.png';
// import dollarIcon from '../assets/dollar.png';
// import facebookIcon from '../assets/facebook.png';
// import instagramIcon from '../assets/instagram.png';
// import twitterIcon from '../assets/twitter.png';

// const Footer = () => {
//   return (
//     <footer className="bg-[#f3f8fe] pt-10 pb-5 mt-20">
//       {/* Top Sections */}
//       <div className="flex justify-around flex-wrap px-10 text-sm text-gray-600" >
//         <div className="mb-6">
//           <h3 className="text-black font-semibold mb-2">Support</h3>
//           <ul className="space-y-1">
//             <li>Help Center</li>
//             <li>Get help with safety issue</li>
//             <li>Disability Support</li>
//             <li>Report neighborhood consern</li>
//           </ul>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-black font-semibold mb-2">Hosting</h3>
//           <ul className="space-y-1">
//             <li>Roostr your home</li>
//             <li>Hosting resources</li>
//             <li>Community Forum</li>
//             <li>Hosting responsibly</li>
//             <li>Find a Co-host</li>
//           </ul>
//         </div>

//         <div className="mb-6">
//           <h3 className="text-black font-semibold mb-2">Roostr</h3>
//           <ul className="space-y-1">
//             <li>2025 Summer Release</li>
//             <li>Gif Cards</li>
//             <li>Roostr.org emergency stays</li>
//           </ul>
//         </div>
//       </div>

//       {/* Bottom Line */}
//       <div className="border-t border-gray-300 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center px-10 text-sm text-gray-600">
//         {/* Left */}
//         <div className="flex items-center space-x-4 mb-3 md:mb-0">
//           <img src={copyrightIcon} alt="copyright" className="h-4 w-4" />
//           <span>2025 Roostr, Inc</span>
//           <span>Terms</span>
//           <span>Privacy</span>
//           <span>Sitemap</span>
//         </div>

//         {/* Right */}
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-1">
//             <img src={globeIcon} alt="language" className="h-4 w-4" />
//             <span>English (US)</span>
//           </div>
//           <div className="flex items-center space-x-1">
//             <img src={dollarIcon} alt="currency" className="h-4 w-4" />
//             <span>USD</span>
//           </div>
//           <img src={facebookIcon} alt="facebook" className="h-4 w-4" />
//           <img src={instagramIcon} alt="instagram" className="h-4 w-4" />
//           <img src={twitterIcon} alt="twitter" className="h-4 w-4" />
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

// src/components/Footer.jsx
import React from "react";
import copyrightIcon from "../assets/copyright.png";
import globeIcon from "../assets/globe.png";
import dollarIcon from "../assets/dollar.png";
import facebookIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";
import twitterIcon from "../assets/twitter.png";

const Footer = () => {
  return (
    <footer className="bg-[#f3f8fe] pt-10 pb-5 mt-20">
      {/* Top Sections */}
      <div className="flex justify-around flex-wrap px-10 text-sm text-gray-600">
        <div className="mb-6">
          <h3 className="text-black font-semibold mb-2">Support</h3>
          <ul className="space-y-1">
            {[
              "Help Center",
              "Get help with safety issue",
              "Disability Support",
              "Report neighborhood consern",
            ].map((item) => (
              <li
                key={item}
                className="cursor-default hover:text-black hover:underline transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-black font-semibold mb-2">Hosting</h3>
          <ul className="space-y-1">
            {[
              "Roostr your home",
              "Hosting resources",
              "Community Forum",
              "Hosting responsibly",
              "Find a Co-host",
            ].map((item) => (
              <li
                key={item}
                className="cursor-default hover:text-black hover:underline transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-black font-semibold mb-2">Roostr</h3>
          <ul className="space-y-1">
            {[
              "2025 Summer Release",
              "Gif Cards",
              "Roostr.org emergency stays",
            ].map((item) => (
              <li
                key={item}
                className="cursor-default hover:text-black hover:underline transition-colors"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-300 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center px-10 text-sm text-gray-600">
        {/* Left */}
        <div className="flex items-center space-x-4 mb-3 md:mb-0">
          <img src={copyrightIcon} alt="copyright" className="h-4 w-4" />
          <span className="cursor-default">2025 Roostr, Inc</span>
          <span className="cursor-default hover:text-black hover:underline transition-colors">
            Terms
          </span>
          <span className="cursor-default hover:text-black hover:underline transition-colors">
            Privacy
          </span>
          <span className="cursor-default hover:text-black hover:underline transition-colors">
            Sitemap
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 cursor-default hover:text-black transition-colors">
            <img src={globeIcon} alt="language" className="h-4 w-4" />
            <span>English (US)</span>
          </div>
          <div className="flex items-center space-x-1 cursor-default hover:text-black transition-colors">
            <img src={dollarIcon} alt="currency" className="h-4 w-4" />
            <span>USD</span>
          </div>
          <img
            src={facebookIcon}
            alt="facebook"
            className="h-4 w-4 cursor-pointer hover:opacity-75 transition-opacity"
          />
          <img
            src={instagramIcon}
            alt="instagram"
            className="h-4 w-4 cursor-pointer hover:opacity-75 transition-opacity"
          />
          <img
            src={twitterIcon}
            alt="twitter"
            className="h-4 w-4 cursor-pointer hover:opacity-75 transition-opacity"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
