import { Router } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  posts,
  candidates,
  transcripts,
  boardVotes,
  boardRankings,
} from "@agentic-companies/db";
import {
  evaluateRequestSchema,
  CandidateStatus,
  PostStatus,
} from "@agentic-companies/types";
import type { Message } from "@agentic-companies/types";
import { validate } from "../middleware/validate.js";
import { evaluateCandidate } from "../services/board.js";
import { aggregateScores, rankCandidates } from "../services/scoring.js";

export const evaluateRouter = Router();

evaluateRouter.post(
  "/evaluate",
  validate(evaluateRequestSchema),
  async (req, res) => {
    const { postId } = req.body;

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId));

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const screenedCandidates = await db
      .select()
      .from(candidates)
      .where(eq(candidates.status, CandidateStatus.Screened));

    const candidateScores: { candidateId: string; aggregateScore: number }[] =
      [];

    for (const candidate of screenedCandidates) {
      const [transcript] = await db
        .select()
        .from(transcripts)
        .where(eq(transcripts.candidateId, candidate.id));

      const messages = (transcript?.messages as Message[]) ?? [];
      const summary = messages
        .filter((m) => m.role !== "system")
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");

      const votes = await evaluateCandidate(
        {
          name: candidate.name,
          bio: candidate.bio,
          equityStance: candidate.equityStance,
          screeningScore: candidate.screeningScore,
          transcriptSummary: summary,
        },
        post.requirements as string[],
      );

      for (const vote of votes) {
        await db.insert(boardVotes).values({
          candidateId: candidate.id,
          boardMemberId: vote.boardMemberId,
          recommendation: vote.recommendation,
          reasoning: vote.reasoning,
          scores: vote.scores,
        });
      }

      const score = aggregateScores(votes);
      candidateScores.push({ candidateId: candidate.id, aggregateScore: score });

      await db
        .update(candidates)
        .set({ status: CandidateStatus.Evaluating })
        .where(eq(candidates.id, candidate.id));
    }

    const ranked = rankCandidates(candidateScores);

    for (const entry of ranked) {
      await db.insert(boardRankings).values({
        postId,
        candidateId: entry.candidateId,
        rank: entry.rank,
        aggregateScore: entry.aggregateScore,
      });
    }

    await db
      .update(posts)
      .set({ status: PostStatus.Evaluating, updatedAt: new Date() })
      .where(eq(posts.id, postId));

    res.json({ rankings: ranked });
  },
);
