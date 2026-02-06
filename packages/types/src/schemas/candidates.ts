import { z } from "zod";
import { CandidateStatus, EquityStance } from "../enums.js";

export const applicationSchema = z.object({
  postId: z.string().uuid(),
  walletAddress: z.string(),
  name: z.string().min(1),
  bio: z.string().min(1),
  equityStance: z.nativeEnum(EquityStance),
  siwaMessage: z.string(),
  siwaSignature: z.string(),
});

export const candidateSummarySchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  walletAddress: z.string(),
  name: z.string(),
  bio: z.string(),
  equityStance: z.nativeEnum(EquityStance),
  status: z.nativeEnum(CandidateStatus),
  screeningScore: z.number().nullable(),
  createdAt: z.coerce.date(),
});

export type Application = z.infer<typeof applicationSchema>;
export type CandidateSummary = z.infer<typeof candidateSummarySchema>;
