import { Router } from "express";
import { eq, and } from "drizzle-orm";
import { db, candidates } from "@agentic-companies/db";
import { CandidateStatus } from "@agentic-companies/types";
import { verifySiwa } from "../services/siwa.js";

export const candidatesRouter = Router();

candidatesRouter.get("/:postId/candidates", async (req, res) => {
  const postId = req.params.postId as string;
  const status = req.query.status as CandidateStatus | undefined;

  const conditions = [eq(candidates.postId, postId)];
  if (status) {
    conditions.push(eq(candidates.status, status));
  }

  const result = await db
    .select()
    .from(candidates)
    .where(and(...conditions));

  res.json(result);
});

candidatesRouter.post("/:candidateId/verify-wallet", async (req, res) => {
  const candidateId = req.params.candidateId as string;
  const { siwaMessage, siwaSignature } = req.body;

  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.id, candidateId));

  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const { valid, address } = await verifySiwa(siwaMessage, siwaSignature);
  if (
    !valid ||
    address.toLowerCase() !== candidate.walletAddress.toLowerCase()
  ) {
    res.status(401).json({ error: "Wallet verification failed" });
    return;
  }

  res.json({ verified: true, address });
});
