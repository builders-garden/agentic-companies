interface VoteScores {
  technical: number;
  cultural: number;
  equityAlignment: number;
}

interface VoteInput {
  scores: VoteScores;
}

interface RankedCandidate {
  candidateId: string;
  aggregateScore: number;
  rank: number;
}

export function aggregateScores(votes: VoteInput[]): number {
  if (votes.length === 0) return 0;

  const total = votes.reduce((sum, vote) => {
    const voteScore =
      vote.scores.technical * 0.4 +
      vote.scores.cultural * 0.3 +
      vote.scores.equityAlignment * 0.3;
    return sum + voteScore;
  }, 0);

  return Math.round((total / votes.length) * 100) / 100;
}

export function rankCandidates(
  candidateScores: { candidateId: string; aggregateScore: number }[],
): RankedCandidate[] {
  return candidateScores
    .sort((a, b) => b.aggregateScore - a.aggregateScore)
    .map((c, i) => ({ ...c, rank: i + 1 }));
}
