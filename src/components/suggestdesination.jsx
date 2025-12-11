// src/components/suggestdesination.jsx
import React from 'react';

// ICON IMPORTS
import nearbyIcon from '../assets/destinations/nearby.png';
import sriLankaIcon from '../assets/destinations/sri-lanka.png';
import japanIcon from '../assets/destinations/japan.png';
import parisIcon from '../assets/destinations/paris.png';
import londonIcon from '../assets/destinations/london.png';
import brazilIcon from '../assets/destinations/brazil.png';
import thailandIcon from '../assets/destinations/thailand.png';
import dubaiIcon from '../assets/destinations/dubai.png';
import australiaIcon from '../assets/destinations/australia.png';
import indiaIcon from '../assets/destinations/india.png';
import romeIcon from '../assets/destinations/rome.png';

// DATA
const destinations = [
  { id: 'nearby',  label: 'Nearby',                  subtitle: "Find what’s around you", icon: nearbyIcon,    country: null },
  { id: 'sri-lanka', label: 'Sri Lanka',             subtitle: "Find what’s around you", icon: sriLankaIcon,  country: 'Sri Lanka' },
  { id: 'japan',   label: 'Japan',                   subtitle: "Find what’s around you", icon: japanIcon,     country: 'Japan' },
  { id: 'paris',   label: 'Paris',                   subtitle: "Find what’s around you", icon: parisIcon,     country: 'France' },
  { id: 'london',  label: 'London, United Kingdom',  subtitle: "Find what’s around you", icon: londonIcon,    country: 'United Kingdom' },
  { id: 'brazil',  label: 'Brazil',                  subtitle: "Find what’s around you", icon: brazilIcon,    country: 'Brazil' },
  { id: 'thailand',label: 'Thailand',                subtitle: "Find what’s around you", icon: thailandIcon,  country: 'Thailand' },
  { id: 'dubai',   label: 'Dubai',                   subtitle: "Find what’s around you", icon: dubaiIcon,     country: 'United Arab Emirates' },
  { id: 'australia', label: 'Australia',             subtitle: "Find what’s around you", icon: australiaIcon, country: 'Australia' },
  { id: 'india',   label: 'India',                   subtitle: "Find what’s around you", icon: indiaIcon,     country: 'India' },
  { id: 'rome',    label: 'Rome, Italy',             subtitle: "Find what’s around you", icon: romeIcon,      country: 'Italy' },
];

const SuggestedDestinations = ({ onSelect }) => {
  return (
    <div
      className="
        w-[350px]
        h-[490px]
        bg-white
        rounded-[28px]
        shadow-[0_18px_45px_rgba(0,0,0,0.16)]
        border border-[#e3e3e3]
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3">
        <h2 className="text-[15px] font-semibold text-[#222]">
          Suggested destinations
        </h2>
      </div>

      {/* Scrollable List */}
      <div
        className="
          max-h-[420px] 
          overflow-y-auto 
          px-4 
          pb-4 
          scroll-smooth

          [&::-webkit-scrollbar]:w-[6px]
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-[#cfd6dd]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-[#b8c1c9]

          scrollbar-thin
          scrollbar-thumb-[#cfd6dd]
          scrollbar-track-transparent
        "
      >
        <div className="space-y-1">
          {destinations.map((dest) => (
            <button
              key={dest.id}
              onClick={() => onSelect && onSelect(dest)}
              type="button"
              className="
                w-full
                flex items-center gap-4
                rounded-2xl
                px-3 py-3
                hover:bg-[#f4f9fc]
                transition-all duration-150
                text-left
              "
            >
              {/* Icon */}
              <div
                className="
                  w-14 h-14
                  rounded-2xl
                  bg-[#eef7fb]
                  flex items-center justify-center
                  flex-shrink-0
                "
              >
                <img src={dest.icon} alt={dest.label} className="w-8 h-8 object-contain" />
              </div>

              {/* Text */}
              <div>
                <p className="text-[15px] font-semibold text-[#222]">{dest.label}</p>
                <p className="text-[13px] text-[#9a9a9a] mt-[2px]">{dest.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedDestinations;
