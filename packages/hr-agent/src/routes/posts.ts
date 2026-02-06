import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, posts } from "@agentic-companies/db";
import { createPostSchema, PostStatus } from "@agentic-companies/types";
import { validate } from "../middleware/validate.js";

export const postsRouter = Router();

postsRouter.post("/", validate(createPostSchema), async (req, res) => {
  const data = req.body;
  const [post] = await db
    .insert(posts)
    .values({
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      equityMin: String(data.equityRange.min),
      equityMax: String(data.equityRange.max),
      creatorAddress: data.creatorAddress,
    })
    .returning();

  res.status(201).json(post);
});

postsRouter.get("/", async (_req, res) => {
  const openPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.status, PostStatus.Open));

  res.json(openPosts);
});
