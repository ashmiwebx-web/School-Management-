import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <Sidebar />

      <div className="ml-[260px] flex min-h-screen w-[calc(100%-260px)] flex-col">
        <Navbar />

        <main className="flex-1 px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}