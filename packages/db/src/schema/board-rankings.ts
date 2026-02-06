import { pgTable, uuid, integer, real, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts.js";
import { candidates } from "./candidates.js";

export const boardRankings = pgTable("board_rankings", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id),
  rank: integer("rank").notNull(),
  aggregateScore: real("aggregate_score").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
