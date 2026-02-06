import Anthropic from "@anthropic-ai/sdk";
import type { Message } from "@agentic-companies/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an HR screening agent for a decentralized hiring platform.
Your role is to interview candidates through a conversational screening process.

Guidelines:
- Be professional but friendly
- Assess technical skills, cultural fit, and equity expectations
- Ask about experience relevant to the role requirements
- Probe for alignment with DAO/decentralized work culture
- After sufficient conversation (typically 5-8 exchanges), provide a screening score 0-100
- End the conversation by saying "SCREENING_COMPLETE" followed by the score`;

export async function conductScreening(
  messages: Message[],
  postRequirements: string[],
  candidateBio: string,
): Promise<string> {
  const contextPrompt = `${SYSTEM_PROMPT}

Role requirements: ${postRequirements.join(", ")}
Candidate bio: ${candidateBio}`;

  const anthropicMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const response = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    system: contextPrompt,
    messages: anthropicMessages,
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

export function extractScore(response: string): number | null {
  const match = response.match(/SCREENING_COMPLETE\s+(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}
