import type { ActivityEventType, Prisma } from "@prisma/client";
import { prisma } from "./db";

export async function recordActivity(
  tx: Prisma.TransactionClient | typeof prisma,
  input: { applicationId: string; actorId?: string | null; eventType: ActivityEventType; summary: string; metadata?: Prisma.InputJsonValue },
) {
  return tx.applicationActivity.create({
    data: {
      applicationId: input.applicationId,
      actorId: input.actorId || undefined,
      eventType: input.eventType,
      summary: input.summary,
      metadata: input.metadata,
    },
  });
}
