'use client';

import { useState } from 'react';
import { useAiMatch } from '@repo/hooks';
import type { AiMatchedLawyerResponse } from '@repo/api-client';
import { IntroStage }    from './components/IntroStage';
import { AnalyzingStage } from './components/AnalyzingStage';
import { ResultsStage }  from './components/ResultsStage';
import { MIN_DESCRIPTION_LENGTH } from './constants';
import type { MatcherStage, UrgencyKey, BudgetKey, MatchResult, MatchAnalysis } from './types';

function toMatchResult(matched: AiMatchedLawyerResponse): MatchResult {
  const { lawyer, matchScore, reasoning } = matched;
  const firstName = lawyer.firstName;
  const lastName  = lawyer.lastName;
  return {
    id:             lawyer.id,
    initials:       `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase(),
    name:           `${firstName} ${lastName}`,
    photoUrl:       lawyer.photoUrl,
    specialization: lawyer.specializations[0]?.name ?? 'General Practice',
    rating:         parseFloat(lawyer.avgRating ?? '0'),
    reviewCount:    lawyer.totalReviews,
    pricePerHour:   parseFloat(lawyer.pricePerHour ?? '0'),
    city:           lawyer.city ?? '',
    languages:      lawyer.languages,
    matchScore,
    reasoning,
  };
}

export function AiMatcherFlow() {
  const [stage, setStage]           = useState<MatcherStage>('intro');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency]       = useState<UrgencyKey>('thisWeek');
  const [budget, setBudget]         = useState<BudgetKey>('any');
  const [results, setResults]       = useState<readonly MatchResult[]>([]);
  const [analysis, setAnalysis]     = useState<MatchAnalysis>({ summary: '', practiceArea: '' });
  const [error, setError]           = useState<string | null>(null);

  const { mutate: runMatch } = useAiMatch();

  const handleDescChange = (val: string) => { setDescription(val); setError(null); };

  const handleSubmit = () => {
    if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
      setError('Please describe your situation in at least 20 characters.');
      return;
    }

    setStage('analyzing');

    runMatch(
      { description, urgency, budget },
      {
        onSuccess: (data) => {
          setResults(data.matches.map(toMatchResult));
          setAnalysis({ summary: data.summary, practiceArea: data.practiceArea });
          setStage('results');
        },
        onError: () => {
          setStage('intro');
          setError('Something went wrong. Please try again.');
        },
      },
    );
  };

  const handleReset = () => {
    setStage('intro');
    setResults([]);
    setAnalysis({ summary: '', practiceArea: '' });
    setError(null);
  };

  if (stage === 'intro') return (
    <IntroStage
      description={description}
      urgency={urgency}
      budget={budget}
      error={error}
      onDescChange={handleDescChange}
      onUrgencyChange={setUrgency}
      onBudgetChange={setBudget}
      onSubmit={handleSubmit}
    />
  );

  if (stage === 'analyzing') return <AnalyzingStage />;

  return <ResultsStage results={results} analysis={analysis} onReset={handleReset} />;
}
