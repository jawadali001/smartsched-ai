"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RoomView() {

  const [data, setData] = useState<any[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const lectures = [1,2,3,4,5,6];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase.from("timetable").select("*");

    if (data) {
      setData(data);

      const uniqueRooms = [...new Set(data.map(t => t.room_name))];
      setRooms(uniqueRooms);
    }
  };

  const getSlot = (day:any, slot:any, room:any) => {
    return data.find(t =>
      t.day === day &&
      t.slot === slot &&
      t.room_name === room
    );
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-4">Room Wise Timetable</h1>

      {rooms.map((room, i) => (

        <div key={i} className="mb-8 bg-white p-4 rounded shadow">

          <h2 className="font-bold mb-2">{room}</h2>

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

                    const slot = getSlot(day, l, room);

                    return (
                      <td key={l} className="border p-2 text-xs">
                        {slot?.course_name || "-"} <br/>
                        BSCS-{slot?.batch_id || ""} <br/>
                        {slot?.teacher_name || ""}
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