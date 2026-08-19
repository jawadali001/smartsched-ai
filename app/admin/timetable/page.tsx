"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateMasterTimetable } from "@/lib/masterGenerator";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useRef } from "react";


export default function TimetablePage() {
const groupedByBatch = () => {
  const grouped: any = {};

  timetableData.forEach((t) => {
    const batch = getBatchName(t.batch_id);

    if (!grouped[batch]) {
      grouped[batch] = [];
    }

    grouped[batch].push(t);
  });

  return grouped;
};
const [active, setActive] = useState("");
const tableRef = useRef(null);
const [timetableData, setTimetableData] = useState<any[]>([]);

const [courses, setCourses] = useState<any[]>([]);
const [rooms, setRooms] = useState<any[]>([]
);
const [batches, setBatches] = useState<any[]>([]);
const [teachers, setTeachers] = useState<any[]>([]);

const [showTable, setShowTable] = useState(false);

const router = useRouter();

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
const lectures = [1,2,3,4,5,6];

const generateMaster = async () => {

  const { data: teachers } = await supabase.from("teachers").select("*");
  const { data: courses } = await supabase.from("courses").select("*");
  const { data: batches } = await supabase.from("batches").select("*");
  const { data: rooms } = await supabase.from("rooms").select("*");

  if (!teachers?.length || !courses?.length || !batches?.length || !rooms?.length) {
    alert("Missing data ❌");
    return;
  }

const generated = await generateMasterTimetable({
  teachers,
  courses,
  batches,
  rooms,
  days,
  slots: lectures
});

setTimetableData(generated || []);

  await supabase.from("timetable").delete().gt("id", 0);
  await supabase.from("timetable").insert(generated);

  setTimetableData(generated);
  setCourses(courses || []);
  setBatches(batches || []);
  setRooms(rooms || []);
  setTeachers(teachers || []);

  setActive("room");
  setShowTable(true);

  alert("Master Timetable Generated Successfully ✅");
};

const getTeacherName = (id:any) => {
  if (typeof id === "string") return id;
  return teachers.find(t => String(t.id) === String(id))?.name || "";
};

const getCourseName = (id:any) => {
  if (typeof id === "string") return id;
  return courses.find(c => String(c.id) === String(id))?.name || "";
};

const getBatchName = (id:any) => {
  const index = batches.findIndex(b => String(b.id) === String(id));
  return index === -1 ? "" : `BSCS-${index + 1}`;
};

const getRoomName = (id:any) => {
  if (typeof id === "string") return id;
  return rooms.find(r => String(r.id) === String(id))?.name || "";
};
const exportPDF = () => {
  if (!timetableData || timetableData.length === 0) {
    alert("No data to export");
    return;
  }

  const doc = new jsPDF();
  let y = 10;

  const grouped = groupedByBatch();

  const timeHeaders = [
    "8:30-10:00",
    "10:00-11:30",
    "11:30-1:00",
    "BREAK",
    "1:30-3:00",
    "3:00-4:30",
  ];

  Object.keys(grouped).forEach((batch) => {

    doc.setFontSize(14);
    doc.text(`Master Timetable - ${batch}`, 14, y);
    y += 6;

    autoTable(doc, {
      startY: y,

      head: [[
        "Day",
        "L1\n8:30-10:00",
        "L2\n10:00-11:30",
        "L3\n11:30-1:00",
        "BREAK\n1:00-1:30",
        "L5\n1:30-3:00",
        "L6\n3:00-4:30",
      ]],

      body: days.map((day) => {
        const rows = grouped[batch].filter((t: any) => t.day === day);

        const getSlot = (slot: number) =>
          rows.find((r: any) => r.slot === slot);

        const formatCell = (t: any) => {
          if (!t) return "-";

          return `${getCourseName(t.course_id)}
${getTeacherName(t.teacher_id)}
${getRoomName(t.room_id)}`;
        };

        return [
          day,

          formatCell(getSlot(1)),
          formatCell(getSlot(2)),
          formatCell(getSlot(3)),

          "BREAK",

          formatCell(getSlot(5)),
          formatCell(getSlot(6)),
        ];
      }),

      styles: {
        fontSize: 7,
        cellPadding: 2,
        valign: "middle",
      },

      theme: "grid",
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  });

  doc.save("master-timetable.pdf");
};
const exportExcel = () => {
  if (!timetableData || timetableData.length === 0) {
    alert("No data to export");
    return;
  }

  const grouped = groupedByBatch();

  const finalData: any[] = [];

  Object.keys(grouped).forEach((batch) => {
    days.forEach((day) => {
      const row = grouped[batch].filter((t: any) => t.day === day);

      const getSlot = (slot: number) =>
        row.find((r: any) => r.slot === slot);

      finalData.push({
        Batch: batch,
        Day: day,
        L1: getCourseName(getSlot(1)?.course_id),
        L2: getCourseName(getSlot(2)?.course_id),
        L3: getCourseName(getSlot(3)?.course_id),
        Break: "BREAK",
        L5: getCourseName(getSlot(5)?.course_id),
        L6: getCourseName(getSlot(6)?.course_id),
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(finalData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Timetable");
  XLSX.writeFile(workbook, "master-timetable.xlsx");
};
return (

<div className="flex h-screen">

  <div className="w-1/4 bg-gradient-to-b from-blue-600 to-purple-700 text-white p-6">

    <div className="flex items-center gap-2 mb-10">
      <button
        onClick={() => router.push("/admin/dashboard")}
        className="bg-white text-blue-600 p-1 rounded"
      >
        <ArrowLeft size={18} />
      </button>

      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Calendar /> Timetable Panel
      </h1>
    </div>

    <button 
      onClick={() => setActive("master")}
      className="p-2 rounded hover:bg-white hover:text-blue-700"
    >
      Generate Master Timetable
    </button>

  </div>

  <div className="w-3/4 bg-gray-100 p-8 overflow-auto">

    {active === "master" && (
      <div className="bg-white p-6 rounded-xl shadow text-center">

        <div className="bg-blue-600 text-white p-4 rounded mb-6">
          <h2 className="text-xl font-bold">Timetable Module</h2>
        </div>

        <button
          onClick={generateMaster}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Generate Timetable
        </button>

      </div>
    )}

    {active === "room" && (
      <div>

        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">
            CUI Online CS Department Timetable Schedule
          </h1>
           <button
    onClick={exportPDF}
    className="px-4 py-2 bg-purple-600 text-white rounded"
  >
    📄 Export PDF
  </button>
<button onClick={exportExcel}
className="px-4 py-2 bg-blue-600 text-white rounded">
  Export Excel
</button>
        </div>

        {showTable && batches.map((batch:any) => (
          <div key={batch.id} className="mb-10 bg-white p-4 rounded shadow">

            <h2 className="text-xl font-bold text-center mb-4">
              {getBatchName(batch.id)}
            </h2>
 
<div ref={tableRef}>
  
            <table className="w-full border text-sm table-fixed">

              <thead>
                <tr>
                  <th className="border p-2">Day</th>

                  {lectures.map(l => (
                    <th key={l} className="border p-2 text-center w-32">

                      {l === 1 && <>Lecture 1<br />8:30 - 10:00</>}
                      {l === 2 && <>Lecture 2<br />10:00 - 11:30</>}
                      {l === 3 && <>Lecture 3<br />11:30 - 1:00</>}
                      {l === 4 && <div className="bg-gray-400">BREAK<br />1:00 - 1:30</div>}
                      {l === 5 && <>Lecture 5<br />1:30 - 3:00</>}
                      {l === 6 && <>Lecture 6<br />3:00 - 4:30</>}

                    </th>
                  ))}

                </tr>
              </thead>

              <tbody>

                {days.map(day => (
                  <tr key={day}>
                    <td className="border p-2">{day}</td>

                    {lectures.map(l => {

                      if (l === 4) {
                        return (
                          <td key={l} className="border p-2 text-center">
                            BREAK
                          </td>
                        );
                      }

                    const slot = (timetableData || []).find(t =>
  String(t.batch_id) === String(batch.id) &&
  t.day === day &&
  t.slot === l
);

                      return (
                        <td key={l} className="border p-2">

                          <div className="text-xs text-green-600">
                            {getTeacherName(slot?.teacher_id)}
                          </div>

                          <div className="text-center">
                            {getCourseName(slot?.course_id)}
                          </div>

                          <div className="text-xs text-blue-600">
                            {getRoomName(slot?.room_id)}
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
        ))}

      </div>
    )}

  </div>
</div>

);
}