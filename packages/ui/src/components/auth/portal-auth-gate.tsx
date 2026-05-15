import * as React from 'react';
import { ArrowLeft, ArrowRight, Briefcase, Lock, ShieldCheck, User } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { DecorativeOrb } from '../ui/decorative-orb';

type PortalKind = 'client' | 'lawyer' | 'admin';

interface PortalCopy {
  readonly eyebrow: string;
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  readonly allowSignUp: boolean;
}

const PORTAL_COPY: Record<PortalKind, PortalCopy> = {
  client: {
    eyebrow: 'Client Portal',
    name: 'Client Portal',
    title: 'Sign in to access your legal dashboard',
    description:
      'Track appointments, message your lawyer, and manage documents — all in one secure place.',
    icon: User,
    allowSignUp: true,
  },
  lawyer: {
    eyebrow: 'Lawyer Portal',
    name: 'Lawyer Portal',
    title: 'Sign in to manage your practice',
    description:
      'Review bookings, respond to client requests, and grow your practice from one professional workspace.',
    icon: Briefcase,
    allowSignUp: true,
  },
  admin: {
    eyebrow: 'Admin Portal',
    name: 'Admin Portal',
    title: 'Restricted access — sign in to continue',
    description:
      'The administration console requires authorized credentials. New accounts are provisioned by the platform team.',
    icon: ShieldCheck,
    allowSignUp: false,
  },
};

const gateContainerVariants = cva(
  'relative isolate flex min-h-screen w-full items-center justify-center overflow-hidden bg-navy px-6 py-16 text-white',
);

export interface PortalAuthGateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof gateContainerVariants> {
  readonly portal: PortalKind;
  readonly signInHref?: string;
  readonly signUpHref?: string;
  readonly homeHref?: string;
  readonly onSignIn?: () => void;
  readonly onSignUp?: () => void;
  readonly onHome?: () => void;
  readonly logo?: React.ReactNode;
  readonly title?: string;
  readonly description?: string;
  readonly signInLabel?: string;
  readonly signUpLabel?: string;
  readonly homeLabel?: string;
  readonly trustNote?: string;
}

const DEFAULT_TRUST_NOTE =
  'Bank-grade encryption · Verified lawyers · Your data is never sold.';

const PortalAuthGate = React.forwardRef<HTMLDivElement, PortalAuthGateProps>(
  (
    {
      className,
      portal,
      signInHref,
      signUpHref,
      homeHref,
      onSignIn,
      onSignUp,
      onHome,
      logo,
      title,
      description,
      signInLabel = 'Sign in',
      signUpLabel = 'Create an account',
      homeLabel = 'Back to home',
      trustNote = DEFAULT_TRUST_NOTE,
      ...props
    },
    ref,
  ) => {
    const copy = PORTAL_COPY[portal];
    const Icon = copy.icon;
    const showSignUp = copy.allowSignUp && (signUpHref || onSignUp);

    return (
      <div ref={ref} className={cn(gateContainerVariants(), className)} {...props}>
        <DecorativeOrb
          appearance="white-outline-faint"
          size="none"
          className="-right-32 -top-32 size-[560px]"
        />
        <DecorativeOrb
          appearance="white-outline-muted"
          size="none"
          className="-right-32 -top-32 size-[400px]"
        />
        <DecorativeOrb
          appearance="white-outline-soft"
          size="none"
          className="-right-32 -top-32 size-[240px]"
        />
        <DecorativeOrb
          appearance="gold-fill"
          size="none"
          className="top-1/3 -right-40 size-[360px] blur-3xl"
        />
        <DecorativeOrb
          appearance="gold-fill-soft"
          size="none"
          className="-bottom-24 -left-24 size-[320px] blur-2xl"
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {logo ? (
          <div className="absolute left-8 top-8 z-10">
            {homeHref || onHome ? (
              <button
                type="button"
                onClick={onHome}
                className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                {logo}
              </button>
            ) : (
              logo
            )}
          </div>
        ) : null}

        <div className="relative z-10 w-full max-w-[520px]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 shadow-2xl backdrop-blur-xl sm:p-12">
            <div className="mb-8 flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gold/15 ring-1 ring-inset ring-gold/30">
                <Icon className="size-5 text-gold" strokeWidth={1.6} />
              </span>
              <div className="flex flex-col">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/90">
                  {copy.eyebrow}
                </span>
                <span className="font-sans text-[13px] text-white/55">
                  Authentication required
                </span>
              </div>
            </div>

            <h1 className="font-heading text-[32px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[36px]">
              {title ?? copy.title}
            </h1>
            <p className="mt-4 font-sans text-[15px] leading-[1.7] text-white/65">
              {description ?? copy.description}
            </p>

            <div className="mt-9 flex flex-col gap-3">
              <PrimaryAction
                href={signInHref}
                onClick={onSignIn}
                label={signInLabel}
              />
              {showSignUp ? (
                <SecondaryAction
                  href={signUpHref}
                  onClick={onSignUp}
                  label={signUpLabel}
                />
              ) : null}
            </div>

            {homeHref || onHome ? (
              <div className="mt-8 flex justify-center">
                <HomeLink href={homeHref} onClick={onHome} label={homeLabel} />
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2.5 px-4">
            <Lock className="size-3.5 text-gold/70" strokeWidth={1.8} />
            <p className="font-sans text-[12px] leading-snug text-white/45">
              {trustNote}
            </p>
          </div>
        </div>
      </div>
    );
  },
);
PortalAuthGate.displayName = 'PortalAuthGate';

interface ActionProps {
  readonly href?: string;
  readonly onClick?: () => void;
  readonly label: string;
}

function PrimaryAction({ href, onClick, label }: ActionProps) {
  if (href) {
    return (
      <Button asChild variant="gold" size="lg" className="w-full">
        <a href={href}>
          <span>{label}</span>
          <ArrowRight className="size-4" strokeWidth={2} />
        </a>
      </Button>
    );
  }
  return (
    <Button variant="gold" size="lg" className="w-full" onClick={onClick}>
      <span>{label}</span>
      <ArrowRight className="size-4" strokeWidth={2} />
    </Button>
  );
}

function SecondaryAction({ href, onClick, label }: ActionProps) {
  const sharedClasses =
    'inline-flex w-full items-center justify-center rounded-md border border-white/20 bg-transparent px-7 py-3 text-base font-medium text-white transition-colors hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy';
  if (href) {
    return (
      <a href={href} className={sharedClasses}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={sharedClasses}>
      {label}
    </button>
  );
}

function HomeLink({ href, onClick, label }: ActionProps) {
  const sharedClasses =
    'inline-flex items-center gap-2 rounded-md text-[13px] font-medium text-white/60 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy';
  const content = (
    <>
      <ArrowLeft className="size-3.5" strokeWidth={2} />
      <span>{label}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={sharedClasses}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={sharedClasses}>
      {content}
    </button>
  );
}

export { PortalAuthGate };
export type { PortalKind };
