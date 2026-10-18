import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from "./client";
import { ensurePersonalWorkspace } from "./onboarding";
import {
  customerSegments,
  decisions,
  opportunities,
  problems,
  signals,
} from "./schema";

async function currentWorkspace() {
  const { workspace } = await ensurePersonalWorkspace();
  return workspace;
}

export async function getDashboardData() {
  const workspace = await currentWorkspace();
  const db = getDb();
  const [signalCount, problemCount, opportunityCount, decisionCount, topOpportunities, recentDecisions] = await Promise.all([
    db.select({ value: count() }).from(signals).where(eq(signals.workspaceId, workspace.id)),
    db.select({ value: count() }).from(problems).where(eq(problems.workspaceId, workspace.id)),
    db.select({ value: count() }).from(opportunities).where(eq(opportunities.workspaceId, workspace.id)),
    db.select({ value: count() }).from(decisions).where(eq(decisions.workspaceId, workspace.id)),
    db.select({ opportunity: opportunities, problemTitle: problems.title })
      .from(opportunities)
      .innerJoin(problems, eq(opportunities.problemId, problems.id))
      .where(eq(opportunities.workspaceId, workspace.id))
      .orderBy(desc(opportunities.priorityScore))
      .limit(3),
    db.select({ decision: decisions, opportunityTitle: opportunities.title })
      .from(decisions)
      .innerJoin(opportunities, eq(decisions.opportunityId, opportunities.id))
      .where(eq(decisions.workspaceId, workspace.id))
      .orderBy(desc(decisions.createdAt))
      .limit(5),
  ]);

  return {
    workspace,
    counts: {
      signals: Number(signalCount[0]?.value ?? 0),
      problems: Number(problemCount[0]?.value ?? 0),
      opportunities: Number(opportunityCount[0]?.value ?? 0),
      decisions: Number(decisionCount[0]?.value ?? 0),
    },
    topOpportunities,
    recentDecisions,
  };
}

export async function getSignalsData() {
  const workspace = await currentWorkspace();
  const db = getDb();
  const [items, segments] = await Promise.all([
    db.select({ signal: signals, segmentName: customerSegments.name })
      .from(signals)
      .leftJoin(customerSegments, eq(signals.segmentId, customerSegments.id))
      .where(eq(signals.workspaceId, workspace.id))
      .orderBy(desc(signals.createdAt)),
    db.select().from(customerSegments).where(eq(customerSegments.workspaceId, workspace.id)).orderBy(customerSegments.name),
  ]);
  return { workspace, items, segments };
}

export async function getProblemsData() {
  const workspace = await currentWorkspace();
  const db = getDb();
  const [items, workspaceSignals] = await Promise.all([
    db.select().from(problems).where(eq(problems.workspaceId, workspace.id)).orderBy(desc(problems.createdAt)),
    db.select().from(signals).where(eq(signals.workspaceId, workspace.id)).orderBy(desc(signals.createdAt)),
  ]);
  return { workspace, items, workspaceSignals };
}

export async function getOpportunitiesData() {
  const workspace = await currentWorkspace();
  const db = getDb();
  const [items, workspaceProblems] = await Promise.all([
    db.select({ opportunity: opportunities, problemTitle: problems.title })
      .from(opportunities)
      .innerJoin(problems, eq(opportunities.problemId, problems.id))
      .where(eq(opportunities.workspaceId, workspace.id))
      .orderBy(desc(opportunities.priorityScore)),
    db.select().from(problems).where(eq(problems.workspaceId, workspace.id)).orderBy(problems.title),
  ]);
  return { workspace, items, workspaceProblems };
}

export async function getDecisionsData() {
  const workspace = await currentWorkspace();
  const db = getDb();
  const [items, workspaceOpportunities] = await Promise.all([
    db.select({ decision: decisions, opportunityTitle: opportunities.title })
      .from(decisions)
      .innerJoin(opportunities, eq(decisions.opportunityId, opportunities.id))
      .where(eq(decisions.workspaceId, workspace.id))
      .orderBy(desc(decisions.createdAt)),
    db.select().from(opportunities).where(eq(opportunities.workspaceId, workspace.id)).orderBy(desc(opportunities.priorityScore)),
  ]);
  return { workspace, items, workspaceOpportunities };
}
