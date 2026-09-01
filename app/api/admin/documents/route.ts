import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/session";
import { getPrivateFile } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const applicationId = url.searchParams.get("applicationId");
  const kind = url.searchParams.get("kind") === "supporting" ? "supporting" : "cv";
  if (!applicationId) return NextResponse.json({ error: "Missing application" }, { status: 400 });
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const key = kind === "supporting" ? application.supportingKey : application.cvKey;
  const fileName = kind === "supporting" ? application.supportingFileName : application.cvFileName;
  if (!key || !fileName) return NextResponse.json({ error: "Document not available" }, { status: 404 });
  const file = await getPrivateFile(key);
  if (!file) return NextResponse.json({ error: "Document not available" }, { status: 404 });
  return new NextResponse(new Uint8Array(file.body), {
    headers: {
      "Content-Type": application.cvMimeType || file.contentType,
      "Content-Disposition": `attachment; filename="${fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
