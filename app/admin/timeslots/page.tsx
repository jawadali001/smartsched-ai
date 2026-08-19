"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TimeSlotsPage() {

  const [slots, setSlots] = useState<any[]>([]);

  const [form, setForm] = useState({
    id: "",
    start_time: "",
    end_time: "",
    day: "",
    day_id: "",
    lecture_no: "",
    is_break: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    const { data } = await supabase
      .from("timeslots")
      .select("*")
      .order("id");

    setSlots(data || []);
  }

  // ✅ ADD
  async function addSlot() {
    const { error } = await supabase.from("timeslots").insert([
      {
        id: Number(form.id), // ✅ ID added
        start_time: form.start_time,
        end_time: form.end_time,
        day: form.day,
        day_id: Number(form.day_id),
        lecture_no: Number(form.lecture_no),
        is_break: form.is_break === "true",
      },
    ]);

    if (!error) {
      resetForm();
      fetchSlots();
    }
  }

  async function deleteSlot(id: number) {
    await supabase.from("timeslots").delete().eq("id", id);
    fetchSlots();
  }

  function editSlot(s: any) {
    setForm({
      id: String(s.id),
      start_time: s.start_time,
      end_time: s.end_time,
      day: s.day,
      day_id: s.day_id,
      lecture_no: s.lecture_no,
      is_break: s.is_break ? "true" : "false",
    });
    setEditMode(true);
  }

  async function updateSlot() {
    if (!editMode) return;

    await supabase
      .from("timeslots")
      .update({
        start_time: form.start_time,
        end_time: form.end_time,
        day: form.day,
        day_id: Number(form.day_id),
        lecture_no: Number(form.lecture_no),
        is_break: form.is_break === "true",
      })
      .eq("id", form.id);

    resetForm();
    setEditMode(false);
    fetchSlots();
  }

  function resetForm() {
    setForm({
      id: "",
      start_time: "",
      end_time: "",
      day: "",
      day_id: "",
      lecture_no: "",
      is_break: "",
    });
    setEditMode(false);
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* 🔵 LEFT PANEL (NEW) */}
      <div className="w-1/5 bg-blue-700 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

        <div className="bg-white text-blue-700 p-2 rounded">
          Time Slots
        </div>
      </div>

      {/* ⚪ RIGHT SIDE */}
      <div className="w-4/5 p-6 overflow-auto">

        {/* HEADER */}
        <div className="bg-blue-600 text-white text-center py-3 rounded-lg text-2xl font-bold mb-6">
          TIMESLOTS
        </div>

        {/* FORM */}
        <div className="bg-white p-5 rounded shadow-md">

          {/* ID */}
          <div className="mb-2">
            <label className="font-semibold">ID</label>
            <input
              className="border w-full p-2"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
          </div>

          {/* START TIME */}
          <div className="mb-2">
            <label className="font-semibold">Start Time</label>
            <input
              className="border w-full p-2"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            />
          </div>

          {/* END TIME */}
          <div className="mb-2">
            <label className="font-semibold">End Time</label>
            <input
              className="border w-full p-2"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            />
          </div>

          {/* DAY */}
          <div className="mb-2">
            <label className="font-semibold">Day</label>
            <input
              className="border w-full p-2"
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
            />
          </div>

          {/* DAY ID */}
          <div className="mb-2">
            <label className="font-semibold">Day ID</label>
            <input
              className="border w-full p-2"
              value={form.day_id}
              onChange={(e) => setForm({ ...form, day_id: e.target.value })}
            />
          </div>

          {/* LECTURE NO */}
          <div className="mb-2">
            <label className="font-semibold">Lecture No</label>
            <input
              className="border w-full p-2"
              value={form.lecture_no}
              onChange={(e) => setForm({ ...form, lecture_no: e.target.value })}
            />
          </div>

          {/* IS BREAK */}
          <div className="mb-2">
            <label className="font-semibold">Is Break (true/false)</label>
            <input
              className="border w-full p-2"
              value={form.is_break}
              onChange={(e) => setForm({ ...form, is_break: e.target.value })}
            />
          </div>

          <button
            onClick={addSlot}
            className="bg-green-600 text-white px-6 py-2 w-full mt-2"
          >
            Add TimeSlot
          </button>

          <button
            onClick={updateSlot}
            className="bg-blue-600 text-white px-6 py-2 w-full mt-2"
          >
            Update TimeSlot
          </button>

          <button
            onClick={resetForm}
            className="bg-gray-500 text-white px-6 py-2 w-full mt-2"
          >
            Clear
          </button>
        </div>

        {/* TABLE (UNCHANGED) */}
        <div className="mt-6 bg-white p-4 rounded shadow-md overflow-x-auto">

          <table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th>ID</th>
                <th>Start</th>
                <th>End</th>
                <th>Day</th>
                <th>Day ID</th>
                <th>Lecture</th>
                <th>Break</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {slots.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.start_time}</td>
                  <td>{s.end_time}</td>
                  <td>{s.day}</td>
                  <td>{s.day_id}</td>
                  <td>{s.lecture_no}</td>
                  <td>{s.is_break ? "True" : "False"}</td>

                  <td>
                    <button
                      onClick={() => editSlot(s)}
                      className="bg-yellow-500 text-white px-2 py-1 mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteSlot(s.id)}
                      className="bg-red-600 text-white px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}