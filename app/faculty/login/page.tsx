"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function FacultyLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
const handleLogin = async () => {
  setLoading(true);
  setErrorMsg("");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    setErrorMsg("Invalid email or password ❌");
    setLoading(false);
    return;
  }

  // ✅ get teacher from DB
  const { data: teacher } = await supabase
    .from("teachers")
    .select("*")
    .eq("email", email)
    .single();

  // store in localStorage
  localStorage.setItem("teacher", JSON.stringify(teacher));

  router.replace("/faculty/dashboard");
};

  return (
    
    <div className="min-h-screen flex">
<button
  onClick={() => router.push("/")}
  className="absolute top-4 left-4 px-3 py-2 text-gray-700 hover:text-black"
>
  ⬅ 
</button>
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-[60%] bg-gradient-to-br from-indigo-600 to-purple-600 text-white items-center justify-center flex-col p-10">
        <div className="text-center">
          <div className="text-6xl mb-4">👩‍🏫</div>
          <h1 className="text-3xl font-bold mb-2">Faculty Portal</h1>
          <p className="text-sm opacity-90">
            View teaching schedules, manage courses and track academic activities.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[40%] flex items-center justify-center bg-white">
        <div className="w-[80%] max-w-md">

          <h2 className="text-2xl font-bold mb-2 text-center">
            Faculty Login
          </h2>

          <p className="text-sm text-gray-500 text-center mb-6">
            Enter your credentials to access your portal
          </p>

          {/* ERROR */}
          {errorMsg && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
              {errorMsg}
            </div>
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* ✅ CHECKBOX ADDED */}
          <div className="flex items-center mb-4 text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="mr-2"
            />
            <label>I confirm my credentials</label>
          </div>

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </div>
      </div>
    </div>
  );
}