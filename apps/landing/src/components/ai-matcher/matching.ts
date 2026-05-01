import { MATCHER_LAWYERS } from './constants';
import type { MatchResult, MatchAnalysis } from './types';

interface FallbackResult {
  readonly results:  MatchResult[];
  readonly analysis: MatchAnalysis;
}

type Pattern = [regex: RegExp, indices: [number, number, number], practiceArea: string];

const PATTERNS: readonly Pattern[] = [
  [/landlord|evict|lease|rent|property/,            [4, 1, 2], 'Real Estate'   ],
  [/business|incorporat|company|llc|corporate|startup/, [2, 5, 0], 'Corporate Law' ],
  [/dui|arrest|criminal|charged|crime|defense/,     [0, 1, 2], 'Criminal Law'  ],
  [/visa|immigration|green card|deport|citizenship/, [3, 1, 2], 'Immigration'   ],
  [/employ|fired|terminat|discriminat|harassment/,  [5, 0, 2], 'Employment Law'],
];

function buildResults(indices: [number, number, number]): MatchResult[] {
  return indices.map((idx, rank) => {
    const lawyer = MATCHER_LAWYERS[idx]!;
    return {
      ...lawyer,
      matchScore: 95 - rank * 6,
      reasoning: `Matches your case based on ${lawyer.specialization.toLowerCase()} expertise and a ${lawyer.rating}★ rating from ${lawyer.reviewCount} verified reviews.`,
    };
  });
}

export function buildFallbackResults(description: string): FallbackResult {
  const lower = description.toLowerCase();
  const match = PATTERNS.find(([regex]) => regex.test(lower));

  if (match) {
    const [, indices, practiceArea] = match;
    return {
      results: buildResults(indices),
      analysis: { summary: 'We identified the core legal issue and matched you with verified specialists.', practiceArea },
    };
  }

  return {
    results: buildResults([0, 3, 1]),
    analysis: { summary: 'We matched you with our highest-rated lawyers across key practice areas.', practiceArea: 'General Practice' },
  };
}
