import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, posts, candidates } from "@agentic-companies/db";
import { PostStatus, CandidateStatus } from "@agentic-companies/types";
import { z } from "zod";
import { validate } from "../middleware/validate.js";

const decideSchema = z.object({
  accepted: z.array(z.string().uuid()),
  rejected: z.array(z.string().uuid()),
});

export const decisionsRouter = Router();

decisionsRouter.post(
  "/:postId/decide",
  validate(decideSchema),
  async (req, res) => {
    const postId = req.params.postId as string;
    const { accepted, rejected } = req.body;

    for (const id of accepted) {
      await db
        .update(candidates)
        .set({ status: CandidateStatus.Accepted })
        .where(eq(candidates.id, id));
    }

    for (const id of rejected) {
      await db
        .update(candidates)
        .set({ status: CandidateStatus.Rejected })
        .where(eq(candidates.id, id));
    }

    await db
      .update(posts)
      .set({ status: PostStatus.Decided, updatedAt: new Date() })
      .where(eq(posts.id, postId));

    res.json({ accepted: accepted.length, rejected: rejected.length });
  },
);
