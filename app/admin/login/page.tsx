"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");

  // 🔴 EMAIL VALIDATION
  const handleEmail = (value: string) => {
    setEmail(value.trim());

    if (!value.includes("@")) {
      setError("Email must contain @");
    } else if (!value.includes("gmail.com")) {
      setError("Email must contain gmail.com");
    } else {
      setError("");
    }
  };

  const validate = () => {
    if (!checked) {
      setError("Please confirm you are not a robot");
      return false;
    }

    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (!email.includes("@") || !email.includes("gmail.com")) {
      setError("Invalid email format");
      return false;
    }

    setError("");
    return true;
  };

const handleLogin = async () => {
  setError("");

  if (!validate()) return;

  const emailInput = email.trim();
  const passwordInput = password.trim();

  // 🔴 STEP 1: EMAIL VALIDATION (format check only)
  const emailValid =
    emailInput.includes("@") && emailInput.includes("gmail.com");

  // 🔴 STEP 2: PASSWORD VALIDATION (simple rule simulation)
  const passwordValid = passwordInput.length >= 6;

  // =========================
  // 🔴 CASE 1: EMAIL WRONG ONLY
  // =========================
  if (!emailValid && passwordValid) {
    setError("Invalid Email");
    return;
  }

  // =========================
  // 🔴 CASE 2: PASSWORD WRONG ONLY
  // =========================
  if (emailValid && !passwordValid) {
    setError("Invalid Password");
    return;
  }

  // =========================
  // 🔴 CASE 3: BOTH WRONG
  // =========================
  if (!emailValid && !passwordValid) {
    setError("Invalid Email & Password");
    return;
  }

  // =========================
  // 🔴 REAL AUTH CHECK (Supabase only at success stage)
  // =========================
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailInput,
    password: passwordInput,
  });

  if (!data?.user || error) {
    setError("Login Failed");
    return;
  }

  // =========================
  // ✅ SUCCESS
  // =========================
  router.push("/admin/dashboard");
};
  return (
    <div className="min-h-screen flex">
      <BackButton />

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-[60%] bg-gradient-to-br from-indigo-600 to-purple-600 text-white items-center justify-center flex-col p-10">
        <div className="text-7xl mb-4">👨‍💼</div>

        <h2 className="text-4xl font-bold mb-2">Admin Portal</h2>

        <p className="text-white/80 text-center max-w-md">
          Manage schedules, control system and monitor operations efficiently.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-[40%] flex items-center justify-center bg-white px-10">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
            Admin Login
          </h2>

          <p className="text-center text-gray-600 mb-6">
            Enter your credentials to access your portal
          </p>

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          {/* EMAIL */}
          <label>Email</label>
          <input
            value={email}
            onChange={(e) => handleEmail(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="Enter email"
          />

          {/* PASSWORD */}
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
            placeholder="Enter password"
          />

          {/* CHECKBOX */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <label>I am not a robot</label>
          </div>

          {/* BUTTON */}
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