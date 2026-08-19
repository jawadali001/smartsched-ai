export const generateTimetable = ({ batches, courses, rooms, days, slots }: any) => {

  const timetable: any[] = [];

  batches.forEach((batch: any) => {

    const batchCourses = courses.filter((c:any) => c.batch_id === batch.id);

    batchCourses.forEach((course: any) => {

      let assignedCount = 0; // 🔥 FIX

      for (let day of days) {

        for (let slot of slots) {

          if (slot === 4) continue;

          // =========================
          // 🔥 WEEKLY LIMIT (FIX SAFE)
          // =========================
          const weeklyCount = timetable.filter(t =>
            t.course_id === course.id &&
            t.batch_id === batch.id
          ).length;

          if (weeklyCount >= 2) continue;

          const sameCourseSameDay = timetable.find(t =>
            t.batch_id === batch.id &&
            t.course_id === course.id &&
            t.day === day
          );
          if (sameCourseSameDay) continue;

          // =========================
          // 🔥 LAB GAP RULE (FIX)
          // =========================
          if (course.name.toLowerCase().includes("lab")) {

            const prev = timetable.find(t =>
              t.course_id === course.id &&
              t.batch_id === batch.id
            );

            if (prev) {
              const d:any = { Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5 };

              const diff = Math.abs(d[prev.day] - d[day]);

              if (diff < 2) continue;
            }
          }

          const batchBusy = timetable.find(t =>
            t.batch_id === batch.id &&
            t.day === day &&
            t.slot === slot
          );
          if (batchBusy) continue;

          const teacherBusy = timetable.find(t =>
            t.teacher_id === course.teacher_id &&
            t.day === day &&
            t.slot === slot
          );
          if (teacherBusy) continue;

          const count = timetable.filter(t =>
            t.batch_id === batch.id &&
            t.day === day
          ).length;
          if (count >= 4) continue;

          // =========================
          // 🔥 ROOM LOGIC
          // =========================

          const courseName = course.name.toLowerCase();

          const isLab = courseName.includes("lab");
          const isEELab = course.lab_type === "ee";

          let allowedRooms:any[] = [];

          if (isLab) {
            if (isEELab) {
              allowedRooms = rooms.filter((r:any) =>
                r.name.toUpperCase().includes("DLD") ||
                r.name.toUpperCase().includes("EE")
              );
            } else {
              allowedRooms = rooms.filter((r:any) =>
                r.name.toUpperCase().includes("LAB") &&
                !r.name.toUpperCase().includes("DLD") &&
                !r.name.toUpperCase().includes("EE")
              );
            }
          } else {
            allowedRooms = rooms.filter((r:any) =>
              r.name.toUpperCase().includes("LT")
            );
          }

          allowedRooms = [...allowedRooms].sort(() => Math.random() - 0.5);

          const freeRoom = allowedRooms.find((r:any) => {
            return !timetable.find(t =>
              t.room_id === r.id &&
              t.day === day &&
              t.slot === slot
            );
          });

          if (!freeRoom) continue;

          timetable.push({
            batch_id: batch.id,
            course_id: course.id,
            teacher_id: course.teacher_id,
            room_id: freeRoom.id,
            day: day,
            slot: slot,
            lecture_no: slot
          });

          assignedCount++; // 🔥 FIX
        }
      }

      // =========================
      // 🔥 FALLBACK (CRITICAL FIX)
      // =========================
      if (assignedCount === 0) {

        const fallbackRoom = rooms.find((r:any) =>
          r.name.toUpperCase().includes("LT")
        );

        if (fallbackRoom) {
          timetable.push({
            batch_id: batch.id,
            course_id: course.id,
            teacher_id: course.teacher_id,
            room_id: fallbackRoom.id,
            day: "Monday",
            slot: 1,
            lecture_no: 1
          });
        }
      }

    });

  });

  // =============================
  // 🔥 FINAL LAB BALANCING FIX
  // =============================

  const labRooms = rooms.filter((r:any) =>
    r.name.toUpperCase().includes("LAB") &&
    !r.name.toUpperCase().includes("DLD") &&
    !r.name.toUpperCase().includes("EE")
  );

  const labCourses = courses.filter((c:any) =>
    c.name.toLowerCase().includes("lab")
  );

  labRooms.forEach((lab:any) => {

    days.forEach((day:any) => {

      slots.forEach((slot:any) => {

        if (slot === 4) return;

        const alreadyAssigned = timetable.find(t =>
          t.room_id === lab.id &&
          t.day === day &&
          t.slot === slot
        );

        if (alreadyAssigned) return;

        const shuffledCourses = [...labCourses].sort(() => Math.random() - 0.5);

        const selectedCourse = shuffledCourses.find((course:any) => {

          const count = timetable.filter(t =>
            t.course_id === course.id &&
            t.batch_id === course.batch_id
          ).length;

          if (count >= 2) return false;

          const prev = timetable.find(t =>
            t.course_id === course.id &&
            t.batch_id === course.batch_id
          );

          if (prev) {
            const d:any = { Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5 };
            const diff = Math.abs(d[prev.day] - d[day]);
            if (diff < 2) return false;
          }

          const batchBusy = timetable.find(t =>
            t.batch_id === course.batch_id &&
            t.day === day &&
            t.slot === slot
          );
          if (batchBusy) return false;

          const teacherBusy = timetable.find(t =>
            t.teacher_id === course.teacher_id &&
            t.day === day &&
            t.slot === slot
          );
          if (teacherBusy) return false;

          return true;
        });

        if (!selectedCourse) return;

        timetable.push({
          batch_id: selectedCourse.batch_id,
          course_id: selectedCourse.id,
          teacher_id: selectedCourse.teacher_id,
          room_id: lab.id,
          day: day,
          slot: slot,
          lecture_no: slot
        });

      });

    });

  });

  return timetable;
};