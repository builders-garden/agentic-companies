import { z } from "zod";

export const daoDeploymentSchema = z.object({
  postId: z.string().uuid(),
  name: z.string().min(1),
  members: z.array(
    z.object({
      address: z.string(),
      equityBps: z.number().int().min(0).max(10000),
    })
  ),
});

export const daoDeploymentResponseSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  name: z.string(),
  members: z.array(
    z.object({
      address: z.string(),
      equityBps: z.number(),
    })
  ),
  status: z.enum(["pending", "deployed", "failed"]),
  createdAt: z.coerce.date(),
});

export type DaoDeployment = z.infer<typeof daoDeploymentSchema>;
export type DaoDeploymentResponse = z.infer<typeof daoDeploymentResponseSchema>;
