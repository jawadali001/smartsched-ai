"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TeacherTimetablePage() {

  const [teachers, setTeachers] = useState<any[]>([]);
  const [timetableData, setTimetableData] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [show, setShow] = useState(false);

  const router = useRouter();

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const lectures = [1,2,3,4,5,6];

  const lectureTimes:any = {
    1: "8:30 - 10:00",
    2: "10:00 - 11:30",
    3: "11:30 - 1:00",
    4: "Break",
    5: "1:30 - 3:00",
    6: "3:00 - 4:30"
  };

  // 🔥 LOAD FROM MASTER TIMETABLE
  const loadTeacherTimetable = async () => {

    const { data: teacherData } = await supabase.from("teachers").select("*");
    const { data: timetable } = await supabase.from("timetable").select("*");
    const { data: courseData } = await supabase.from("courses").select("*");
    const { data: roomData } = await supabase.from("rooms").select("*");
    const { data: batchData } = await supabase.from("batches").select("*");

    if (!timetable || timetable.length === 0) {
      alert("Generate Master Timetable first ❌");
      return;
    }

    // ✅ UNIQUE TEACHERS ONLY
    const uniqueTeachers = Array.from(
      new Map((teacherData || []).map((t:any) => [t.id, t])).values()
    );

    setTeachers(uniqueTeachers);
    setTimetableData(timetable);
    setCourses(courseData || []);
    setRooms(roomData || []);
    setBatches(batchData || []);

    setShow(true);
  };

  const getCourse = (id:any) =>
    courses.find(c => String(c.id) === String(id));

  const getRoom = (id:any) =>
    rooms.find(r => String(r.id) === String(id));

  const getBatch = (id:any) =>
    batches.find(b => String(b.id) === String(id));

  const getSlot = (teacherId:any, day:any, lecture:any) => {
    return timetableData.find(t =>
      String(t.teacher_id) === String(teacherId) &&
      String(t.day).toLowerCase().trim() === day.toLowerCase().trim() &&
      (
        Number(t.slot) === Number(lecture) ||
        Number(t.lecture_no) === Number(lecture)
      )
    );
  };

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-1/4 bg-blue-600 text-white p-6">

        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.push("/admin/timetable")}
            className="bg-white text-blue-600 p-1 rounded"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-xl font-bold flex items-center gap-2">
            <User /> Teacher Panel
          </h1>
        </div>

      </div>

      {/* MAIN */}
      <div className="w-3/4 bg-gray-100 p-8 overflow-auto">

        <div className="bg-white p-6 rounded shadow text-center mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Teacher Wise Timetable
          </h2>

          <button
            onClick={loadTeacherTimetable}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Load Timetable
          </button>
        </div>

        {show && teachers.map((teacher:any) => (

          <div key={teacher.id} className="mb-10 bg-white p-4 shadow rounded">

            <h2 className="text-xl font-bold text-center mb-4">
              {teacher.name}
            </h2>

            <table className="w-full border text-sm">
              <thead>
                <tr>
                  <th className="border p-2">Day</th>

                  {lectures.map(l => (
                    <th key={l} className="border p-2 text-center">
                      <div className="font-bold">L{l}</div>
                      <div className="text-xs">{lectureTimes[l]}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {days.map(day => (
                  <tr key={day}>
                    <td className="border p-2 font-bold">{day}</td>

                    {lectures.map(l => {

                      if (l === 4) {
                        return (
                          <td key={l} className="border text-center bg-gray-200">
                            Break
                          </td>
                        );
                      }

                      const slot = getSlot(teacher.id, day, l);

                      return (
                        <td key={l} className="border h-24 relative">

                          {/* BATCH */}
                          <div className="absolute top-1 right-1 text-[10px] text-blue-600 font-bold">
                            {slot ? getBatch(slot.batch_id)?.name : ""}
                          </div>

                          {/* ROOM */}
                          <div className="absolute bottom-1 left-1 text-[10px] text-green-600 font-bold">
                            {slot ? getRoom(slot.room_id)?.name : ""}
                          </div>

                          {/* SUBJECT */}
                          <div className="flex items-center justify-center h-full text-sm font-semibold text-center">
                            {slot ? getCourse(slot.course_id)?.name : ""}
                          </div>

                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        ))}

      </div>
    </div>
  );
}