import { pgTable, uuid, jsonb, timestamp } from "drizzle-orm/pg-core";
import type { Message } from "@agentic-companies/types";
import { candidates } from "./candidates.js";

export const transcripts = pgTable("transcripts", {
  id: uuid("id").defaultRandom().primaryKey(),
  candidateId: uuid("candidate_id")
    .notNull()
    .references(() => candidates.id),
  messages: jsonb("messages").$type<Message[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
