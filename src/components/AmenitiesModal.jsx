// src/components/AmenitiesModal.jsx
import React, { useEffect } from "react";

const AmenitiesModal = ({ isOpen, onClose, amenitiesByCategory }) => {
  // lock scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* local styles just for this modal (scrollbar, etc.) */}
      <style>{`
        .amenities-scroll {
          scrollbar-width: thin;           /* Firefox */
          scrollbar-color: #cbd5e1 transparent;
        }
        .amenities-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .amenities-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .amenities-scroll::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 999px;
        }
        .amenities-scroll::-webkit-scrollbar-button {
          display: none;
          height: 0;
          width: 0;
        }
      `}</style>

      <div className="fixed inset-0 z-[80] flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-[90%] max-h-[80vh] flex flex-col">
          {/* Header (no bottom line now) */}
          <div className="flex items-center justify-between px-8 py-5">
            <h2 className="text-lg font-semibold">What this place offers</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl leading-none font-light hover:opacity-70"
            >
              ×
            </button>
          </div>

          {/* Scrollable content – scrollbar is INSIDE the modal */}
          <div className="amenities-scroll px-8 pb-8 pt-1 overflow-y-auto pr-6">
            {Object.keys(amenitiesByCategory).length === 0 && (
              <p className="text-sm text-gray-600">
                No amenities have been selected for this listing.
              </p>
            )}

            {Object.entries(amenitiesByCategory).map(([category, items]) => (
              <div key={category} className="pb-4">
                <h3 className="text-base font-semibold mb-3">{category}</h3>
                <div className="divide-y border-t">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-3 text-sm"
                    >
                      {item.img && (
                        <img
                          src={item.img}
                          alt={item.label}
                          className="h-6 w-6 object-contain"
                        />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AmenitiesModal;
