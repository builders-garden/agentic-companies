import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { PostStatus } from "@agentic-companies/types";

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requirements: jsonb("requirements").$type<string[]>().notNull(),
  equityMin: text("equity_min").notNull(),
  equityMax: text("equity_max").notNull(),
  status: text("status").$type<PostStatus>().notNull().default(PostStatus.Open),
  creatorAddress: text("creator_address").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
