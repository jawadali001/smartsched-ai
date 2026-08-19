"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const images = [
    "/slide1.jpg",
    "/slide2.jpg",
    "/slide3.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full relative">

      {/* IMAGE SLIDER BACKGROUND */}
      <div className="absolute inset-0">
        <Image
          src={images[index]}
          alt="slider"
          fill
          className="object-cover transition-all duration-700"
        />
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-white/25 backdrop-blur-sm"></div>

      <div className="relative z-10 text-center px-6 py-10">

        {/* HEADER */}
        <div className="flex items-center justify-center gap-3">
          <Image
            src="/comsats-logo.jpg"
            alt="COMSATS Logo"
            width={60}
            height={60}
            className="rounded-full bg-white p-1 shadow-md"
          />

          <h1 className="text-lg md:text-3xl font-bold text-gray-800">
            COMSATS University Islamabad Attock Campus
          </h1>
        </div>

        {/* TITLE */}
        <h2 className="text-5xl md:text-6xl font-extrabold mt-6 text-indigo-700">
          SmartSched
        </h2>

        <p className="text-xl mt-2 font-semibold text-gray-700">
          CUI Online Timetable Generator
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14 max-w-6xl mx-auto">

          {/* ADMIN */}
          <Link href="/admin/login">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-8 rounded-2xl shadow-lg hover:scale-105 transition duration-300 h-52 flex flex-col justify-center">
              <h3 className="text-xl font-semibold">Administrator</h3>
              <p className="text-sm mt-2 text-white/90">
                Manage data, generate and refine timetables
              </p>
            </div>
          </Link>

          {/* FACULTY */}
          <Link href="/faculty/login">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-8 rounded-2xl shadow-lg hover:scale-105 transition duration-300 h-52 flex flex-col justify-center">
              <h3 className="text-xl font-semibold">Faculty Member</h3>
              <p className="text-sm mt-2 text-white/90">
                View your personalized teaching schedule
              </p>
            </div>
          </Link>

          {/* STUDENT */}
          <Link href="/student/login">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-8 rounded-2xl shadow-lg hover:scale-105 transition duration-300 h-52 flex flex-col justify-center">
              <h3 className="text-xl font-semibold">Student</h3>
              <p className="text-sm mt-2 text-white/90">
                Access batch-wise timetables and updates
              </p>
            </div>
          </Link>

          {/* PROGRAM */}
          <Link href="/program/login">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-8 rounded-2xl shadow-lg hover:scale-105 transition duration-300 h-52 flex flex-col justify-center">
              <h3 className="text-xl font-semibold">Program</h3>
              <p className="text-sm mt-2 text-white/90">
                Access timetable of programs
              </p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}