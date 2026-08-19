import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, CalendarDays, Home, User } from "lucide-react";
export default function ViewSidebar({ active, setActive }: any) {
const router = useRouter();
  return (
  <div className="w-1/4 bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-6 flex flex-col">
<button
  onClick={() => router.push("/admin/dashboard")}
  className="bg-white text-blue-600 p-1 rounded hover:bg-gray-50"
>
  <ArrowLeft size={14} />
</button>
      <h2 className="text-xl font-bold mb-6">
        View Timetable Panel
      </h2>

     <button
  onClick={() => setActive("dashboard")}
  className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-blue-700"
>
  <LayoutDashboard size={18} /> Dashboard
</button>
<button
  onClick={() => setActive("weekly")}
  className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-blue-700"
>
  <CalendarDays size={18} /> Weekly Timetable
</button>
    <button
  onClick={() => setActive("room")}
  className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-blue-700"
>
  <Home size={18} /> Room Wise Timetable
</button>
     <button
  onClick={() => setActive("teacher")}
  className="flex items-center gap-2 p-2 rounded hover:bg-white hover:text-blue-700"
>
  <User size={18} /> Teacher Wise Timetable
</button>

    </div>
  );
}