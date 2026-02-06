import { Router } from "express";
import { db, candidates } from "@agentic-companies/db";
import { applicationSchema } from "@agentic-companies/types";
import { validate } from "../middleware/validate.js";
import { verifySiwa } from "../services/siwa.js";

export const applicationsRouter = Router();

applicationsRouter.post(
  "/:postId/apply",
  validate(applicationSchema),
  async (req, res) => {
    const { siwaMessage, siwaSignature, ...data } = req.body;

    const { valid, address } = await verifySiwa(siwaMessage, siwaSignature);
    if (!valid || address.toLowerCase() !== data.walletAddress.toLowerCase()) {
      res.status(401).json({ error: "SIWA verification failed" });
      return;
    }

    const [candidate] = await db
      .insert(candidates)
      .values({
        postId: req.params.postId as string,
        walletAddress: data.walletAddress,
        name: data.name,
        bio: data.bio,
        equityStance: data.equityStance,
      })
      .returning();

    res.status(201).json(candidate);
  },
);
