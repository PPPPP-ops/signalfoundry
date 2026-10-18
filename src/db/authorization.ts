import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "./client";
import { profiles, workspaces } from "./schema";

export async function requireAuthenticatedUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication is required for this operation.");
  }

  return userId;
}

export async function requireOwnedWorkspace(workspaceId: string) {
  const clerkUserId = await requireAuthenticatedUser();
  const db = getDb();
  const [workspace] = await db
    .select({ workspace: workspaces })
    .from(workspaces)
    .innerJoin(profiles, eq(workspaces.ownerProfileId, profiles.id))
    .where(
      and(
        eq(workspaces.id, workspaceId),
        eq(profiles.clerkUserId, clerkUserId),
      ),
    )
    .limit(1);

  if (!workspace) {
    throw new Error("Workspace not found or not authorized.");
  }

  return workspace.workspace;
}
