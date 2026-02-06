import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, candidates, transcripts, posts } from "@agentic-companies/db";
import { sendMessageSchema, CandidateStatus } from "@agentic-companies/types";
import type { Message } from "@agentic-companies/types";
import { validate } from "../middleware/validate.js";
import { conductScreening, extractScore } from "../services/screening.js";

export const screeningRouter = Router();

screeningRouter.post(
  "/:candidateId/messages",
  validate(sendMessageSchema),
  async (req, res) => {
    const candidateId = req.params.candidateId as string;
    const { content } = req.body;

    const [candidate] = await db
      .select()
      .from(candidates)
      .where(eq(candidates.id, candidateId));

    if (!candidate) {
      res.status(404).json({ error: "Candidate not found" });
      return;
    }

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, candidate.postId));

    let [transcript] = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.candidateId, candidateId));

    const existingMessages: Message[] = transcript
      ? (transcript.messages as Message[])
      : [];

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    const updatedMessages = [...existingMessages, userMessage];

    const assistantContent = await conductScreening(
      updatedMessages,
      post.requirements as string[],
      candidate.bio,
    );

    const assistantMessage: Message = {
      role: "assistant",
      content: assistantContent,
      timestamp: new Date(),
    };
    const finalMessages = [...updatedMessages, assistantMessage];

    if (transcript) {
      await db
        .update(transcripts)
        .set({ messages: finalMessages, updatedAt: new Date() })
        .where(eq(transcripts.id, transcript.id));
    } else {
      await db.insert(transcripts).values({
        candidateId,
        messages: finalMessages,
      });
    }

    const score = extractScore(assistantContent);
    if (score !== null) {
      await db
        .update(candidates)
        .set({
          status: CandidateStatus.Screened,
          screeningScore: score,
        })
        .where(eq(candidates.id, candidateId));
    } else if (candidate.status === CandidateStatus.Applied) {
      await db
        .update(candidates)
        .set({ status: CandidateStatus.Screening })
        .where(eq(candidates.id, candidateId));
    }

    res.json({ message: assistantMessage, score });
  },
);
