"use client";

import { useState } from "react";
import ViewSidebar from "./components/ViewSidebar";
import WeeklyView from "./components/WeeklyView";
import RoomView from "./components/RoomView";
import TeacherView from "./components/TeacherView";

export default function ViewTimetablePage() {

  const [active, setActive] = useState("dashboard");

  return (
    <div className="flex h-screen">

      {/* LEFT SIDEBAR */}
      <ViewSidebar active={active} setActive={setActive} />

      {/* RIGHT CONTENT */}
      <div className="flex-1 bg-white p-6">

        {active === "dashboard" && (
          <div className="bg-blue-600 text-white p-6 rounded text-center">
            <h1 className="text-2xl font-bold">View Timetable Dashboard</h1>
            <p>Select an option from sidebar</p>
          </div>
        )}

        {active === "weekly" && <WeeklyView />}
        {active === "room" && <RoomView />}
        {active === "teacher" && <TeacherView />}

      </div>

    </div>
  );
}