import { NextResponse } from "next/server";
import { submitApplication } from "@/lib/applications";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "apply"), 8, 15 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many submissions from this network. Please wait and try again." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const result = await submitApplication(body);
  if (!result.ok) return NextResponse.json({ error: result.error, fieldErrors: "fieldErrors" in result ? result.fieldErrors : undefined }, { status: result.status });
  return NextResponse.json({ reference: result.reference });
}
