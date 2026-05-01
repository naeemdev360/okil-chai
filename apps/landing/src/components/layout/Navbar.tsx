'use client';

import { Button, cn } from '@okil-chai/ui';
import { Menu, X } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';

const NAV_LINKS = [
  { href: '/search',                  label: 'Browse Lawyers' },
  { href: '/#how-it-works',           label: 'How It Works'   },
  { href: '/#pricing',                label: 'Pricing'         },
  { href: '/auth/signup?role=lawyer', label: 'For Lawyers'    },
] as const;

/* ─────────────────────────────────────────────────────────────────────
   Scroll thresholds (px)
───────────────────────────────────────────────────────────────────── */
const SCROLL_THRESHOLD = 24;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const locale = useLocale();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > SCROLL_THRESHOLD);
  });

  const href = (path: string) => `/${locale}${path}`;

  /* ── Link styling adapts to transparent vs frosted state ── */
  const linkClass = cn(
    'font-sans text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200',
    scrolled
      ? 'text-gray-600 hover:text-navy hover:bg-gray-50'
      : 'text-gray-600 hover:text-navy hover:bg-gray-50',
  );

  return (
    <motion.header
      className="sticky top-0 z-50"
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
        className="max-w-[1200px] mx-auto px-6 lg:px-8 flex items-center h-16 gap-8"
        aria-label="Main navigation"
      >
        {/* Logo — switches variant with scroll */}
        <Link href={href('/')} aria-label="OkilChai home">
          <Logo size="md" variant="dark" />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-1 flex-1 list-none">
          {NAV_LINKS.map(({ href: path, label }) => (
            <li key={path}>
              <Link href={href(path)} className={linkClass}>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <LocaleSwitcher />

          {/* Sign In — plain link so we can control colour in both states */}
          <Link
            href={href('/auth/signin')}
            className={cn(
              'font-sans text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200',
              scrolled
                ? 'text-gray-600 hover:text-navy'
                : 'text-gray-600 hover:text-navy',
            )}
          >
            Sign In
          </Link>

          <Button variant="gold" size="md" asChild>
            <Link href={href('/auth/signup')}>Get Started</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={cn(
            'md:hidden ml-auto p-2 rounded-md transition-colors duration-200',
            scrolled
              ? 'text-gray-600 hover:text-navy hover:bg-gray-50'
              : 'text-gray-600 hover:text-navy hover:bg-gray-50',
          )}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu — always solid white */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ href: path, label }) => (
            <Link
              key={path}
              href={href(path)}
              onClick={() => setMobileOpen(false)}
              className="font-sans text-sm font-medium text-gray-600 px-3 py-2.5 rounded-md hover:text-navy hover:bg-gray-50 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <LocaleSwitcher />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Button variant="outline" size="md" asChild className="w-full justify-center">
              <Link href={href('/auth/signin')} onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button variant="gold" size="md" asChild className="w-full justify-center">
              <Link href={href('/auth/signup')} onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      )}
    </motion.header>
  );
}
