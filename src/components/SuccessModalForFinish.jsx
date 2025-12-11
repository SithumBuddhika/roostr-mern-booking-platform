// src/components/SuccessModalForFinish.jsx
import React from "react";

const SuccessModalForFinish = ({
  isOpen,
  roomTitle,
  reservationCode,
  totalPrice,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const displayTitle = roomTitle || "your trip";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-7 max-w-sm w-full text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>

        <h3 className="text-lg font-semibold mb-1">Booking confirmed</h3>
        <p className="text-sm text-gray-600 mb-4">
          Thank you! Your reservation for{" "}
          <span className="font-semibold">{displayTitle}</span> is confirmed.
        </p>

        {reservationCode && (
          <p className="text-xs text-gray-600 mb-1">
            Reservation code:{" "}
            <span className="font-semibold">{reservationCode}</span>
          </p>
        )}
        {typeof totalPrice !== "undefined" && (
          <p className="text-xs text-gray-600 mb-4">
            Total paid:{" "}
            <span className="font-semibold">
              ${Number(totalPrice || 0).toFixed(2)}
            </span>
          </p>
        )}

        <button
          onClick={onConfirm}
          className="mt-2 w-full bg-black text-white rounded-md py-2 text-sm font-semibold"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessModalForFinish;
