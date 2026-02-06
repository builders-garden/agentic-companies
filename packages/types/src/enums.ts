export enum PostStatus {
  Draft = "draft",
  Open = "open",
  Screening = "screening",
  Evaluating = "evaluating",
  Decided = "decided",
  Closed = "closed",
}

export enum CandidateStatus {
  Applied = "applied",
  Screening = "screening",
  Screened = "screened",
  Evaluating = "evaluating",
  Accepted = "accepted",
  Rejected = "rejected",
}

export enum EquityStance {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum Recommendation {
  StrongHire = "strong_hire",
  Hire = "hire",
  Neutral = "neutral",
  NoHire = "no_hire",
  StrongNoHire = "strong_no_hire",
}
