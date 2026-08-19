"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CoursesPage() {

  const [courses, setCourses] = useState<any[]>([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    subject_code: "",
    credit_hours: "",
    cnt_hrs: "",
    lab_type: "",
    is_lab: false,
    teacher_id: "",
    batch_id: "",
    requires_consecutive: false,
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("id");

    setCourses(data || []);
  }

  // ✅ ADD
  async function addCourse() {
    const { error } = await supabase.from("courses").insert([
      {
        ...form,
        credit_hours: Number(form.credit_hours),
        cnt_hrs: Number(form.cnt_hrs),
        teacher_id: Number(form.teacher_id),
        batch_id: Number(form.batch_id),
      },
    ]);

    if (!error) {
      resetForm();
      fetchCourses();
    }
  }

  // ✅ DELETE
  async function deleteCourse(id: number) {
    await supabase.from("courses").delete().eq("id", id);
    fetchCourses();
  }

  // ✅ EDIT
  function editCourse(c: any) {
    setForm({
      ...c,
      is_lab: Boolean(c.is_lab),
      requires_consecutive: Boolean(c.requires_consecutive),
    });
    setEditMode(true);
  }

  // ✅ UPDATE
  async function updateCourse() {
    if (!editMode) return;

    await supabase
      .from("courses")
      .update({
        ...form,
        credit_hours: Number(form.credit_hours),
        cnt_hrs: Number(form.cnt_hrs),
        teacher_id: Number(form.teacher_id),
        batch_id: Number(form.batch_id),
      })
      .eq("id", form.id);

    resetForm();
    setEditMode(false);
    fetchCourses();
  }

  function resetForm() {
    setForm({
      id: "",
      name: "",
      subject_code: "",
      credit_hours: "",
      cnt_hrs: "",
      lab_type: "",
      is_lab: false,
      teacher_id: "",
      batch_id: "",
      requires_consecutive: false,
    });
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR SAME */}
      <div className="w-1/5 bg-blue-700 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <p className="bg-white text-blue-700 p-2 rounded font-semibold">
          Courses
        </p>
      </div>

      <div className="w-4/5 p-6 overflow-auto">

        <div className="bg-blue-600 text-white text-center py-3 rounded-lg text-2xl font-bold mb-6">
          COURSES
        </div>

        {/* FORM */}
        <div className="bg-white p-5 rounded shadow-md">

          {Object.keys(form).map((key) => (
            <div key={key} className="mb-3">

              <label className="font-semibold capitalize">{key}</label>

              {(key === "is_lab" || key === "requires_consecutive") ? (
                <input
                  type="checkbox"
                  checked={(form as any)[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.checked })
                  }
                />
              ) : (
                <input
                  className="border w-full p-2"
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              )}

            </div>
          ))}

          <button onClick={addCourse} className="bg-green-600 text-white px-6 py-2 w-full mt-2">
            Add Course
          </button>

          <button onClick={updateCourse} className="bg-blue-600 text-white px-6 py-2 w-full mt-2">
            Update Course
          </button>

          <button onClick={resetForm} className="bg-gray-500 text-white px-6 py-2 w-full mt-2">
            Clear
          </button>

        </div>

        {/* TABLE */}
        <div className="mt-6 bg-white p-4 rounded shadow-md overflow-x-auto">

          <table className="w-full border-collapse">

            <thead className="bg-blue-100">
              <tr>
                {Object.keys(form).map((key) => (
                  <th key={key} className="border px-3 py-2 text-sm">
                    {key}
                  </th>
                ))}
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {courses.map((c, i) => (
                <tr key={i} className="border-b">

                  {Object.keys(form).map((key) => (
                    <td key={key} className="border px-3 py-2">

                      {c[key] === null
                        ? "-"
                        : key === "is_lab" || key === "requires_consecutive"
                        ? c[key] ? "True" : "False"
                        : c[key]}

                    </td>
                  ))}

                  <td className="border px-3 py-2">
                    <button
                      onClick={() => editCourse(c)}
                      className="bg-yellow-500 text-white px-2 py-1 mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCourse(c.id)}
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