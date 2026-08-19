"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TeacherPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    max_load: "",
    available_days: "",
    preferred_time: "",
  });

  const [editMode, setEditMode] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    fetchTeachers();
  }, []);
async function fetchTeachers() {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")
    .order("id", { ascending: true }); // ✅ FIX

  if (error) {
    console.log("Fetch Error:", error.message);
  } else {
    setTeachers(data || []);
  }
}

  // ================= ADD (FIXED) =================
  async function addTeacher() {
    if (!form.id || !form.name || !form.email) {
      alert("Please fill all required fields");
      return;
    }

    const { data, error } = await supabase.from("teachers").insert([
      {
        id: form.id,
        name: form.name,
        email: form.email,
        max_load: form.max_load,
        available_days: form.available_days,
        preferred_time: form.preferred_time,
      },
    ]);

    if (error) {
      console.log("Add Error:", error.message);
      alert("Error: " + error.message);
    } else {
      alert("Teacher Added Successfully ✅");
      resetForm();
      fetchTeachers();
    }
  }

  // ================= DELETE =================
  async function deleteTeacher(id: string) {
    const { error } = await supabase
      .from("teachers")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchTeachers();
    } else {
      console.log("Delete Error:", error.message);
    }
  }

  // ================= EDIT =================
  function editTeacher(t: any) {
    setForm(t);
    setEditMode(true);
  }

  // ================= UPDATE =================
  async function updateTeacher() {
    if (!editMode) {
      alert("Select a teacher first by clicking Edit");
      return;
    }

    const { error } = await supabase
      .from("teachers")
      .update({
        name: form.name,
        email: form.email,
        max_load: form.max_load,
        available_days: form.available_days,
        preferred_time: form.preferred_time,
      })
      .eq("id", form.id);

    if (!error) {
      resetForm();
      setEditMode(false);
      fetchTeachers();
    } else {
      console.log("Update Error:", error.message);
    }
  }

  function resetForm() {
    setForm({
      id: "",
      name: "",
      email: "",
      max_load: "",
      available_days: "",
      preferred_time: "",
    });
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-1/5 bg-blue-700 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <p className="bg-white text-blue-700 p-2 rounded font-semibold">
          Teachers
        </p>
      </div>

      {/* ================= RIGHT MAIN ================= */}
      <div className="w-4/5 p-6 overflow-auto">

        {/* ===== TOP BLUE TITLE BOX ===== */}
        <div className="bg-blue-600 text-white text-center py-3 rounded-lg text-2xl font-bold mb-6">
          TEACHERS
        </div>

        {/* ================= FORM ================= */}
        <div className="bg-white p-5 rounded shadow-md">

          {/* ID */}
          <div className="mb-3">
            <label className="font-semibold">ID</label>
            <input
              className="border w-full p-2"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />
          </div>

          {/* NAME */}
          <div className="mb-3">
            <label className="font-semibold">Name</label>
            <input
              className="border w-full p-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="font-semibold">Email</label>
            <input
              className="border w-full p-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* MAX LOAD */}
          <div className="mb-3">
            <label className="font-semibold">Maximum Load</label>
            <input
              className="border w-full p-2"
              value={form.max_load}
              onChange={(e) => setForm({ ...form, max_load: e.target.value })}
            />
          </div>

          {/* AVAILABLE DAYS */}
          <div className="mb-3">
            <label className="font-semibold">Available Days</label>
            <input
              className="border w-full p-2"
              value={form.available_days}
              onChange={(e) =>
                setForm({ ...form, available_days: e.target.value })
              }
            />
          </div>

          {/* PREFERRED TIME */}
          <div className="mb-3">
            <label className="font-semibold">Preferred Time</label>
            <input
              className="border w-full p-2"
              value={form.preferred_time}
              onChange={(e) =>
                setForm({ ...form, preferred_time: e.target.value })
              }
            />
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={addTeacher}
            className="bg-green-600 text-white px-6 py-2 rounded w-full mt-2"
          >
            Add Teacher
          </button>

          {/* UPDATE BUTTON */}
          <button
            onClick={updateTeacher}
            className="bg-blue-600 text-white px-6 py-2 rounded w-full mt-2"
          >
            Update Teacher
          </button>

          {/* ONLY CLEAR BUTTON (FIXED) */}
          <div className="mt-4">
            <button
              onClick={resetForm}
              className="bg-blue-500 px-4 py-2 text-white w-full"
            >
              Clear
            </button>
          </div>

        </div>

        {/* ================= TABLE ================= */}
        {/* ================= TABLE ================= */}
<div className="mt-6 bg-white p-4 rounded shadow-md">

  <table className="w-full border-collapse">

    <thead className="bg-blue-100">
      <tr>
        <th className="border p-2">ID</th>
        <th className="border p-2">Name</th>
        <th className="border p-2">Email</th>
        <th className="border p-2">Max Load</th>
        <th className="border p-2">Available Days</th>
        <th className="border p-2">Preferred Time</th>
        <th className="border p-2">Actions</th>
      </tr>
    </thead>

    <tbody>
      {teachers.map((t, i) => (
        <tr key={i} className="text-center">

          <td className="border p-2">{t.id}</td>
          <td className="border p-2">{t.name}</td>
          <td className="border p-2">{t.email}</td>
          <td className="border p-2">{t.max_load}</td>
          <td className="border p-2">{t.available_days}</td>
          <td className="border p-2">{t.preferred_time}</td>

          <td className="border p-2">
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => editTeacher(t)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTeacher(t.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
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