"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StudentLogin() {
  const router = useRouter();

  const [program, setProgram] = useState("");
  const [batch, setBatch] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  // ✅ DYNAMIC BATCH FUNCTION
  const getBatchOptions = () => {
    if (program === "BSCS") return ["BSCS-1", "BSCS-2", "BSCS-3", "BSCS-4", "BSCS-5", "BSCS-6", "BSCS-7", "BSCS-8"];
    if (program === "BSE") return ["BSE-1", "BSE-2", "BSE-3", "BSE-4", "BSE-5", "BSE-6", "BSE-7", "BSE-8"];
    if (program === "BAI") return ["BAI-1", "BAI-2", "BAI-3", "BAI-4", "BAI-5", "BAI-6", "BAI-7", "BAI-8"];
    return [];
  };

  const handleLogin = () => {
    localStorage.setItem("student", JSON.stringify({
  program,
  batch
}));
    // ❌ CASE 3: everything missing
    if (!program && !batch && !checked) {
      setError("Please select program, batch and verify robot");
      return;
    }
    // ❌ CASE: program selected but batch missing
if (program && !batch) {
  setError("Please select batch before signing in");
  return;
}

    // ❌ CASE 1: only robot missing
    if (!checked) {
      setError("Please check robot before signing in");
      return;
    }

    // ❌ CASE 2: program or batch missing
    if (!program || !batch) {
      setError("Please select program and batch first");
      return;
    }
    
    setError("");

 localStorage.setItem("student", JSON.stringify({
  program,
  batch
}));
    router.push("/student/dashboard");
  };

  return (
    <div className="min-h-screen flex">

      {/* BACK BUTTON */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-white bg-black/40 p-2 rounded-full hover:bg-black/60"
      >
        ←
      </button>

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-[60%] bg-gradient-to-br from-indigo-600 to-purple-600 text-white items-center justify-center flex-col p-10">

        <div className="text-7xl mb-4">🏫</div>

        <h2 className="text-4xl font-bold mb-2">Student Login</h2>

        <p className="text-white/80 text-center max-w-md">
          Access your timetable,view schedules and stay updated with your classes.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[40%] flex items-center justify-center bg-white px-10">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
            Student Login
          </h2>

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
            onChange={(e) => {
              setProgram(e.target.value);
              setBatch(""); // reset batch
            }}
          >
            <option value="">Select Program</option>
            <option value="BSCS">BSCS</option>
            <option value="BSE">BSE</option>
            <option value="BAI">BAI</option>
          </select>

          {/* BATCH */}
          <label className="font-medium">Batch</label>
          <select
            className="w-full border p-3 rounded mb-4"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            disabled={!program}
          >
            <option value="">Select Batch</option>

            {getBatchOptions().map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
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