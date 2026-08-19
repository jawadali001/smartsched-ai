"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-purple-700 text-white p-6 flex items-center gap-4 shadow-md">
      <Image src="/comsats-logo.jpg" alt="COMSATS Logo" width={60} height={60} />
      <div>
        <h1 className="text-xl font-bold">COMSATS University Islamabad Attock Campus</h1>
        <p className="text-sm font-medium">CU Online Timetable Console</p>
      </div>
    </header>
  );
}