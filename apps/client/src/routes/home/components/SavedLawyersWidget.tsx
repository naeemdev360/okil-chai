import { Avatar, Button, StarRating } from '@okil-chai/ui';
import { Link, useNavigate } from 'react-router-dom';
import { SAVED_LAWYERS } from '../../../lib/mock-data';

export function SavedLawyersWidget() {
  const navigate = useNavigate();
  const preview  = SAVED_LAWYERS.slice(0, 2);

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

      {preview.map((l, i) => (
        <div
          key={l.id}
          className={`flex items-center gap-2.5 px-5 py-3.5${i === 0 ? ' border-b border-gray-100' : ''}`}
        >
          <Avatar initials={l.initials} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-navy font-sans">{l.name}</p>
            <StarRating rating={l.rating} count={null} size="xs" />
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/booking')}>
            Book
          </Button>
        </div>
      ))}
    </div>
  );
}
