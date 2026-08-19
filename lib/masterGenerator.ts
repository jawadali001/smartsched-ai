export function generateMasterTimetable({ courses, rooms, days, slots }: any) {

  const timetable: any[] = [];

  const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  const used: any = {
    teacher: {},
    room: {},
    batch: {}
  };

  const isFree = (type: any, id: any, day: any, slot: any) =>
    !used[type][`${id}-${day}-${slot}`];

  const markUsed = (entry: any) => {
    used.teacher[`${entry.teacher_id}-${entry.day}-${entry.slot}`] = true;
    used.room[`${entry.room_id}-${entry.day}-${entry.slot}`] = true;
    used.batch[`${entry.batch_id}-${entry.day}-${entry.slot}`] = true;
  };

  for (let course of courses) {

    let lecturesNeeded = Math.min(2, course.contact_hours || 2);
    let usedDays: any[] = [];
    let tries = 0;

    while (lecturesNeeded > 0 && tries < 100) {

      tries++;

      let day = random(days);

      // ❌ same subject same day
      if (usedDays.includes(day)) continue;

      let slot = random(slots);
      if (slot === 4) continue;

      // ❌ already same subject that day
      const sameDay = timetable.some(t =>
        t.batch_id === course.batch_id &&
        t.course_id === course.id &&
        t.day === day
      );

      if (sameDay) continue;

      // ❌ consecutive block
      const consecutive = timetable.some(t =>
        t.batch_id === course.batch_id &&
        t.course_id === course.id &&
        t.day === day &&
        (t.slot === slot - 1 || t.slot === slot + 1)
      );

      if (consecutive) continue;

      // ✅ ROOM LOGIC
    // ✅ ROOM LOGIC (UPDATED - NO DLD / NO SPECIAL LABS)

let possibleRooms;

// 🟨 LAB SUBJECTS → ONLY CS LABS (Lab1–Lab5)
if (course.is_lab) {
  possibleRooms = rooms.filter((r: any) =>
    r.name.toLowerCase().includes("lab")
  );
}

// 🟦 EVERYTHING ELSE → THEORY (LT1–LT9)
else {
  possibleRooms = rooms.filter((r: any) =>
    r.name.toLowerCase().includes("lt")
  );
}
      if (!possibleRooms.length) continue;

      possibleRooms = possibleRooms.sort(() => Math.random() - 0.5);

      for (let room of possibleRooms) {

        if (
          isFree("teacher", course.teacher_id, day, slot) &&
          isFree("room", room.id, day, slot) &&
          isFree("batch", course.batch_id, day, slot)
        ) {

          const entry = {
            teacher_id: course.teacher_id,
            course_id: course.id,
            batch_id: course.batch_id,
            room_id: room.id,
            day,
            slot
          };

          timetable.push(entry);
          markUsed(entry);

          usedDays.push(day);
          lecturesNeeded--;

          break;
        }
      }
    }
  }

  return timetable;
}
