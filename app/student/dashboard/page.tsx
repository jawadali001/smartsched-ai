"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";

export default function StudentDashboard() {
  const router = useRouter();

  const [student, setStudent] = useState<any>(null);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [active, setActive] = useState("dashboard");

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const slots = [1,2,3,4,5,6];
  const [courses, setCourses] = useState<any[]>([]);
const [rooms, setRooms] = useState<any[]>([]);

const [teachers, setTeachers] = useState<any[]>([]);
const [batches, setBatches] = useState<any[]>([]);

  // 🔥 LOAD STUDENT
  useEffect(() => {
    const data = localStorage.getItem("student");

    if (!data) {
      router.push("/student/login");
      return;
    }

    setStudent(JSON.parse(data));
  }, []);

  // 🔥 FETCH TIMETABLE (IMPORTANT FILTER)
 useEffect(() => {
  if (!student?.batch) return;

  const fetchData = async () => {

    // 🔥 ALL DATA FETCH
    const { data: c } = await supabase.from("courses").select("*");
    const { data: r } = await supabase.from("rooms").select("*");
    const { data: t } = await supabase.from("teachers").select("*");
    const { data: b } = await supabase.from("batches").select("*");

    setCourses(c || []);
    setRooms(r || []);
    setTeachers(t || []);
    setBatches(b || []);

    // 🔥 FIND batch id
    const batchObj = b?.find(
  (item:any) => item.semester === student.batch
);

    if (!batchObj) {
      console.log("Batch not found ❌");
      return;
    }

    console.log("Batch ID:", batchObj.id);

    // 🔥 TIMETABLE FILTER
    const { data, error } = await supabase
      .from("timetable")
      .select("*")
      .eq("batch_id", batchObj.id)

    if (error) {
      console.log(error);
      return;
    }

    console.log("TIMETABLE DATA:", data);

    setTimetable(data || []);
  };

  fetchData();
}, [student]);

  const getCourseName = (id:any) => {
  return courses.find(c => String(c.id) === String(id))?.name || "";
};

const getTeacherName = (id:any) => {
  return teachers.find(t => String(t.id) === String(id))?.name || "";
};

const getRoomName = (id:any) => {
  return rooms.find(r => String(r.id) === String(id))?.name || "";
};
const exportPNG = async () => {
  const table = document.getElementById("program-timetable");

  if (!table) {
    console.log("❌ Table not found in DOM");
    return;
  }

  try {
    // wait for rendering stability
    await new Promise(res => setTimeout(res, 300));

    const dataUrl = await toPng(table as HTMLElement, {
      backgroundColor: "#ffffff",
      pixelRatio: 3,
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = "program-timetable.png";
    link.href = dataUrl;
    link.click();

  } catch (err) {
    console.error("❌ Export failed:", err);
  }
};
  return (
    <div className="flex h-screen">

      {/* 🔵 SIDEBAR */}
      <div className="w-1/4 bg-indigo-700 text-white p-5">

  {/* 🔙 BACK BUTTON */}
  <button
    onClick={() => router.push("/student/login")}
    className="mb-4"
  >
    ⬅
  </button>

  {/* TITLE */}
  <h1 className="text-lg font-bold mb-6">
    Student Panel
  </h1>

  {/* MENU */}
  <div className="flex flex-col gap-3">

    <button
      onClick={() => setActive("dashboard")}
      className="text-left p-2 hover:bg-indigo-600"
    >
      📊 Dashboard
    </button>

    <button
      onClick={() => setActive("timetable")}
      className="text-left p-2 hover:bg-indigo-600"
    >
      📅 My Timetable
    </button>

  </div>
</div>

      {/* ⚪ MAIN */}
      <div className="w-3/4 p-6 bg-white min-h-screen">

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <h1 className="text-2xl font-bold">
           This is your  Dashboard  {student?.batch} to view your timetable.
          </h1>
        )}

        {/* TIMETABLE */}
        {active === "timetable" && (

          <div>


    {/* HEADER */}
    <h2 className="text-2xl font-bold text-center mb-6">
      {student?.batch} - Timetable
    </h2>
<button
  onClick={exportPNG}
  className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
>
  Export PNG
</button>
    
<table
  id="program-timetable"
  className="w-full border text-xs table-fixed"
>
      {/* HEADER ROW */}
      <thead>
        <tr>
          <th className="border p-2">Day</th>

          <th className="border p-2">
            Lecture 1</th> <b></b>
          <th className="border p-2 bg-gray-200">
            BREAK<br/>1:00 - 1:30
          </th>

          <th className="border p-2">
            Lecture 5<br/>1:30 - 3:00
          </th>

          <th className="border p-2">
            Lecture 6<br/>3:00 - 4:30
          </th>
        </tr>
      </thead>
<th/>
      <tbody>

        {days.map(day => (
          <tr key={day}>
            <td className="border p-2 font-bold">{day}</td>

            {slots.map(slot => {

              // BREAK
              if (slot === 4) {
                return (
                  <td key={slot} className="border text-center bg-gray-200">
                    BREAK
                  </td>
                );
              }

              const entry = timetable.find(t =>
                t.day === day &&
                Number(t.slot) === Number(slot)
              );

              return (
                <td key={slot} className="border relative h-20 p-1">

                  {/* CENTER → COURSE */}
                  <div className="flex items-center justify-center h-full text-center font-semibold">
                    {entry ? getCourseName(entry.course_id) : "-"}
                  </div>

                  {/* TOP RIGHT → ROOM */}
                  <div className="absolute top-1 right-1 text-[10px] text-blue-600">
                    {entry ? getRoomName(entry.room_id) : ""}
                  </div>

                  {/* BOTTOM LEFT → TEACHER */}
                  <div className="absolute bottom-1 left-1 text-[10px] text-gray-700">
                    {entry ? getTeacherName(entry.teacher_id) : ""}
                  </div>

                </td>
              );
            })}

          </tr>
        ))}

      </tbody>

    </table>

  </div>
)}
          </div>
        

      </div>
    
  );
}