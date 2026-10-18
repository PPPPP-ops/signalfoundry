import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { getDb } from "./client";
import { profiles, workspaces } from "./schema";

export async function ensurePersonalWorkspace() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication is required to provision a workspace.");
  }

  const db = getDb();
  const [profile] = await db
    .insert(profiles)
    .values({ clerkUserId: userId })
    .onConflictDoUpdate({
      target: profiles.clerkUserId,
      set: { updatedAt: new Date() },
    })
    .returning();

  const existingWorkspace = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.ownerProfileId, profile.id))
    .limit(1);

  if (existingWorkspace[0]) {
    return { profile, workspace: existingWorkspace[0] };
  }

  const [workspace] = await db
    .insert(workspaces)
    .values({
      ownerProfileId: profile.id,
      name: "Personal workspace",
    })
    .returning();

  return { profile, workspace };
}
