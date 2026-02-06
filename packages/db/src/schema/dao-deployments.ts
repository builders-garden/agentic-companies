import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { posts } from "./posts.js";

export const daoDeployments = pgTable("dao_deployments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id),
  name: text("name").notNull(),
  members: jsonb("members")
    .$type<{ address: string; equityBps: number }[]>()
    .notNull(),
  status: text("status")
    .$type<"pending" | "deployed" | "failed">()
    .notNull()
    .default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
