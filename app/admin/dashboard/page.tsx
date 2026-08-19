"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import TeachersPage from "../teachers/page";
import CoursesPage from "../courses/page";
import RoomsPage from "../rooms/page";
import TimeSlotsPage from "../timeslots/page";


import {
  LayoutDashboard,
  Users,
  BookOpen,
  DoorOpen,
  Clock,
  Calendar,
  ArrowLeft,
 
} from "lucide-react";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");

  const [totalTeachers, setTotalTeachers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalTimetables, setTotalTimetables] = useState(0);
  const [latestTimetable, setLatestTimetable] = useState<any>(null);

  const router = useRouter();

  // ✅ FIXED logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ FIXED safer function
  const fetchDashboardData = async () => {
    try {
      const { count: teachersCount } = await supabase
        .from("teachers")
        .select("*", { count: "exact", head: true });

      setTotalTeachers(teachersCount || 0);

      const { count: coursesCount } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      setTotalCourses(coursesCount || 0);

      const { count: timetableCount } = await supabase
        .from("timetables")
        .select("*", { count: "exact", head: true });

      setTotalTimetables(timetableCount || 0);

      const { data } = await supabase
        .from("timetables")
        .select("*")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

      setLatestTimetable(data);
    } catch (err) {
      console.log("Dashboard Error:", err);
    }
  };

  return (
    <div className="flex h-screen">

      {/* 🔷 SIDEBAR */}
      <div className="w-1/4 bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-6 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center gap-2 mb-10">
          <button
            onClick={() => router.push("/admin/login")}
            className="bg-white text-indigo-700 p-1 rounded hover:bg-gray-200"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <div className="flex flex-col gap-4">

          <button onClick={() => setActive("dashboard")} className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-indigo-700">
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button onClick={() => setActive("teachers")} className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-indigo-700">
            <Users size={18} /> Teachers
          </button>

          <button onClick={() => setActive("courses")} className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-indigo-700">
            <BookOpen size={18} /> Courses
          </button>

          <button onClick={() => setActive("rooms")} className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-indigo-700">
            <DoorOpen size={18} /> Rooms
          </button>

          <button onClick={() => setActive("timeslots")} className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-indigo-700">
            <Clock size={18} /> Time Slots
          </button>

          {/* ✅ Timetable BEFORE Settings */}
          <button
            onClick={() => router.push("/admin/timetable")}
            className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-indigo-700"
          >
            <Calendar size={18} />  Timetable
          </button>
<button
  onClick={() => router.push("/admin/roomwise-timetable")}
 className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-indigo-700"
          >
          
  <Calendar size={18} /> View Room Wise Timetable
</button>
          {/* ✅ Settings LAST */}
          
        </div>

        {/* ✅ Logout bottom */}
        <div className="mt-auto pt-10">
          <button
            onClick={handleLogout}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Logout
          </button>
        </div>

      </div>

      {/* ⚪ RIGHT SIDE */}
      <div className="w-3/4 bg-gray-100 p-8 overflow-auto">

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>

            <div className="bg-white p-6 rounded-xl shadow">
              <div className="grid grid-cols-3 gap-6">

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-700">Total Teachers</h3>
                  <p className="text-2xl font-bold text-indigo-600">{totalTeachers}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-700">Total Courses</h3>
                  <p className="text-2xl font-bold text-purple-600">{totalCourses}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-bold text-gray-700">Total Timetables</h3>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>

              </div>
            </div>

            
          </div>
        )}

        {active === "teachers" && <TeachersPage />}
        {active === "courses" && <CoursesPage />}
        {active === "rooms" && <RoomsPage />}
        {active === "timeslots" && <TimeSlotsPage />}
        

      </div>
    </div>
  );
}