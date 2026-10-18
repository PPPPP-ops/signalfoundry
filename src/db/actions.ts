"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireOwnedWorkspace } from "./authorization";
import { getDb } from "./client";
import { ensurePersonalWorkspace } from "./onboarding";
import {
  customerSegments,
  decisions,
  opportunities,
  problems,
  signals,
} from "./schema";

export type ActionState = { message: string; tone?: "success" | "error" };

const ok = (message: string): ActionState => ({ message, tone: "success" });
const fail = (message: string): ActionState => ({ message, tone: "error" });

async function workspaceContext() {
  const { workspace } = await ensurePersonalWorkspace();
  await requireOwnedWorkspace(workspace.id);
  return workspace;
}

function requiredText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value;
}

function score(formData: FormData, name: string) {
  const value = Number(formData.get(name));
  return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
}

export async function createSegmentAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const name = requiredText(formData, "name");
  if (!name) return fail("Give the segment a name.");
  const workspace = await workspaceContext();
  await getDb().insert(customerSegments).values({ workspaceId: workspace.id, name, description: requiredText(formData, "description") || null });
  revalidatePath("/signals");
  return ok("Segment added.");
}

export async function createSignalAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const title = requiredText(formData, "title");
  const content = requiredText(formData, "content");
  const sourceType = requiredText(formData, "sourceType");
  const status = requiredText(formData, "status") || "New";
  const severity = score(formData, "severity");
  if (!title || !content || !severity) return fail("Add a title, feedback, and a severity from 1 to 5.");
  const workspace = await workspaceContext();
  const db = getDb();
  const segmentId = requiredText(formData, "segmentId");
  if (segmentId) {
    const [segment] = await db.select({ id: customerSegments.id }).from(customerSegments).where(and(eq(customerSegments.id, segmentId), eq(customerSegments.workspaceId, workspace.id))).limit(1);
    if (!segment) return fail("That segment is not part of your workspace.");
  }
  await db.insert(signals).values({ workspaceId: workspace.id, segmentId: segmentId || null, title, content, sourceType, severity, status });
  revalidatePath("/signals");
  revalidatePath("/dashboard");
  return ok("Signal captured.");
}

export async function updateSignalAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const id = requiredText(formData, "id");
  const title = requiredText(formData, "title");
  const content = requiredText(formData, "content");
  const severity = score(formData, "severity");
  if (!id || !title || !content || !severity) return fail("Complete the signal fields before saving.");
  const workspace = await workspaceContext();
  const db = getDb();
  const result = await db.update(signals).set({ title, content, severity, status: requiredText(formData, "status") || "New", updatedAt: new Date() }).where(and(eq(signals.id, id), eq(signals.workspaceId, workspace.id))).returning({ id: signals.id });
  if (!result[0]) return fail("Signal not found in your workspace.");
  revalidatePath("/signals");
  revalidatePath("/dashboard");
  return ok("Signal updated.");
}

export async function deleteSignalAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const id = requiredText(formData, "id");
  if (!id) return fail("Signal ID is missing.");
  const workspace = await workspaceContext();
  const result = await getDb().delete(signals).where(and(eq(signals.id, id), eq(signals.workspaceId, workspace.id))).returning({ id: signals.id });
  if (!result[0]) return fail("Signal not found in your workspace.");
  revalidatePath("/signals");
  revalidatePath("/dashboard");
  return ok("Signal deleted.");
}

export async function deleteSignalDirectAction(formData: FormData): Promise<void> {
  const result = await deleteSignalAction({ message: "" }, formData);
  if (result.tone === "error") throw new Error(result.message);
}

export async function createProblemAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const title = requiredText(formData, "title");
  const description = requiredText(formData, "description");
  if (!title || !description) return fail("Add a problem title and description.");
  const workspace = await workspaceContext();
  const db = getDb();
  const [problem] = await db.insert(problems).values({ workspaceId: workspace.id, title, description }).returning();
  const signalIds = formData.getAll("signalIds").map(String).filter(Boolean);
  if (signalIds.length) {
    await db.update(signals).set({ problemId: problem.id, updatedAt: new Date() }).where(and(inArray(signals.id, signalIds), eq(signals.workspaceId, workspace.id)));
  }
  revalidatePath("/problems");
  revalidatePath("/signals");
  revalidatePath("/dashboard");
  return ok("Problem grouped.");
}

export async function updateProblemAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const id = requiredText(formData, "id");
  const title = requiredText(formData, "title");
  const description = requiredText(formData, "description");
  if (!id || !title || !description) return fail("Complete the problem fields before saving.");
  const workspace = await workspaceContext();
  const result = await getDb().update(problems).set({ title, description, updatedAt: new Date() }).where(and(eq(problems.id, id), eq(problems.workspaceId, workspace.id))).returning({ id: problems.id });
  if (!result[0]) return fail("Problem not found in your workspace.");
  revalidatePath("/problems");
  revalidatePath("/dashboard");
  return ok("Problem updated.");
}

export async function createOpportunityAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const title = requiredText(formData, "title");
  const problemId = requiredText(formData, "problemId");
  const frequencyScore = score(formData, "frequencyScore");
  const severityScore = score(formData, "severityScore");
  const willingnessToPayScore = score(formData, "willingnessToPayScore");
  const strategicFitScore = score(formData, "strategicFitScore");
  const effortScore = score(formData, "effortScore");
  if (!title || !problemId || !frequencyScore || !severityScore || !willingnessToPayScore || !strategicFitScore || !effortScore) return fail("Complete the opportunity and all five scores from 1 to 5.");
  const workspace = await workspaceContext();
  const db = getDb();
  const [problem] = await db.select({ id: problems.id }).from(problems).where(and(eq(problems.id, problemId), eq(problems.workspaceId, workspace.id))).limit(1);
  if (!problem) return fail("That problem is not part of your workspace.");
  const priorityScore = (((frequencyScore + severityScore + willingnessToPayScore + strategicFitScore) / 4) * (6 - effortScore)).toFixed(2);
  await db.insert(opportunities).values({ workspaceId: workspace.id, problemId, title, description: requiredText(formData, "description") || null, frequencyScore, severityScore, willingnessToPayScore, strategicFitScore, effortScore, priorityScore });
  revalidatePath("/opportunities");
  revalidatePath("/dashboard");
  return ok(`Opportunity scored ${priorityScore}.`);
}

export async function createDecisionAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const opportunityId = requiredText(formData, "opportunityId");
  const decisionType = requiredText(formData, "decisionType");
  const rationale = requiredText(formData, "rationale");
  if (!opportunityId || !decisionType || !rationale) return fail("Choose an opportunity and explain the decision.");
  const workspace = await workspaceContext();
  const db = getDb();
  const [opportunity] = await db.select({ id: opportunities.id }).from(opportunities).where(and(eq(opportunities.id, opportunityId), eq(opportunities.workspaceId, workspace.id))).limit(1);
  if (!opportunity) return fail("That opportunity is not part of your workspace.");
  await db.insert(decisions).values({ workspaceId: workspace.id, opportunityId, decisionType, rationale, evidenceSummary: requiredText(formData, "evidenceSummary") || null });
  revalidatePath("/decisions");
  revalidatePath("/dashboard");
  return ok("Decision recorded.");
}
