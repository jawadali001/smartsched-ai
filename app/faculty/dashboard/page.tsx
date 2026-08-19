"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { useRef } from "react";

export default function FacultyDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [active, setActive] = useState("dashboard");
  const [timetable, setTimetable] = useState<any[]>([]);
const [courses, setCourses] = useState<any[]>([]);
const [rooms, setRooms] = useState<any[]>([]);
const [batches, setBatches] = useState<any[]>([]);
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const slots = [1,2,3,4,5,6];
  const tableRef = useRef(null);

const getCourse = (id:any) =>
  courses.find((c:any) => c.id == id)?.name || "";

const getRoom = (id:any) =>
  rooms.find((r:any) => r.id == id)?.name || "";

const getBatch = (id:any) =>
  batches.find((b:any) => b.id == id)?.name || "";
 
 useEffect(() => {
  try {
    const stored = localStorage.getItem("teacher");

    if (!stored) return;

    const parsed = JSON.parse(stored);

    if (parsed?.id) {
      setTeacher(parsed);
    }
  } catch (e) {
    console.log("Teacher load error:", e);
  }
}, []);

  // 🔥 FETCH TIMETABLE
useEffect(() => {
  if (!teacher?.id) return;

  const fetchData = async () => {
    console.log("Teacher ID:", teacher?.id);

    // 🔥 TIMETABLE FETCH
    const { data, error } = await supabase
      .from("timetable")
      .select("*")
      .eq("teacher_id", teacher.id);


    if (error) {
      console.log(error);
      return;
    }

    setTimetable(data || []);

    // 🔥 👉 YEH NAYA CODE ADD KARNA HAI (YAHI PROBLEM THI)
    const { data: c } = await supabase.from("courses").select("*");
    const { data: r } = await supabase.from("rooms").select("*");
    const { data: b } = await supabase.from("batches").select("*");

    setCourses(c || []);
    setRooms(r || []);
    setBatches(b || []);
  };

  fetchData();
}, [teacher?.id]);
const exportPNG = async () => {
  if (!tableRef.current) return;

  try {
    const dataUrl = await toPng(tableRef.current, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = `${teacher?.name || "timetable"}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.log("Export Error:", err);
  }
};
  return (
<div className="flex min-h-screen bg-gray-100 relative">
      {/* 🔵 SIDEBAR */}
    <div className="w-1/4 bg-indigo-700 text-white p-5 relative z-10">

        <button
          onClick={() => router.push("/faculty/login")}
          className="text-sm mb-4"
        >
          ⬅ 
        </button>

        <h1 className="text-xl font-bold mb-6">
          Faculty Panel
        </h1>

        <button
          onClick={() => setActive("dashboard")}
          className="block w-full text-left p-2 hover:bg-indigo-600"
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => setActive("timetable")}
          className="block w-full text-left p-2 hover:bg-indigo-600"
        >
          📅 My Timetable
        </button>

      </div>

      {/* ⚪ MAIN AREA */}
      <div className="w-3/4 p-6 bg-gray-100 overflow-auto relative z-0">

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="bg-white p-4 shadow mb-4">
            <h1 className="text-xl font-bold">
              {teacher?.name
                ? `This is your Dashboard, ${teacher.name}`
                : "Loading teacher data..."}
            </h1>
          </div>
        )}

        {/* TIMETABLE */}
        {active === "timetable" && (
          <div>
<button
  onClick={exportPNG}
  className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
>
  📤 Export PNG
</button>
            {/* HEADER FIX */}
            <h2 className="text-2xl font-bold text-center mb-2">
  {teacher?.name ? `${teacher.name} - Timetable` : "Loading..."}
</h2>

<p className="text-center text-gray-500 mb-6">
  Your weekly schedule view
</p>
<div ref={tableRef}>

            {/* GRID TABLE */}
            <table className="w-full border text-xs">

              {/* 🔥 LECTURE HEADER ROW */}
              <thead>
                <tr>
                  <th className="border p-2">Days</th>
                  <th className="border p-2">Lecture 1<br/>8:30-10:00</th>
                  <th className="border p-2">Lecture 2<br/>10:00-11:30</th>
                  <th className="border p-2">Lecture 3<br/>11:30-1:00</th>
                  <th className="border p-2">BREAK</th>
                  <th className="border p-2">Lecture 5<br/>1:30-3:00</th>
                  <th className="border p-2">Lecture 6<br/>3:00-4:30</th>
                </tr>
              </thead>

              <tbody>
                {days.map(day => (
                  <tr key={day}>
                    <td className="border p-2 font-bold">{day}</td>

                    {slots.map(slot => {

                      // BREAK SLOT
                   if (Number(slot) === 4) {
  return (
    <td key={slot} className="border text-center bg-gray-200">
      BREAK
    </td>
  );
}
                   const entry = timetable.find((t) => {
  return (
    String(t.teacher_id) === String(teacher.id) &&
    String(t.day).toLowerCase() === day.toLowerCase() &&
    Number(t.slot) === Number(slot)
  );
});
                      return (
                 <td key={slot} className="border p-2 relative h-20">

  {/* SUBJECT (CENTER) */}
  <div className="flex items-center justify-center h-full font-semibold">
    {entry ? getCourse(entry.course_id) : "-"}
  </div>

  {/* TOP RIGHT (BATCH) */}
  <div className="absolute top-1 right-1 text-[10px] text-blue-600">
    {entry ? getBatch(entry.batch_id) : ""}
  </div>

  {/* BOTTOM LEFT (ROOM / LT) */}
  <div className="absolute bottom-1 left-1 text-[10px] text-gray-600">
    {entry ? getRoom(entry.room_id) : ""}
  </div>

</td>
                      );
                    })}

                  </tr>
                ))}
              </tbody>

            </table>
</div>
          </div>
        )}

      </div>
    </div>
  );
}