'use client';

import { useIsFavourited, useToggleFavourite } from '@repo/hooks';
import { FavouriteButton } from '@repo/ui';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../lib/store/auth.store';

interface SaveFavouriteButtonProps {
  readonly lawyerId: string;
  readonly className?: string;
}

export function SaveFavouriteButton({ lawyerId, className }: SaveFavouriteButtonProps) {
  const locale    = useLocale();
  const router    = useRouter();
  const pathname  = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const { data: statusData, isLoading: statusLoading } = useIsFavourited(
    isAuthenticated ? lawyerId : '',
  );
  const { mutate: toggle, isPending } = useToggleFavourite();

  // Don't render during auth bootstrap to avoid flicker
  if (authLoading) return null;

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/signin?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    toggle(lawyerId);
  }

  return (
    <FavouriteButton
      isFavourited={statusData?.isFavourited ?? false}
      isLoading={statusLoading || isPending}
      onClick={handleClick}
      className={className}
    />
  );
}
