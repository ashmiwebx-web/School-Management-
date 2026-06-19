import React from "react";
import toast, { Toaster } from "react-hot-toast";

const ToastBox = ({ message, type }) => {
  const isError = type === "error";

  return (
    <div
      className={`relative w-[330px] overflow-hidden rounded-[8px] border bg-white px-[16px] py-[14px] shadow-lg ${
        isError ? "border-[#ffd6df]" : "border-[#e5e9f2]"
      }`}
    >
      <p
        className={`text-[15px] font-semibold ${
          isError ? "text-[#f52d55]" : "text-[#06142e]"
        }`}
      >
        {message}
      </p>

      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#edf0f7]">
        <div className="toast-progress h-full bg-[#506ee4]" />
      </div>
    </div>
  );
};

export const showSuccess = (message) => {
  toast.custom(<ToastBox message={message} type="success" />, {
    duration: 3000,
  });
};

export const showError = (message) => {
  toast.custom(<ToastBox message={message} type="error" />, {
    duration: 3000,
  });
};

export default function AppToast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      }}
    />
  );
}