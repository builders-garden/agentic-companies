import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, boardRankings, boardVotes, candidates } from "@agentic-companies/db";

export const rankingsRouter = Router();

rankingsRouter.get("/rankings/:postId", async (req, res) => {
  const postId = req.params.postId as string;

  const rankings = await db
    .select()
    .from(boardRankings)
    .where(eq(boardRankings.postId, postId))
    .orderBy(boardRankings.rank);

  const results = await Promise.all(
    rankings.map(async (ranking) => {
      const votes = await db
        .select()
        .from(boardVotes)
        .where(eq(boardVotes.candidateId, ranking.candidateId));

      const [candidate] = await db
        .select()
        .from(candidates)
        .where(eq(candidates.id, ranking.candidateId));

      return {
        ...ranking,
        candidate,
        votes,
      };
    }),
  );

  res.json(results);
});
