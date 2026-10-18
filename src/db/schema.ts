import {
  check,
  integer,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerProfileId: uuid("owner_profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const customerSegments = pgTable("customer_segments", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const problems = pgTable("problems", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const signals = pgTable(
  "signals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    segmentId: uuid("segment_id").references(() => customerSegments.id, {
      onDelete: "set null",
    }),
    problemId: uuid("problem_id").references(() => problems.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    sourceType: text("source_type").notNull(),
    severity: smallint("severity").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "signals_source_type_check",
      sql`${table.sourceType} in ('Interview', 'Support', 'Sales Objection', 'Feature Request')`,
    ),
    check(
      "signals_severity_check",
      sql`${table.severity} between 1 and 5`,
    ),
    check(
      "signals_status_check",
      sql`${table.status} in ('New', 'Reviewed', 'Grouped')`,
    ),
  ],
);

export const opportunities = pgTable(
  "opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    problemId: uuid("problem_id")
      .notNull()
      .references(() => problems.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    frequencyScore: smallint("frequency_score").notNull(),
    severityScore: smallint("severity_score").notNull(),
    willingnessToPayScore: smallint("willingness_to_pay_score").notNull(),
    strategicFitScore: smallint("strategic_fit_score").notNull(),
    effortScore: smallint("effort_score").notNull(),
    priorityScore: numeric("priority_score", {
      precision: 6,
      scale: 2,
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "opportunities_frequency_score_check",
      sql`${table.frequencyScore} between 1 and 5`,
    ),
    check(
      "opportunities_severity_score_check",
      sql`${table.severityScore} between 1 and 5`,
    ),
    check(
      "opportunities_willingness_to_pay_score_check",
      sql`${table.willingnessToPayScore} between 1 and 5`,
    ),
    check(
      "opportunities_strategic_fit_score_check",
      sql`${table.strategicFitScore} between 1 and 5`,
    ),
    check(
      "opportunities_effort_score_check",
      sql`${table.effortScore} between 1 and 5`,
    ),
  ],
);

export const decisions = pgTable(
  "decisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    opportunityId: uuid("opportunity_id")
      .notNull()
      .references(() => opportunities.id, { onDelete: "cascade" }),
    decisionType: text("decision_type").notNull(),
    rationale: text("rationale").notNull(),
    evidenceSummary: text("evidence_summary"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "decisions_decision_type_check",
      sql`${table.decisionType} in ('Build', 'Test', 'Investigate', 'Defer', 'Decline')`,
    ),
  ],
);

export const consentRecords = pgTable("consent_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileId: uuid("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  consentType: text("consent_type").notNull(),
  policyVersion: text("policy_version").notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull(),
  withdrawnAt: timestamp("withdrawn_at", { withTimezone: true }),
});

export type Profile = typeof profiles.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type CustomerSegment = typeof customerSegments.$inferSelect;
export type Problem = typeof problems.$inferSelect;
export type Signal = typeof signals.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type Decision = typeof decisions.$inferSelect;
export type ConsentRecord = typeof consentRecords.$inferSelect;
