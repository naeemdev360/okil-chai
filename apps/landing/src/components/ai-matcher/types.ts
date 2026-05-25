export type MatcherStage = 'intro' | 'analyzing' | 'results';
export type UrgencyKey   = 'today' | 'thisWeek' | 'noRush';
export type BudgetKey    = 'low' | 'mid' | 'any';

export interface MatcherLawyer {
  readonly id:             string;
  readonly initials:       string;
  readonly name:           string;
  readonly photoUrl:       string | null;
  readonly specialization: string;
  readonly rating:         number;
  readonly reviewCount:    number;
  readonly pricePerHour:   number;
  readonly city:           string;
  readonly languages:      readonly string[];
}

export interface MatchResult extends MatcherLawyer {
  readonly matchScore: number;
  readonly reasoning:  string;
}

export interface MatchAnalysis {
  readonly summary:      string;
  readonly practiceArea: string;
}
