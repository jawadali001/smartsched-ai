"use client";


import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function ProgramDashboard() {
  const router = useRouter();
  const batches = ["BSCS-1","BSCS-2","BSCS-3","BSCS-4","BSCS-5","BSCS-6","BSCS-7","BSCS-8"];

  const slotTimes: Record<number, string> = {
    1: "8:30 - 10:00",
    2: "10:00 - 11:30",
    3: "11:30 - 1:00",
    4: "1:00 - 1:30",
    5: "1:30 - 3:00",
    6: "3:00 - 4:30",
  };
const getEntry = (batch: string, day: string, slot: number) => {
  const batchNumber = Number(batch.split("-")[1]); // BSCS-1 → 1

  return timetable.find(
    (t) =>
      t.batch_id === batchNumber &&
      t.day === day &&
      Number(t.slot) === slot
  );
};
  const [active, setActive] = useState("dashboard");
 const [timetable, setTimetable] = useState<any[]>([]);

  const exportPDF = () => {
  const doc = new jsPDF();

  const tables = document.querySelectorAll(
    "#program-timetable table"
  );

  tables.forEach((table, index) => {
    // 👇 har batch new page par start ho (except first)
    if (index !== 0) {
      doc.addPage();
    }

    const title =
      table.parentElement?.querySelector("h2")?.innerText || "";

    // 👇 Title
    doc.text(title, 14, 15);

    autoTable(doc, {
      html: table as HTMLTableElement,
      startY: 20,

      styles: {
        fontSize: 7,
      },

      headStyles: {
        fillColor: [99, 102, 241],
      },

      // 👇 MOST IMPORTANT
      pageBreak: "avoid",   // ❌ table split nahi hogi
      theme: "grid",
    });
  });

  doc.save("program-timetable.pdf");
};
useEffect(() => {
  const fetchData = async () => {
   const { data, error } = await supabase
  .from("timetable")
  .select(`
    *,
    courses(name),
    teachers(name),
    rooms(name)
  `);

    if (error) {
      console.log(error);
      return;
    }

    setTimetable(data || []);
  };

  fetchData();
}, []);
  return (
    <div className="flex h-screen">

      {/* 🔵 SIDEBAR */}
     <div className="w-1/4 bg-indigo-700 text-white p-5 h-screen">

        <button
          onClick={() => router.push("/program/login")}
          className="mb-4"
        >
          ⬅
        </button>

        <h1 className="text-lg font-bold mb-6">
          Program Panel
        </h1>

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
      <div className="w-3/4 p-6 bg-white overflow-y-auto">

        {active === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold">
              This is your Dashboard for viewing Program Timetable
            </h1>
          </div>
        )}

        {active === "timetable" && (
          <div>

            <h2 className="text-2xl font-bold text-center mb-4">
             CUI ONLINE CS PROGRAM TIMETABLE.
            </h2>

            <button
              onClick={exportPDF}
              className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Export PDF
            </button>

            <div id="program-timetable" className="space-y-10">

              {batches.map((batch) => (

                <div key={batch} className="border p-4 bg-white">

                  <h2 className="text-xl font-bold mb-4">{batch}</h2>

                  <table className="w-full border text-xs">

                    <thead>
  <tr>
    <th className="border p-2">Day</th>

    <th className="border p-2">
      Lecture 1 <br />
      <span className="text-[10px] text-gray-500">8:30 - 10:00</span>
    </th>

    <th className="border p-2">
      Lecture 2 <br />
      <span className="text-[10px] text-gray-500">10:00 - 11:30</span>
    </th>

    <th className="border p-2">
      Lecture 3 <br />
      <span className="text-[10px] text-gray-500">11:30 - 1:00</span>
    </th>

    <th className="border p-2 bg-gray-200">
      Break <br />
      <span className="text-[10px] text-gray-500">1:00 - 1:30</span>
    </th>

    <th className="border p-2">
      Lecture 5 <br />
      <span className="text-[10px] text-gray-500">1:30 - 3:00</span>
    </th>

    <th className="border p-2">
      Lecture 6 <br />
      <span className="text-[10px] text-gray-500">3:00 - 4:30</span>
    </th>

  </tr>
</thead>
                    <tbody>
  {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(day => (
    <tr key={day}className="bg-white">
      <td className="border p-2 font-bold">{day}</td>

      {[1,2,3,4,5,6].map(slot => {

        if (slot === 4) {
          return (
            <td key={slot} className="border bg-gray-200 text-center">
              BREAK
            </td>
          );
        }

        const entry = getEntry(batch, day, slot);

        return (
          <td key={slot} className="border p-2 h-20 relative bg-white">

            {/* CENTER → SUBJECT */}
            <div className="flex items-center justify-center h-full font-semibold text-center">
           {entry?.courses?.name || ""}
            </div>

          

            {/* TOP RIGHT → TEACHER */}
            <div className="absolute top-1 right-1 text-[10px] text-blue-600">
            {entry?.teachers?.name || ""}
            </div>

            {/* BOTTOM LEFT → ROOM */}
            <div className="absolute bottom-1 left-1 text-[10px] text-gray-600">
         {entry?.rooms?.name || ""}
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
        )}

      </div>
    </div>
  );
}