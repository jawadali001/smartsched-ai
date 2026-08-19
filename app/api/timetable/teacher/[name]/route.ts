import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request, { params }: any) {

  const teacherName = params.name;

  const { data, error } = await supabase
    .from("timetable")
    .select("*")
    .ilike("teacher_name", teacherName); // case insensitive

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json(data);
}