'use client';

import {
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@okil-chai/ui';
import { Role } from '@okil-chai/shared';
import type { UserProfile } from '@okil-chai/api-client';
import { ChevronDown, ExternalLink, LogOut } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCallback } from 'react';
import { useAuthStore } from '../../lib/store/auth.store';
import { getPortalUrl } from '../../lib/auth/portal-routes';

interface UserMenuProps {
  readonly user: UserProfile;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
  const t      = useTranslations('nav.user');
  const locale = useLocale();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const portalUrl   = getPortalUrl(user.role);
  const portalLabel = user.role === Role.LAWYER ? t('goToLawyerPortal') : t('goToClientPortal');
  const initials    = getInitials(user.firstName, user.lastName);

  const handleSignOut = useCallback(async () => {
    await logout();
    router.push(`/${locale}`);
  }, [logout, router, locale]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={t('openUserMenu')}
          className="flex items-center gap-1.5 rounded-md p-1 hover:bg-gray-50 transition-colors duration-200"
        >
          <Avatar initials={initials} size="md" />
          <ChevronDown className="size-3.5 text-gray-400" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal px-3 py-2">
          <p className="font-sans font-semibold text-navy text-sm leading-tight">
            {user.firstName} {user.lastName}
          </p>
          <p className="font-sans text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={portalUrl} className="flex items-center justify-between cursor-pointer">
              {portalLabel}
              <ExternalLink className="size-3.5 text-gray-400" aria-hidden="true" />
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => { void handleSignOut(); }}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <LogOut className="size-3.5 mr-2" aria-hidden="true" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
