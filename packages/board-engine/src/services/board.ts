import Anthropic from "@anthropic-ai/sdk";
import type { Recommendation } from "@agentic-companies/types";

const client = new Anthropic();

interface CandidateProfile {
  name: string;
  bio: string;
  equityStance: string;
  screeningScore: number | null;
  transcriptSummary: string;
}

interface BoardVoteResult {
  boardMemberId: string;
  recommendation: Recommendation;
  reasoning: string;
  scores: {
    technical: number;
    cultural: number;
    equityAlignment: number;
  };
}

const BOARD_PERSONAS = [
  {
    id: "tech-lead",
    system: `You are a technical lead on a DAO hiring board.
Evaluate candidates primarily on technical ability and potential to deliver.
Be rigorous but fair. Output JSON with: recommendation, reasoning, scores (technical, cultural, equityAlignment each 0-10).`,
  },
  {
    id: "culture-guardian",
    system: `You are the culture guardian on a DAO hiring board.
Evaluate candidates primarily on cultural fit, collaboration skills, and alignment with decentralized values.
Output JSON with: recommendation, reasoning, scores (technical, cultural, equityAlignment each 0-10).`,
  },
  {
    id: "equity-strategist",
    system: `You are the equity strategist on a DAO hiring board.
Evaluate candidates primarily on equity expectations alignment and long-term commitment signals.
Output JSON with: recommendation, reasoning, scores (technical, cultural, equityAlignment each 0-10).`,
  },
];

export async function evaluateCandidate(
  candidate: CandidateProfile,
  postRequirements: string[],
): Promise<BoardVoteResult[]> {
  const candidateContext = `
Candidate: ${candidate.name}
Bio: ${candidate.bio}
Equity Stance: ${candidate.equityStance}
Screening Score: ${candidate.screeningScore ?? "N/A"}
Transcript Summary: ${candidate.transcriptSummary}
Role Requirements: ${postRequirements.join(", ")}

Provide your evaluation as JSON:
{
  "recommendation": "strong_hire" | "hire" | "neutral" | "no_hire" | "strong_no_hire",
  "reasoning": "...",
  "scores": { "technical": 0-10, "cultural": 0-10, "equityAlignment": 0-10 }
}`;

  const votes = await Promise.all(
    BOARD_PERSONAS.map(async (persona) => {
      const response = await client.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: persona.system,
        messages: [{ role: "user", content: candidateContext }],
      });

      const block = response.content[0];
      const text = block.type === "text" ? block.text : "{}";
      const parsed = JSON.parse(text) as Omit<BoardVoteResult, "boardMemberId">;

      return {
        boardMemberId: persona.id,
        ...parsed,
      };
    }),
  );

  return votes;
}
