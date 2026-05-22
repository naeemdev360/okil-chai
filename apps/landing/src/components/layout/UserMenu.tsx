'use client';

import type { UserProfile } from '@repo/api-client';
import { Role } from '@repo/shared';
import {
  Avatar,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui';
import { ChevronDown, ExternalLink, LogOut, MailWarning } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { getPortalUrl, getPrimaryRole, usesLawyerPortal } from '../../lib/auth/portal-routes';
import { useAuthStore } from '../../lib/store/auth.store';
import { WIZARD_TOTAL_STEPS } from '../../lib/onboarding-progress';

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

  const primaryRole = getPrimaryRole(user.roles);
  const portalUrl   = getPortalUrl(primaryRole);
  const portalLabel = usesLawyerPortal(primaryRole)
    ? t('goToLawyerPortal')
    : t('goToClientPortal');
  const initials = getInitials(user.firstName, user.lastName);

  const isLawyer         = user.roles.includes(Role.LAWYER);
  const needsEmailVerify = isLawyer && !user.isVerified;
  const needsOnboarding  = isLawyer && user.isVerified && !user.onboardingComplete;
  
  const showOnboardingBanner = needsEmailVerify || needsOnboarding;

  const progress = needsOnboarding
    ? Math.min(Math.round(((user.onboardingStep ?? 0) / WIZARD_TOTAL_STEPS) * 100), 100)
    : 0;

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
          {/* Pulse ring on avatar when lawyer has pending actions */}
          <span className="relative inline-flex">
            <Avatar initials={initials} size="md" />
            {showOnboardingBanner && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white',
                  needsEmailVerify ? 'bg-amber-400' : 'bg-gold',
                )}
              />
            )}
          </span>
          <ChevronDown className="size-3.5 text-gray-400" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal px-3 py-2">
          <p className="font-sans font-semibold text-navy text-sm leading-tight">
            {user.firstName} {user.lastName}
          </p>
          <p className="font-sans text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
        </DropdownMenuLabel>

        {/* ── Onboarding progress banner ─────────────────────────────────── */}
        {showOnboardingBanner && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2.5">
              {needsEmailVerify ? (
                <Link
                  href={`/${locale}/onboarding/lawyer`}
                  className="flex items-start gap-2.5 rounded-md p-2.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <MailWarning className="size-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-amber-800 leading-tight">
                      {t('onboarding.verifyFirst')}
                    </p>
                    <p className="font-sans text-[11px] text-amber-600 mt-0.5">
                      {t('onboarding.verifyHint')}
                    </p>
                  </div>
                </Link>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-sans text-xs font-semibold text-navy">
                      <span>{t('onboarding.profileSetup')}</span>  <span className="font-heading text-xs font-bold text-navy w-7 text-right shrink-0">
                      ( {progress}% )
                    </span>
                    </p>
                    <span className="font-sans text-xs text-gray-400">
                      {t('onboarding.stepsComplete', { current: Math.round(progress / (100 / 6)), total: 6 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-gold rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                   
                  </div>

                  <Link
                    href={`/${locale}/onboarding/lawyer`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-md bg-navy text-white font-sans text-xs font-semibold hover:bg-navy/90 transition-colors"
                  >
                    {t('onboarding.completeProfile')}
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

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
