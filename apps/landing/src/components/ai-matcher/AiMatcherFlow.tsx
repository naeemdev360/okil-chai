'use client';

import { useState, useEffect } from 'react';
import { IntroStage }    from './components/IntroStage';
import { AnalyzingStage } from './components/AnalyzingStage';
import { ResultsStage }  from './components/ResultsStage';
import { buildFallbackResults } from './matching';
import { ANALYSIS_DELAY_MS, MIN_DESCRIPTION_LENGTH } from './constants';
import type { MatcherStage, UrgencyKey, BudgetKey, MatchResult, MatchAnalysis } from './types';

export function AiMatcherFlow() {
  const [stage, setStage]           = useState<MatcherStage>('intro');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency]       = useState<UrgencyKey>('thisWeek');
  const [budget, setBudget]         = useState<BudgetKey>('any');
  const [results, setResults]       = useState<readonly MatchResult[]>([]);
  const [analysis, setAnalysis]     = useState<MatchAnalysis>({ summary: '', practiceArea: '' });
  const [error, setError]           = useState<string | null>(null);

  const handleDescChange = (val: string) => { setDescription(val); setError(null); };

  const handleSubmit = () => {
    if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
      setError('Please describe your situation in at least 20 characters.');
      return;
    }
    setStage('analyzing');
  };

  const handleReset = () => {
    setStage('intro');
    setResults([]);
    setAnalysis({ summary: '', practiceArea: '' });
  };

  useEffect(() => {
    if (stage !== 'analyzing') return;
    const id = window.setTimeout(() => {
      const { results: matched, analysis: analysisResult } = buildFallbackResults(description);
      setResults(matched);
      setAnalysis(analysisResult);
      setStage('results');
    }, ANALYSIS_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [stage, description]);

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
