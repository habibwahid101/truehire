import type { MetadataRoute } from "next";
import { listPublishedJobs } from "@/lib/jobs";
import { appUrl } from "@/lib/utils";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await listPublishedJobs();
  return [
    { url: appUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: appUrl("/jobs"), changeFrequency: "daily", priority: 0.9 },
    { url: appUrl("/privacy") },
    { url: appUrl("/terms") },
    { url: appUrl("/contact") },
    ...jobs.map((job) => ({ url: appUrl(`/jobs/${job.slug}`), lastModified: job.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
