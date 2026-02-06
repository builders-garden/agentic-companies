import { pgTable, uuid, text, real, timestamp } from "drizzle-orm/pg-core";
import { CandidateStatus, EquityStance } from "@agentic-companies/types";
import { posts } from "./posts.js";

export const candidates = pgTable("candidates", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id),
  walletAddress: text("wallet_address").notNull(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  equityStance: text("equity_stance")
    .$type<EquityStance>()
    .notNull(),
  status: text("status")
    .$type<CandidateStatus>()
    .notNull()
    .default(CandidateStatus.Applied),
  screeningScore: real("screening_score"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
