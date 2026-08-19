"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RoomsPage() {

  const [rooms, setRooms] = useState<any[]>([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    room_type: "",
    capacity: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("id", { ascending: true });

    if (!error) setRooms(data || []);
  }

  // ✅ FIXED ADD
  async function addRoom() {
    if (!form.id || !form.name || !form.room_type || !form.capacity) {
      alert("Fill all fields");
      return;
    }

    const { error } = await supabase.from("rooms").insert([
      {
        id: Number(form.id),
        name: form.name,
        room_type: form.room_type,
        capacity: Number(form.capacity),
      },
    ]);

    if (!error) {
      resetForm();
      fetchRooms();
    } else {
      console.log(error);
      alert("Insert failed");
    }
  }

  async function deleteRoom(id: number) {
    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", id);

    if (!error) fetchRooms();
  }

  function editRoom(r: any) {
    setForm({
      id: String(r.id),
      name: r.name,
      room_type: r.room_type,
      capacity: String(r.capacity),
    });
    setEditMode(true);
  }

  async function updateRoom() {
    if (!editMode) {
      alert("Select room first");
      return;
    }

    const { error } = await supabase
      .from("rooms")
      .update({
        name: form.name,
        room_type: form.room_type,
        capacity: Number(form.capacity),
      })
      .eq("id", form.id);

    if (!error) {
      resetForm();
      setEditMode(false);
      fetchRooms();
    }
  }

  function resetForm() {
    setForm({
      id: "",
      name: "",
      room_type: "",
      capacity: "",
    });
    setEditMode(false);
  }

 return (
  <div className="flex h-screen bg-gray-100">

    {/* 🔵 LEFT BLUE PANEL (same like Teachers) */}
    <div className="w-1/5 bg-blue-700 text-white p-5">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

      <div className="bg-white text-blue-700 p-2 rounded">
        Rooms
      </div>
    </div>

    {/* ⚪ RIGHT CONTENT */}
    <div className="w-4/5 p-6 overflow-auto">

      {/* HEADER */}
      <div className="bg-blue-600 text-white text-center py-3 rounded-lg text-2xl font-bold mb-6">
        ROOMS
      </div>

      {/* FORM */}
      <div className="bg-white p-5 rounded shadow-md">

        {/* ID */}
        <div className="mb-3">
          <label className="font-semibold">ID</label>
          <input
            className="border w-full p-2"
            value={form.id}
            onChange={(e) =>
              setForm({ ...form, id: e.target.value })
            }
          />
        </div>

        {/* NAME */}
        <div className="mb-3">
          <label className="font-semibold">Name</label>
          <input
            className="border w-full p-2"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        {/* ROOM TYPE */}
        <div className="mb-3">
          <label className="font-semibold">Room Type</label>
          <input
            className="border w-full p-2"
            value={form.room_type}
            onChange={(e) =>
              setForm({ ...form, room_type: e.target.value })
            }
          />
        </div>

        {/* CAPACITY */}
        <div className="mb-3">
          <label className="font-semibold">Capacity</label>
          <input
            className="border w-full p-2"
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: e.target.value })
            }
          />
        </div>

        {/* BUTTONS */}
        <button
          onClick={addRoom}
          className="bg-green-600 text-white px-6 py-2 rounded w-full mt-2"
        >
          Add Room
        </button>

        <button
          onClick={updateRoom}
          className="bg-blue-600 text-white px-6 py-2 rounded w-full mt-2"
        >
          Update Room
        </button>

        <div className="flex gap-2 mt-2">
          <button
            onClick={resetForm}
            className="bg-blue-500 text-white px-6 py-2 rounded w-full"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 bg-white p-4 rounded shadow-md overflow-x-auto">

        <table className="w-full border-collapse">

          <thead className="bg-blue-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Room Type</th>
              <th className="border px-3 py-2">Capacity</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((r, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">

                <td className="border px-3 py-2">{r.id}</td>
                <td className="border px-3 py-2">{r.name}</td>
                <td className="border px-3 py-2">{r.room_type}</td>
                <td className="border px-3 py-2">{r.capacity}</td>

                <td className="border px-3 py-2">
                  <div className="flex gap-2">

                    <button
                      onClick={() => editRoom(r)}
                      className="bg-yellow-500 text-white px-3 py-1 text-sm rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteRoom(r.id)}
                      className="bg-red-600 text-white px-3 py-1 text-sm rounded"
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
);}