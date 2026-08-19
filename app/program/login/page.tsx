"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProgramLogin() {
  const router = useRouter();

  const [program, setProgram] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    
    if (!program && !checked) {
      setError("Please select program and verify robot check");
      return;
    }

    if (!program) {
      setError("Please select program first");
      return;
    }

    if (!checked) {
      setError("Please verify robot check");
      return;
    }

    setError("");

  router.push("/program/dashboard");
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
          <button
      onClick={() => router.push("/")}
      className="absolute top-4 left-4 text-white bg-black/40 p-2 rounded-full hover:bg-black/60"
    >
      ←
    </button>

      
      <div className="hidden md:flex w-[60%] bg-gradient-to-br from-indigo-600 to-purple-600 text-white items-center justify-center flex-col p-10">

        <div className="text-7xl mb-4">🏫</div>

        <h2 className="text-4xl font-bold mb-2">Program Login</h2>

        <p className="text-white/80 text-center max-w-md">
          View teaching schedules, manage courses and track academic activities.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[40%] flex items-center justify-center bg-white px-10">

        <div className="w-full max-w-md">

          {/* TITLE */}
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
            Program Login
          </h2>

          {/* SUBTITLE */}
          <p className="text-center text-gray-600 mb-6">
            Enter your credentials to access your portal
          </p>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {error}
            </p>
          )}

          {/* PROGRAM */}
          <label className="font-medium">Program</label>
          <select
            className="w-full border p-3 rounded mb-4"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          >
            <option value="">Select Program</option>
            <option value="BSCS">BSCS</option>
            <option value="BSE">BSE</option>
            <option value="BAI">BAI</option>
          </select>

          {/* ROBOT CHECK */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <label>I am not a robot</label>
          </div>

          {/* SIGN IN */}
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-md"
          >
            Sign In
          </button>

        </div>
      </div>
    </div>
  );
}