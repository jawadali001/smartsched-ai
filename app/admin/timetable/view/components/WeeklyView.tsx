"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WeeklyView() {

  const [data, setData] = useState<any[]>([]);
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const lectures = [1,2,3,4,5,6];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("timetable").select("*");
    if (data) setData(data);
  };

  const getSlot = (day:any, slot:any, batch:any) => {
    return data.find(t =>
      t.day === day &&
      t.slot === slot &&
      String(t.batch_id) === String(batch)
    );
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4 text-center">
        Weekly Timetable
      </h1>

      {[1,2,3,4,5,6,7,8].map(batch => (

        <div key={batch} className="mb-8 bg-white p-4 rounded shadow">

          <h2 className="text-lg font-bold mb-2">BSCS-{batch}</h2>

          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th className="border p-2">Day</th>
                {lectures.map(l => (
                  <th key={l} className="border p-2">L{l}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td className="border p-2">{day}</td>

                  {lectures.map(l => {

                    if (l === 4) {
                      return <td key={l} className="border p-2">BREAK</td>;
                    }

                    const slot = getSlot(day, l, batch);

                    return (
                      <td key={l} className="border p-2 text-xs">
                        {slot?.course_name || "-"} <br/>
                        {slot?.teacher_name || ""} <br/>
                        {slot?.room_name || ""}
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
  );
}