import {
  pgTable,
  uuid,
  text,
  real,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { Recommendation } from "@agentic-companies/types";
import { candidates } from "./candidates.js";

export const boardVotes = pgTable("board_votes", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id),
  boardMemberId: text("board_member_id").notNull(),
  recommendation: text("recommendation")
    .$type<Recommendation>()
    .notNull(),
  reasoning: text("reasoning").notNull(),
  scores: jsonb("scores")
    .$type<{ technical: number; cultural: number; equityAlignment: number }>()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
