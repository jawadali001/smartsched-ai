"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function RoomTimetable() {
  const router = useRouter();

  const [active, setActive] = useState("timetable");
  const [timetable, setTimetable] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
const sortRooms = (roomsList: any[]) => {
  return roomsList.sort((a, b) => {
    const getOrder = (name: string) => {
      if (name.startsWith("LT")) return 1;
      if (name.startsWith("LAB")) return 2;
      return 3;
    };

    const typeA = getOrder(a.name);
    const typeB = getOrder(b.name);

    if (typeA !== typeB) return typeA - typeB;

    // number extract (LT-1, LAB-5 etc)
    const numA = parseInt(a.name.split("-")[1]);
    const numB = parseInt(b.name.split("-")[1]);

    return numA - numB;
  });
};
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const slots = [1,2,3,4,5,6];

  const slotTimes: Record<number,string> = {
    1:"8:30 - 10:00",
    2:"10:00 - 11:30",
    3:"11:30 - 1:00",
    4:"1:00 - 1:30",
    5:"1:30 - 3:00",
    6:"3:00 - 4:30",
  };

  // ✅ FETCH TIMETABLE WITH RELATIONS
  const fetchTimetable = async () => {
    const { data, error } = await supabase
      .from("timetable")
      .select(`
        id,
        day,
        slot,
        room_id,
        batch:batches(name),
        teacher:teachers(name),
        course:courses(name)
      `);

    if (error) {
      console.error("Timetable Error:", error);
    } else {
      setTimetable(data || []);
    }
  };

  // ✅ FETCH ROOMS (IMPORTANT FIX)
  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("id, name");

    if (error) {
      console.error("Rooms Error:", error);
    } else {
   setRooms(sortRooms(data || []));
    }
  };

  // ✅ CALL BOTH FUNCTIONS
  useEffect(() => {
    fetchTimetable();
    fetchRooms();
  }, []);

  // ✅ FIXED MATCHING (ID use hoga name nahi)
  const getEntry = (roomId: number, day: string, slot: number) => {
    return timetable.find(
      (t) =>
        t.room_id === roomId &&
        String(t.day).toLowerCase() === day.toLowerCase() &&
        Number(t.slot) === slot
    );
  };
  const exportPDF = () => {
  const doc = new jsPDF();

  let y = 10;

  rooms.forEach((room) => {
    doc.setFontSize(12);
    doc.text(room.name, 10, y);
    y += 5;

    const tableData: (string | number)[][] = [];

    days.forEach((day) => {
      const row: any[] = [day];

      slots.forEach((slot) => {
        if (slot === 4) {
          row.push("BREAK");
        } else {
          const entry = getEntry(room.id, day, slot);

          if (entry) {
            row.push(
              `${entry.course?.name || ""}\n${entry.teacher?.name || ""}\n${entry.batch?.name || ""}`
            );
          } else {
            row.push("-");
          }
        }
      });

      tableData.push(row);
    });

    autoTable(doc, {
      startY: y,
      head: [[
        "Day",
        "L1","L2","L3","Break","L5","L6"
      ]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 6 },
    });
y = (doc as any).lastAutoTable.finalY + 10;

    // page break
    if (y > 250) {
      doc.addPage();
      y = 10;
    }
  });

  doc.save("Room_Timetable.pdf");
};

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-1/4 bg-indigo-700 text-white p-5">

        <button onClick={() => router.push("/admin/dashboard")}>
          ⬅
        </button>

        <h1 className="text-lg font-bold mb-6">
          Room Timetable Panel
        </h1>

        <button onClick={() => setActive("dashboard")} className="block mb-2">
          Dashboard
        </button>

        <button onClick={() => setActive("timetable")} className="block">
          Room Wise Timetable
        </button>
      </div>

      {/* MAIN */}
      <div className="w-3/4 p-6">

        {active === "dashboard" && (
          <h1 className="text-2xl font-bold mb-4">
            This is your Dashboard to view Roomwise-Timetable
          </h1>
        )}

        {active === "timetable" && (
          <div>

            <h1 className="text-2xl font-bold mb-4">
              View Room Wise Timetable
            </h1>
<button
  onClick={exportPDF}
  className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
>
  Export PDF
</button>
            {rooms.map((room) => (
              <div key={room.id} className="mb-10 border p-4">

                <h2 className="text-xl font-bold mb-2">
                  {room.name}
                </h2>

                <table className="w-full border text-xs">
                  <thead>
                    <tr>
                      <th>Day</th>
                      {slots.map(s => (
                        <th key={s}>
                          Lecture {s}
                          <br/>
                          {slotTimes[s]}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {days.map(day => (
                      <tr key={day}>
                        <td className="border p-2">{day}</td>

                        {slots.map(slot => {

                          // ✅ BREAK FIX
                          if (slot === 4) {
                            return (
                              <td key={slot} className="bg-gray-200 text-center">
                                BREAK
                              </td>
                            );
                          }

                          const entry = getEntry(room.id, day, slot);

                          return (
                            <td key={slot} className="border p-2 relative h-20">

                              {entry ? (
                                <>
                                  {/* SUBJECT */}
                                  <div className="font-semibold text-center">
                                    {entry.course?.name}
                                  </div>

                                  {/* BATCH */}
                                  <div className="absolute top-1 right-1 text-[10px]">
                                    {entry.batch?.name}
                                  </div>

                                  {/* TEACHER */}
                                  <div className="absolute bottom-1 left-1 text-[10px]">
                                    {entry.teacher?.name}
                                  </div>
                                </>
                              ) : (
                                <div className="text-center text-gray-400">
                                  -
                                </div>
                              )}

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
        )}

      </div>
    </div>
  );
}