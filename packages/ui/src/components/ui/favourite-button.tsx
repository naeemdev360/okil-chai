import * as React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Spinner } from '../loading/spinner';

export interface FavouriteButtonProps {
  readonly isFavourited: boolean;
  readonly isLoading?: boolean;
  readonly onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  readonly className?: string;
  readonly 'aria-label'?: string;
}

export function FavouriteButton({
  isFavourited,
  isLoading = false,
  onClick,
  className,
  'aria-label': ariaLabel,
}: FavouriteButtonProps) {
  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      aria-label={ariaLabel ?? (isFavourited ? 'Remove from saved' : 'Save lawyer')}
      aria-pressed={isFavourited}
      className={cn(
        '-m-1.5 rounded-md p-2 transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
    >
      {isLoading ? (
        <Spinner size="xs" color="current" />
      ) : (
        <Heart
          size={18}
          aria-hidden
          className={cn(
            'transition-colors duration-150',
            isFavourited ? 'fill-error text-error' : 'fill-none text-gray-400 hover:text-error',
          )}
        />
      )}
    </button>
  );
}
