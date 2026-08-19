"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-purple-500 to-blue-500 items-center justify-center text-white">
        <h1 className="text-3xl font-bold">
          Intelligent Time Table Manager
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[350px]">
          
          <h2 className="text-xl font-bold mb-4 text-center">
            Welcome Back
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
          />

          <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Login
          </button>

          <p className="text-center mt-4 text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}