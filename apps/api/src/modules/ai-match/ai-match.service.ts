import { Inject, Injectable, Logger } from '@nestjs/common';
import type { AiMatchRequest, AiMatchResponse, AiMatchedLawyerResponse, LawyerPublicProfileResponse } from '@repo/shared';
import { LAWYERS_SERVICE, type ILawyersService } from '../lawyers/interfaces/lawyers.interfaces';
import { AI_PROVIDER, type IAiProvider } from '../ai/interfaces/ai-provider.interface';
import type { IAiMatchService } from './interfaces/ai-match.interfaces';

const SPECIALIZATION_SLUGS = [
  'criminal-law', 'family-law', 'corporate-law', 'immigration',
  'real-estate', 'employment', 'intellectual-property', 'tax-law',
  'personal-injury', 'civil-litigation',
] as const;

type SpecializationSlug = typeof SPECIALIZATION_SLUGS[number];

interface CaseAnalysis {
  readonly practiceArea:        string;
  readonly specializationSlug:  SpecializationSlug;
  readonly summary:             string;
}

const BUDGET_PRICE_RANGES: Record<'low' | 'mid' | 'any', { minPrice?: number; maxPrice?: number }> = {
  low: { maxPrice: 100 },
  mid: { minPrice: 100, maxPrice: 250 },
  any: {},
};

const CLASSIFICATION_PROMPT = (description: string) => `
You are a legal case classifier for OkilChai, a lawyer matching platform.
Analyze this legal situation and respond with ONLY valid JSON — no markdown, no explanation.

Description: "${description}"

Respond in this exact shape:
{
  "practiceArea": "<human readable practice area name>",
  "specializationSlug": "<one of the allowed slugs>",
  "summary": "<one sentence summary of the core legal issue>"
}

Allowed slugs: ${SPECIALIZATION_SLUGS.join(', ')}
Pick the closest match. Default to "civil-litigation" when unsure.
`.trim();

@Injectable()
export class AiMatchService implements IAiMatchService {
  private readonly logger = new Logger(AiMatchService.name);

  constructor(
    @Inject(AI_PROVIDER)      private readonly aiProvider: IAiProvider,
    @Inject(LAWYERS_SERVICE)  private readonly lawyersService: ILawyersService,
  ) {}

  async match(request: AiMatchRequest): Promise<AiMatchResponse> {
    const analysis = await this.analyzeCase(request.description);
    const lawyers  = await this.fetchMatchingLawyers(analysis.specializationSlug, request);
    const matches  = this.rankAndScore(lawyers, request);

    return {
      practiceArea: analysis.practiceArea,
      summary:      analysis.summary,
      matches,
    };
  }

  private async analyzeCase(description: string): Promise<CaseAnalysis> {
    try {
      const raw  = await this.aiProvider.complete(CLASSIFICATION_PROMPT(description));
      const json = JSON.parse(raw.trim()) as {
        practiceArea: string;
        specializationSlug: string;
        summary: string;
      };

      const slug = SPECIALIZATION_SLUGS.includes(json.specializationSlug as SpecializationSlug)
        ? (json.specializationSlug as SpecializationSlug)
        : 'civil-litigation';

      return {
        practiceArea:       json.practiceArea,
        specializationSlug: slug,
        summary:            json.summary,
      };
    } catch (err) {
      this.logger.warn('AI classification failed, falling back to general practice', err);
      return {
        practiceArea:       'General Practice',
        specializationSlug: 'civil-litigation',
        summary:            'We matched you with our highest-rated lawyers across key practice areas.',
      };
    }
  }

  private async fetchMatchingLawyers(
    slug: SpecializationSlug,
    request: AiMatchRequest,
  ): Promise<LawyerPublicProfileResponse[]> {
    const priceFilter = BUDGET_PRICE_RANGES[request.budget];

    const { data } = await this.lawyersService.searchLawyers({
      specialization: slug,
      ...priceFilter,
      limit: 10,
    });

    // Fall back to any specialization when zero matches with the price filter
    if (data.length === 0 && request.budget !== 'any') {
      const fallback = await this.lawyersService.searchLawyers({ specialization: slug, limit: 10 });
      return fallback.data;
    }

    return data;
  }

  private rankAndScore(
    lawyers: LawyerPublicProfileResponse[],
    request: AiMatchRequest,
  ): AiMatchedLawyerResponse[] {
    const scored = lawyers.map((lawyer) => ({
      lawyer,
      matchScore: this.computeScore(lawyer, request),
      reasoning:  this.buildReasoning(lawyer),
    }));

    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }

  private computeScore(lawyer: LawyerPublicProfileResponse, request: AiMatchRequest): number {
    const rating  = parseFloat(lawyer.avgRating ?? '0');
    const reviews = lawyer.totalReviews;

    // Rating quality:  0–40 pts
    const ratingScore = (rating / 5) * 40;

    // Review volume confidence: 0–20 pts (caps at 100 reviews)
    const reviewScore = Math.min(reviews / 100, 1) * 20;

    // Urgency + instant booking: 0–15 pts
    const urgencyScore = request.urgency === 'today' && lawyer.isInstantBooking ? 15
      : request.urgency === 'today' ? 5
      : 10;

    // Budget fit: 0–25 pts
    const price       = parseFloat(lawyer.pricePerHour ?? '0');
    const budgetScore = this.budgetFitScore(price, request.budget);

    return Math.round(ratingScore + reviewScore + urgencyScore + budgetScore);
  }

  private budgetFitScore(price: number, budget: 'low' | 'mid' | 'any'): number {
    if (budget === 'any') return 25;
    if (budget === 'low')  return price <= 100  ? 25 : price <= 150 ? 12 : 0;
    /* mid */              return price <= 250  ? 25 : price <= 350 ? 12 : 0;
  }

  private buildReasoning(lawyer: LawyerPublicProfileResponse): string {
    const spec    = lawyer.specializations[0]?.name ?? 'law';
    const rating  = lawyer.avgRating ?? 'N/A';
    const reviews = lawyer.totalReviews;
    const suffix  = lawyer.isInstantBooking ? ' Available for instant booking.' : '';
    return `Matches your case based on ${spec.toLowerCase()} expertise and a ${rating}★ rating from ${reviews} verified reviews.${suffix}`;
  }
}
