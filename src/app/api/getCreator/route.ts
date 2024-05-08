import { client } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  try {
    const response = await client.from("farstackUser").select("*").eq("username", username);
    if (response.error) {
      return NextResponse.json({ code: "failure", response });
    }
    return NextResponse.json({ code: "success", data: response.data });
  } catch {
    return NextResponse.json({ code: "failure" });
  }
}