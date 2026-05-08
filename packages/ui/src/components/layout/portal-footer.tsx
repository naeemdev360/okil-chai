import * as React from 'react';
import { cn } from '../../utils/cn';

export interface PortalFooterLink {
  readonly label: string;
  readonly href: string;
}

export interface PortalFooterProps {
  readonly brandName: string;
  readonly tagline?: string;
  readonly quickLinks?: readonly PortalFooterLink[];
  readonly legalLinks?: readonly PortalFooterLink[];
  readonly disclaimer?: string;
  readonly className?: string;
}

export function PortalFooter({
  brandName,
  tagline = 'Trusted legal services, simplified for everyone.',
  quickLinks = [],
  legalLinks = [],
  disclaimer,
  className,
}: PortalFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn('border-t border-gray-100 bg-white', className)}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p className="font-heading text-base font-semibold text-navy">{brandName}</p>
            <p className="max-w-[56ch] text-sm text-gray-600">{tagline}</p>
          </div>

          {quickLinks.length > 0 ? (
            <nav aria-label="Footer links" className="flex flex-wrap gap-x-5 gap-y-2">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-navy transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-600">
              © {year} {brandName}. All rights reserved.
            </p>
            {legalLinks.length > 0 ? (
              <nav aria-label="Legal links" className="flex flex-wrap gap-x-4 gap-y-1">
                {legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-xs text-gray-600 transition-colors hover:text-navy"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            ) : null}
          </div>

          {disclaimer ? <p className="text-[11px] leading-relaxed text-gray-600">{disclaimer}</p> : null}
        </div>
      </div>
    </footer>
  );
}
