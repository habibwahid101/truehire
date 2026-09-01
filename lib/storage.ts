import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ALLOWED_CV_EXT, ALLOWED_CV_MIME, MAX_CV_BYTES } from "./constants";
import { fileExtension } from "./utils";

function driver() {
  return process.env.STORAGE_DRIVER === "s3" ? "s3" : "local";
}
function localRoot() {
  return path.resolve(process.env.STORAGE_LOCAL_DIR || "./storage/private");
}
function s3() {
  return new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  });
}
export function validateUpload(file: { name: string; type: string; size: number }) {
  const ext = fileExtension(file.name);
  if (!ALLOWED_CV_EXT.includes(ext)) return "Please upload a PDF, DOC or DOCX file.";
  if (file.type && !ALLOWED_CV_MIME.includes(file.type) && file.type !== "application/octet-stream") {
    return "That file type is not accepted.";
  }
  if (file.size > MAX_CV_BYTES) return "The file is larger than 8 MB.";
  if (file.size < 64) return "The uploaded file appears to be empty.";
  return null;
}
export function objectKey(kind: "cv" | "supporting" | "logo", originalName: string) {
  const ext = fileExtension(originalName) || ".bin";
  return `${kind}/${new Date().getUTCFullYear()}/${randomUUID()}${ext}`;
}
export async function putPrivateFile(key: string, body: Buffer, contentType: string) {
  if (driver() === "s3") {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) throw new Error("S3_BUCKET is not configured.");
    await s3().send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType }));
    return;
  }
  const full = path.join(localRoot(), key);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, body);
}
export async function getPrivateFile(key: string) {
  if (driver() === "s3") {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) throw new Error("S3_BUCKET is not configured.");
    try {
      const result = await s3().send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const bytes = await result.Body?.transformToByteArray();
      if (!bytes) return null;
      return { body: Buffer.from(bytes), contentType: result.ContentType || "application/octet-stream" };
    } catch {
      return null;
    }
  }
  try {
    const body = await fs.readFile(path.join(localRoot(), key));
    return { body, contentType: "application/octet-stream" };
  } catch {
    return null;
  }
}
