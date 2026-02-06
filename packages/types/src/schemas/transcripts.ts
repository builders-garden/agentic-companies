import { z } from "zod";

export const messageSchema = z.object({
  role: z.enum(["system", "assistant", "user"]),
  content: z.string(),
  timestamp: z.coerce.date(),
});

export const transcriptSchema = z.object({
  id: z.string().uuid(),
  candidateId: z.string().uuid(),
  messages: z.array(messageSchema),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1),
});

export type Message = z.infer<typeof messageSchema>;
export type Transcript = z.infer<typeof transcriptSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;
