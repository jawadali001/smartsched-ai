"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TeacherView() {

  const [data, setData] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("timetable").select("*");
    if (data) {
      setData(data);

      const uniqueTeachers = [...new Set(data.map(t => t.teacher_name))];
      setTeachers(uniqueTeachers.slice(0, 10)); // 🔥 only 10 teachers
    }
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">Teacher Timetable</h1>

      {teachers.map((teacher, i) => {

        const teacherData = data.filter(t => t.teacher_name === teacher);

        return (
          <div key={i} className="mb-6 p-4 border rounded">

            <h2 className="font-bold mb-2">{teacher}</h2>

            {teacherData.map((t, index) => (
              <div key={index} className="text-sm">
                {t.day} | L{t.slot} | {t.course_name} | BSCS-{t.batch_id} | {t.room_name}
              </div>
            ))}

          </div>
        );
      })}

    </div>
  );
}