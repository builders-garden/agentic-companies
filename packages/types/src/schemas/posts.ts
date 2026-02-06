import { z } from "zod";
import { PostStatus } from "../enums.js";

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  requirements: z.array(z.string()).min(1),
  equityRange: z
    .object({
      min: z.number().min(0).max(100),
      max: z.number().min(0).max(100),
    })
    .refine((r) => r.max >= r.min, "max must be >= min"),
  creatorAddress: z.string(),
});

export const postResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  requirements: z.array(z.string()),
  equityRange: z.object({
    min: z.number(),
    max: z.number(),
  }),
  status: z.nativeEnum(PostStatus),
  creatorAddress: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CreatePost = z.infer<typeof createPostSchema>;
export type PostResponse = z.infer<typeof postResponseSchema>;
