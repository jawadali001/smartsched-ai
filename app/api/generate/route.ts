import { generateMasterTimetable } from "@/lib/masterGenerator";

export async function GET() {
  await generateMasterTimetable();
  return Response.json({ success: true });
}