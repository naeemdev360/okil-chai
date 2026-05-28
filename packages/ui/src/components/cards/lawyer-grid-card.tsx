import { ConsultationType } from '@repo/shared';
import { Briefcase, Building2, Globe2, MapPin, Phone, Video } from 'lucide-react';
import * as React from 'react';
import { VerifiedCheckIcon } from '../../icons';
import { Badge } from '../ui/badge';
import { FavouriteButton } from '../ui/favourite-button';
import { SurfaceCard } from '../ui/surface-card';
import { StarRating } from '../data-display/star-rating';
import { cn } from '../../utils/cn';

export type LawyerBadge = 'topRated' | 'pro' | 'new' | null;

export interface LawyerCardData {
  readonly id: string;
  readonly initials: string;
  readonly name: string;
  readonly primarySpecialization: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly pricePerHour: number;
  readonly city?: string;
  readonly verified?: boolean;
  readonly consultTypes: ReadonlyArray<ConsultationType>;
  readonly badge?: LawyerBadge;
  readonly bio?: string;
  readonly availableToday?: boolean;
  readonly photoUrl?: string | null;
  readonly yearsOfExperience?: number | null;
  readonly languages?: ReadonlyArray<string>;
}

export interface LawyerGridCardProps {
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

function CardAvatar({
  initials,
  verified,
  photoUrl,
}: {
  initials: string;
  verified: boolean;
  photoUrl: string | null | undefined;
}) {
  return (
    <div className="relative mb-4">
      <div className="size-28 rounded-full overflow-hidden flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.32)] ring-[3px] ring-white/20">
        {photoUrl ? (
          <img src={photoUrl} alt="" aria-hidden className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <span className="font-heading text-[38px] font-bold text-white leading-none tracking-tight">
              {initials}
            </span>
          </div>
        )}
      </div>
      {verified && (
        <span
          className="absolute -bottom-0.5 -right-0.5 size-7 bg-gold rounded-full flex items-center justify-center ring-[2.5px] ring-navy shadow-sm"
          aria-label="Verified"
        >
          <VerifiedCheckIcon className="size-3.5" />
        </span>
      )}
    </div>
  );
}

export function LawyerGridCard({
  data,
  currency = '৳',
  labels,
  isFavourited = false,
  isFavouriteLoading = false,
  onToggleFavourite,
  onProfile,
  onBook,
  className,
}: LawyerGridCardProps) {
  const [hovered, setHovered] = React.useState(false);

  const profileLabel = labels?.viewProfile ?? 'View Profile';
  const bookLabel    = labels?.book ?? 'Book';

  return (
    <SurfaceCard
      elevation="sm"
      padding="none"
      className={cn(
        'relative group flex flex-col overflow-hidden transition-all duration-200 ease-out',
        hovered
          ? 'shadow-[0_20px_60px_rgba(15,31,61,0.18)] -translate-y-1.5 scale-[1.012]'
          : 'scale-100',
        className,
      )}
    >
      {/* Badges + favourite button — above the clickable area */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
        {data.badge === 'topRated' && <Badge variant="topRated">Top Rated</Badge>}
        {data.badge === 'pro'      && <Badge variant="pro">Pro</Badge>}
        {data.badge === 'new'      && <Badge variant="outline" className="border-white/30 text-white/70">New</Badge>}
        {onToggleFavourite && (
          <FavouriteButton
            isFavourited={isFavourited}
            isLoading={isFavouriteLoading}
            onClick={onToggleFavourite}
            className="text-white/60"
          />
        )}
      </div>

      {/* Clickable profile area */}
      <button
        type="button"
        onClick={onProfile}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`View ${data.name}'s profile`}
        className="flex flex-col flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-[inherit]"
      >
        {/* Visual header */}
        <div className="relative bg-gradient-to-b from-navy via-navy to-navy-mid pt-6 pb-5 px-5 flex flex-col items-center">
          {data.availableToday && (
            <span className="absolute top-3 left-3.5 inline-flex items-center gap-1 font-sans text-[10px] font-semibold text-success bg-success-bg rounded-full px-2 py-0.5">
              <span className="size-1.5 rounded-full bg-success" />
              Available
            </span>
          )}

          <CardAvatar
            initials={data.initials}
            verified={data.verified ?? false}
            photoUrl={data.photoUrl}
          />

          <h3 className="font-heading text-[18px] font-semibold text-white text-center leading-tight mb-1 tracking-tight">
            {data.name}
          </h3>
          {data.primarySpecialization && (
            <p className="font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-gold">
              {data.primarySpecialization}
            </p>
          )}
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Rating + city */}
          <div className="flex items-center justify-between mb-2">
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
                <span className="inline-flex items-center gap-1 font-sans text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
                  <Briefcase className="size-2.5 shrink-0" aria-hidden />
                  {data.yearsOfExperience} yrs exp
                </span>
              )}
              {(data.languages?.length ?? 0) > 0 && (
                <span className="inline-flex items-center gap-1 font-sans text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2 py-0.5">
                  <Globe2 className="size-2.5 shrink-0" aria-hidden />
                  {data.languages!.slice(0, 2).join(', ')}
                  {data.languages!.length > 2 && ` +${data.languages!.length - 2}`}
                </span>
              )}
            </div>
          )}

          {/* Bio */}
          {data.bio && (
            <p className="font-sans text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-1">
              {data.bio}
            </p>
          )}

          {/* Consult type pills */}
          {data.consultTypes.length > 0 && (
            <div className="flex gap-1.5 flex-wrap mb-4">
              {data.consultTypes.map((type) => {
                const { icon: Icon, label } = CONSULT_META[type];
                return (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1 font-sans text-[10px] font-medium text-gray-600 bg-gray-50 rounded-full px-2.5 py-1"
                  >
                    <Icon className="size-2.5 shrink-0" aria-hidden />
                    {label}
                  </span>
                );
              })}
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
            <div className="font-sans">
              {data.pricePerHour > 0 ? (
                <>
                  <span className="text-[15px] font-bold text-navy">{currency}{data.pricePerHour.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">/hr</span>
                </>
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </div>
            <span className={cn(
              'inline-flex items-center font-sans text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors duration-150',
              hovered ? 'bg-gold text-navy' : 'bg-gold/10 text-gold',
            )}>
              {profileLabel}
            </span>
          </div>
        </div>
      </button>

      {/* Book button rendered outside clickable area */}
      {onBook && (
        <div className="px-5 pb-4 -mt-2">
          <button
            type="button"
            onClick={onBook}
            className="w-full font-sans text-xs font-semibold py-2 rounded-lg bg-navy text-white hover:bg-navy/90 transition-colors duration-150"
          >
            {bookLabel}
          </button>
        </div>
      )}
    </SurfaceCard>
  );
}
