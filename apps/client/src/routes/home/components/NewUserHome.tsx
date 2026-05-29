import { usePortalAuth } from '@repo/hooks';
import { Reveal, RevealGroup } from '@repo/ui';
import { OnboardingChecklist } from './OnboardingChecklist';
import { PracticeAreasGrid } from './PracticeAreasGrid';
import { WelcomeHero } from './WelcomeHero';

export function NewUserHome() {
  const { user } = usePortalAuth();
  const firstName = user?.firstName ?? 'there';

  return (
    <RevealGroup className="min-w-0">
      <Reveal><WelcomeHero /></Reveal>
      <Reveal><OnboardingChecklist firstName={firstName} /></Reveal>
      <Reveal><PracticeAreasGrid /></Reveal>
    </RevealGroup>
  );
}
