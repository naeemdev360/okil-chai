import { useFavouriteLawyers } from '@repo/hooks';
import { Avatar, Button, StarRating } from '@repo/ui';
import { Link } from 'react-router-dom';
import { appUrls } from '../../../lib/app-urls';

export function SavedLawyersWidget() {
  const { data }  = useFavouriteLawyers({ limit: 2 });
  const preview   = data?.lawyers ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <span className="font-heading text-[15px] font-semibold text-navy">Saved Lawyers</span>
        <Link
          to="/saved"
          className="text-xs font-semibold text-gold font-sans hover:opacity-75 transition-opacity"
        >
          View all
        </Link>
      </div>

      {preview.map((l, i) => {
        const initials = `${l.firstName[0]}${l.lastName[0]}`.toUpperCase();
        const rating   = l.avgRating !== null ? parseFloat(l.avgRating) : 0;

        return (
          <div
            key={l.id}
            className={`flex items-center gap-2.5 px-5 py-3.5${i === 0 ? ' border-b border-gray-100' : ''}`}
          >
            <Avatar src={l.photoUrl} initials={initials} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-navy font-sans">
                {l.firstName} {l.lastName}
              </p>
              <StarRating rating={rating} count={null} size="xs" />
            </div>
            <Button variant="primary" size="sm" onClick={() => { window.location.href = appUrls.book(l.id); }}>
              Book
            </Button>
          </div>
        );
      })}
    </div>
  );
}
