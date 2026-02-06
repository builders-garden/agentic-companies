import { z } from "zod";
import { Recommendation } from "../enums.js";

export const boardVoteSchema = z.object({
  candidateId: z.string().uuid(),
  boardMemberId: z.string(),
  recommendation: z.nativeEnum(Recommendation),
  reasoning: z.string(),
  scores: z.object({
    technical: z.number().min(0).max(10),
    cultural: z.number().min(0).max(10),
    equityAlignment: z.number().min(0).max(10),
  }),
});

export const boardRankingSchema = z.object({
  postId: z.string().uuid(),
  candidateId: z.string().uuid(),
  rank: z.number().int().positive(),
  aggregateScore: z.number(),
  votes: z.array(boardVoteSchema),
});

export const evaluateRequestSchema = z.object({
  postId: z.string().uuid(),
});

export type BoardVote = z.infer<typeof boardVoteSchema>;
export type BoardRanking = z.infer<typeof boardRankingSchema>;
export type EvaluateRequest = z.infer<typeof evaluateRequestSchema>;
