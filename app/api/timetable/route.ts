import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("timetable")
    .select("*");

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json(data);
}