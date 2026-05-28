import { ConsultationType } from '@repo/shared';
import { Briefcase, Building2, Globe2, MapPin, Phone, Video } from 'lucide-react';
import * as React from 'react';
import { VerifiedCheckIcon } from '../../icons';
import { Badge } from '../ui/badge';
import { FavouriteButton } from '../ui/favourite-button';
import { SurfaceCard } from '../ui/surface-card';
import { StarRating } from '../data-display/star-rating';
import { cn } from '../../utils/cn';
import type { LawyerCardData } from './lawyer-grid-card';

export interface LawyerListCardProps {
  readonly data: LawyerCardData;
  readonly currency?: string;
  readonly labels?: {
    readonly viewProfile?: string;
    readonly book?: string;
  };
  readonly isFavourited?: boolean;
  readonly isFavouriteLoading?: boolean;
  readonly onToggleFavourite?: () => void;
  readonly onProfile: () => void;
  readonly onBook?: () => void;
  readonly className?: string;
}

const CONSULT_META: Record<ConsultationType, { icon: React.ElementType; label: string }> = {
  [ConsultationType.VIDEO]:     { icon: Video,     label: 'Video'     },
  [ConsultationType.PHONE]:     { icon: Phone,     label: 'Phone'     },
  [ConsultationType.IN_PERSON]: { icon: Building2, label: 'In-person' },
};

function ListAvatar({
  initials,
  verified,
  photoUrl,
}: {
  initials: string;
  verified: boolean;
  photoUrl: string | null | undefined;
}) {
  return (
    <div className="relative shrink-0">
      <div className="size-[72px] rounded-full overflow-hidden flex items-center justify-center ring-2 ring-white shadow-lg">
        {photoUrl ? (
          <img src={photoUrl} alt="" aria-hidden className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-navy flex items-center justify-center">
            <span className="font-heading text-2xl font-semibold text-white leading-none">
              {initials}
            </span>
          </div>
        )}
      </div>
      {verified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 size-5 bg-gold rounded-full flex items-center justify-center ring-2 ring-white shadow-sm"
          aria-label="Verified"
        >
          <VerifiedCheckIcon className="size-2.5" />
        </span>
      )}
    </div>
  );
}

export function LawyerListCard({
  data,
  currency = '৳',
  labels,
  isFavourited = false,
  isFavouriteLoading = false,
  onToggleFavourite,
  onProfile,
  onBook,
  className,
}: LawyerListCardProps) {
  const [hovered, setHovered] = React.useState(false);

  const profileLabel = labels?.viewProfile ?? 'View Profile';
  const bookLabel    = labels?.book ?? 'Book';

  return (
    <SurfaceCard
      asChild
      radius="xl"
      elevation={hovered ? 'lg' : 'sm'}
      padding="none"
      className={cn(
        'flex gap-4 items-start transition-all duration-200 p-5 md:p-6',
        hovered && '-translate-y-0.5',
        className,
      )}
    >
      <article
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ListAvatar
          initials={data.initials}
          verified={data.verified ?? false}
          photoUrl={data.photoUrl}
        />

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <button
                type="button"
                onClick={onProfile}
                className="font-heading text-[17px] font-semibold text-navy leading-tight hover:underline focus-visible:outline-none focus-visible:underline text-left"
              >
                {data.name}
              </button>
              {data.availableToday && (
                <span className="inline-flex items-center gap-1 font-sans text-[10px] font-semibold text-success bg-success-bg rounded-full px-2 py-0.5 shrink-0">
                  <span className="size-1.5 rounded-full bg-success" />
                  Available
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {data.badge === 'topRated' && <Badge variant="topRated">Top Rated</Badge>}
              {data.badge === 'pro'      && <Badge variant="pro">Pro Member</Badge>}
              {data.badge === 'new'      && <Badge variant="outline">New</Badge>}
              {onToggleFavourite && (
                <FavouriteButton
                  isFavourited={isFavourited}
                  isLoading={isFavouriteLoading}
                  onClick={onToggleFavourite}
                />
              )}
            </div>
          </div>

          {/* Specialization */}
          {data.primarySpecialization && (
            <p className="font-sans text-[11px] tracking-[0.06em] uppercase text-gold font-medium mb-2">
              {data.primarySpecialization}
            </p>
          )}

          {/* Rating + location */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <StarRating rating={data.rating} count={data.reviewCount} />
            {data.city && (
              <span className="flex items-center gap-1 font-sans text-xs text-gray-400">
                <MapPin className="size-3 shrink-0" aria-hidden />
                {data.city}
              </span>
            )}
          </div>

          {/* Experience + languages */}
          {((data.yearsOfExperience ?? null) !== null || (data.languages?.length ?? 0) > 0) && (
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              {data.yearsOfExperience != null && (
                <span className="inline-flex items-center gap-1 font-sans text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
                  <Briefcase className="size-3 shrink-0" aria-hidden />
                  {data.yearsOfExperience} yrs exp
                </span>
              )}
              {(data.languages?.length ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 font-sans text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-0.5">
                  <Globe2 className="size-3 shrink-0" aria-hidden />
                  {data.languages!.slice(0, 2).join(', ')}
                  {data.languages!.length > 2 && ` +${data.languages!.length - 2}`}
                </span>
              )}
            </div>
          )}

          {/* Bio */}
          {data.bio && (
            <p className="font-sans text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
              {data.bio}
            </p>
          )}

          {/* Footer: consult types + price + CTAs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {data.consultTypes.map((type) => {
                const { icon: Icon, label } = CONSULT_META[type];
                return (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 font-sans text-xs text-gray-600 bg-gray-50 rounded-full px-2.5 py-1"
                  >
                    <Icon className="size-3 shrink-0" aria-hidden />
                    {label}
                  </span>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              {data.pricePerHour > 0 && (
                <span className="font-sans text-sm font-medium text-navy">
                  {currency}{data.pricePerHour.toLocaleString()}
                  <span className="text-xs font-normal text-gray-400">/hr</span>
                </span>
              )}
              <button
                type="button"
                onClick={onProfile}
                className="inline-flex items-center font-sans text-xs font-semibold px-3.5 py-2 rounded-lg border border-navy/20 text-navy hover:bg-navy hover:text-white transition-colors duration-150"
              >
                {profileLabel}
              </button>
              {onBook && (
                <button
                  type="button"
                  onClick={onBook}
                  className="inline-flex items-center font-sans text-xs font-semibold px-3.5 py-2 rounded-lg bg-gold text-navy hover:bg-gold/90 transition-colors duration-150"
                >
                  {bookLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>
    </SurfaceCard>
  );
}
