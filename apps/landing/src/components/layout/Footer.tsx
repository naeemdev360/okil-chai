import Link from 'next/link';
import { XTwitterIcon, LinkedInIcon, FacebookIcon } from '@repo/ui';
import { brand } from '../../lib/brand';
import { Logo } from './Logo';

const FOOTER_COLS = [
  {
    title: 'For Clients',
    links: [
      { label: 'Browse Lawyers',  href: '/search'           },
      { label: 'How It Works',    href: '/#how-it-works'    },
      { label: 'Pricing',         href: '/#pricing'         },
      { label: 'Help Center',     href: '/help'             },
    ],
  },
  {
    title: 'For Lawyers',
    links: [
      { label: 'Join as a Lawyer',       href: '/auth/signup?role=lawyer' },
      { label: 'Verification Process',   href: '/lawyers/verification'    },
      { label: 'Lawyer Resources',       href: '/lawyers/resources'       },
      { label: 'Partner Program',        href: '/lawyers/partners'        },
    ],
  },
  {
    title: 'Practice Areas',
    links: [
      { label: 'Criminal Law',  href: '/search?area=criminal'  },
      { label: 'Family Law',    href: '/search?area=family'    },
      { label: 'Corporate Law', href: '/search?area=corporate' },
      { label: 'Immigration',   href: '/search?area=immigration'},
      { label: 'View All',      href: '/search'                 },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about'   },
      { label: 'Careers',  href: '/careers' },
      { label: 'Blog',     href: '/blog'    },
      { label: 'Contact',  href: '/contact' },
    ],
  },
] as const;

const SOCIAL_LINKS: ReadonlyArray<{ name: string; href: string; Icon: React.ElementType }> = [
  { name: 'X (Twitter)', href: '#', Icon: XTwitterIcon  },
  { name: 'LinkedIn',    href: '#', Icon: LinkedInIcon  },
  { name: 'Facebook',    href: '#', Icon: FacebookIcon  },
];

const LEGAL_LINKS = ['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Accessibility'] as const;

interface FooterProps {
  readonly locale: string;
}

export function Footer({ locale }: FooterProps) {
  const href = (path: string) => `/${locale}${path}`;

  return (
    <footer className="bg-[#0E1A2B] text-white/75 pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10 mb-14 pb-10 border-b border-white/10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Logo variant="light" size="md" className="mb-4" />
            <p className="font-sans text-sm leading-relaxed text-white/55 mb-5 max-w-[300px]">
              Connecting people with trusted, verified lawyers. Justice, made accessible.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ name, href: socialHref, Icon }) => (
                <a
                  key={name}
                  href={socialHref}
                  aria-label={name}
                  className="size-9 rounded-full bg-white/6 border border-white/12 flex items-center justify-center text-white/70 transition-all duration-150 hover:bg-gold hover:border-gold hover:text-navy"
                >
                  <Icon className="size-[15px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-white mb-4">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5 list-none">
                {col.links.map(({ label, href: colHref }) => (
                  <li key={label}>
                    <Link
                      href={href(colHref)}
                      className="font-sans text-sm text-white/60 hover:text-gold transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
          <p className="font-sans text-xs text-white/45">
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            {LEGAL_LINKS.map((label) => (
              <Link
                key={label}
                href="#"
                className="font-sans text-xs text-white/50 hover:text-gold transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-6 pt-5 border-t border-white/8 font-sans text-[11px] text-white/35 leading-relaxed">
          {brand.legalDisclaimer}
        </p>
      </div>
    </footer>
  );
}
