'use client';

import { Button, cn } from '@repo/ui';
import { brand } from '../../lib/brand';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '../../lib/store/auth.store';
import { getPortalUrl } from '../../lib/auth/portal-routes';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';
import { NotificationBell } from './NotificationBell';
import { UserMenu } from './UserMenu';

const NAV_LINKS = [
  { href: '/search',                  label: 'Browse Lawyers' },
  { href: '/ai-match',                label: '✦ AI Match'     },
  { href: '/#how-it-works',           label: 'How It Works'   },
  { href: '/#pricing',                label: 'Pricing'         },
  { href: '/auth/signup?role=lawyer', label: 'For Lawyers'    },
] as const;

const SCROLL_THRESHOLD = 24;

function isLinkActive(pathname: string, locale: string, linkHref: string): boolean {
  const basePath = (linkHref.split('#')[0] ?? '').split('?')[0] ?? '';
  if (!basePath || basePath === '/') return false;
  const localizedBase = `/${locale}${basePath}`;
  return pathname === localizedBase || pathname.startsWith(`${localizedBase}/`);
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const locale                      = useLocale();
  const pathname                    = usePathname();
  const { scrollY }                 = useScroll();
  const t                           = useTranslations('nav');
  const user                        = useAuthStore((s) => s.user);
  const isLoading                   = useAuthStore((s) => s.isLoading);
  const isLoggedIn                  = user !== null;

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > SCROLL_THRESHOLD);
  });

  const href = (path: string) => `/${locale}${path}`;

  const desktopLinkClass = (linkHref: string) =>
    cn(
      'font-sans text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200',
      isLinkActive(pathname, locale, linkHref)
        ? 'text-navy bg-gold/10 font-semibold'
        : 'text-gray-600 hover:text-navy hover:bg-gray-50',
    );

  const mobileLinkClass = (linkHref: string) =>
    cn(
      'font-sans text-sm font-medium px-3 py-2.5 rounded-md transition-colors',
      isLinkActive(pathname, locale, linkHref)
        ? 'text-navy bg-gold/10 font-semibold'
        : 'text-gray-600 hover:text-navy hover:bg-gray-50',
    );

  return (
    <motion.header
      className="sticky top-0 z-50 w-full"
      animate={{
        backgroundColor: scrolled
          ? 'rgba(255, 255, 255, 0.88)'
          : 'rgba(255, 255, 255, 0)',
        boxShadow: scrolled
          ? '0 4px 24px rgba(0,0,0,0.07), 0 1px 0 rgba(200,168,75,0.10)'
          : '0 0 0 rgba(0,0,0,0)',
        backdropFilter: scrolled
          ? 'blur(20px) saturate(1.6)'
          : 'blur(0px) saturate(1)',
      }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
    >
      <nav
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4 lg:gap-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href={href('/')} aria-label={`${brand.name} home`} className="flex-shrink-0">
          <Logo size="md" variant="dark" />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-1 flex-1 list-none m-0 p-0">
          {NAV_LINKS.map(({ href: path, label }) => (
            <li key={path}>
              <Link
                href={href(path)}
                className={desktopLinkClass(path)}
                aria-current={isLinkActive(pathname, locale, path) ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
          <LocaleSwitcher />

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" aria-hidden="true" />
          ) : isLoggedIn ? (
            <>
              <NotificationBell role={user.role} />
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link
                href={href('/auth/signin')}
                className={cn(
                  'font-sans text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200',
                  isLinkActive(pathname, locale, '/auth/signin')
                    ? 'text-navy font-semibold'
                    : 'text-gray-600 hover:text-navy',
                )}
                aria-current={isLinkActive(pathname, locale, '/auth/signin') ? 'page' : undefined}
              >
                {t('signIn')}
              </Link>
              <Button variant="gold" size="md" asChild>
                <Link href={href('/auth/signup')}>{t('getStarted')}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Tablet: show locale + CTA, hide full nav */}
        <div className="hidden md:flex lg:hidden items-center gap-2 ml-auto flex-shrink-0">
          <LocaleSwitcher />
          {isLoading ? (
            <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse" aria-hidden="true" />
          ) : isLoggedIn ? (
            <UserMenu user={user} />
          ) : (
            <Button variant="gold" size="sm" asChild>
              <Link href={href('/auth/signup')}>{t('getStarted')}</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={cn(
            'md:hidden ml-auto p-2 rounded-md transition-colors duration-200 flex-shrink-0',
            'text-gray-600 hover:text-navy hover:bg-gray-50',
          )}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Tablet toggle (md only) */}
        <button
          className={cn(
            'hidden md:flex lg:hidden p-2 rounded-md transition-colors duration-200 flex-shrink-0',
            'text-gray-600 hover:text-navy hover:bg-gray-50',
          )}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile / Tablet slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="lg:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ href: path, label }) => (
                <Link
                  key={path}
                  href={href(path)}
                  onClick={() => setMobileOpen(false)}
                  className={mobileLinkClass(path)}
                  aria-current={isLinkActive(pathname, locale, path) ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <LocaleSwitcher />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                {isLoggedIn ? (
                  <Button variant="gold" size="md" asChild className="w-full justify-center">
                    <Link href={getPortalUrl(user.role)} onClick={() => setMobileOpen(false)}>
                      {t('user.goToPortal')}
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="md" asChild className="w-full sm:flex-1 justify-center">
                      <Link href={href('/auth/signin')} onClick={() => setMobileOpen(false)}>
                        {t('signIn')}
                      </Link>
                    </Button>
                    <Button variant="gold" size="md" asChild className="w-full sm:flex-1 justify-center">
                      <Link href={href('/auth/signup')} onClick={() => setMobileOpen(false)}>
                        {t('getStarted')}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
