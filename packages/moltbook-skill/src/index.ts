/**
 * MoltBook OpenClaw Skill — Entry Point
 *
 * This skill orchestrates the full hiring flow through an OpenClaw agent:
 *
 * 1. CREATE POST  — Boss describes a role → skill calls HR Agent to create a post
 * 2. APPLY        — Candidates apply via SIWA-verified wallet → skill calls HR Agent
 * 3. SCREEN       — Skill mediates the HR screening conversation between candidate and LLM
 * 4. EVALUATE     — Skill triggers Board Engine to run multi-LLM evaluation
 * 5. DECIDE       — Boss reviews rankings → skill calls HR Agent to finalize decisions
 * 6. FORM DAO     — Skill triggers DAO deployment with accepted members and equity splits
 *
 * Each step maps to an OpenClaw skill action that will be defined
 * when the OpenClaw SDK integration is implemented.
 */

export const SKILL_NAME = "moltbook";
export const SKILL_VERSION = "0.0.1";

export interface SkillContext {
  hrAgentUrl: string;
  boardEngineUrl: string;
}

export function createSkillContext(): SkillContext {
  return {
    hrAgentUrl: process.env.HR_AGENT_URL ?? "http://localhost:3001",
    boardEngineUrl: process.env.BOARD_ENGINE_URL ?? "http://localhost:3002",
  };
}
