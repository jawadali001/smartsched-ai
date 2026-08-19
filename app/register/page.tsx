"use client";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
        
        <h2 className="text-xl font-bold mb-4 text-center">
          Registration
        </h2>

        <input placeholder="First Name" className="w-full mb-2 p-2 border rounded" />
        <input placeholder="Last Name" className="w-full mb-2 p-2 border rounded" />
        <input placeholder="Email" className="w-full mb-2 p-2 border rounded" />

        <input placeholder="Phone Number" className="w-full mb-2 p-2 border rounded" />

        {/* IMPORTANT CHANGE */}
        <select className="w-full mb-2 p-2 border rounded">
          <option>Select Program</option>
          <option>BSCS</option>
          <option>BSSE</option>
          <option>BSAI</option>
        </select>

        <input placeholder="Username" className="w-full mb-2 p-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full mb-2 p-2 border rounded" />
        <input type="password" placeholder="Confirm Password" className="w-full mb-4 p-2 border rounded" />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </div>
    </div>
  );
}