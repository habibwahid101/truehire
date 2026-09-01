import { NextResponse } from "next/server";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { objectKey, putPrivateFile, validateUpload } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "upload"), 20, 15 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many uploads. Please wait and try again." }, { status: 429 });
  }
  const form = await request.formData();
  const file = form.get("file");
  const kind = form.get("kind") === "supporting" ? "supporting" : "cv";
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  const problem = validateUpload({ name: file.name, type: file.type, size: file.size });
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  try {
    const key = objectKey(kind, file.name);
    await putPrivateFile(key, Buffer.from(await file.arrayBuffer()), file.type || "application/octet-stream");
    return NextResponse.json({ key, fileName: file.name, mimeType: file.type || "application/octet-stream", size: file.size });
  } catch (error) {
    console.error("[upload:error]", error);
    return NextResponse.json({ error: "The file could not be stored. Please try again." }, { status: 500 });
  }
}
