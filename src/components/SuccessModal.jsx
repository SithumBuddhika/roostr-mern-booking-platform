// src/components/SuccessModal.jsx
import React, { useEffect } from "react";
import Lottie from "lottie-react";
import successAnim from "../assets/success.json"; // <-- put your JSON here

const SuccessModal = ({ open, title, subtitle, onClose }) => {
  // ❌ prevent background scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-[500px] px-10 py-12 shadow-2xl text-center relative animate-fadeIn">
        
        {/* Lottie Animation */}
        <div className="w-[180px] h-[180px] mx-auto mb-6">
          <Lottie 
            animationData={successAnim} 
            loop={false} 
            autoplay 
            style={{ width: "100%", height: "100%" }}
            speed={1.4} // <- adjust your animation speed
          />
        </div>

        <h1 className="text-[22px] font-semibold mb-1">{title}</h1>
        <p className="text-[16px] text-gray-700 mb-8">{subtitle}</p>

        <button
          onClick={onClose}
          className="px-10 py-3 rounded-full bg-black text-white text-[15px] font-medium shadow hover:bg-gray-900 active:scale-95 transition"
        >
          To Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
