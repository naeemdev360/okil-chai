'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { LegalSearchBar } from '../ui/LegalSearchBar';
import { Scales3D, GavelSVG, DocumentSVG } from '../icons';

const AREA_KEYS = [
  'criminal', 'family', 'corporate', 'immigration',
  'realestate', 'employment', 'ip', 'tax',
] as const;

/* ─────────────────────────────────────────────────────────────────────
   Floating dot config
   depth: far = scrolls slowest (looks furthest away)
          near = scrolls fastest (looks closest)
───────────────────────────────────────────────────────────────────── */
interface DotConfig {
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: string;
  opacity: number;
  depth: 'far' | 'mid' | 'near';
}

const DOTS: DotConfig[] = [
  { size: 4, top: '18%', left: '22%',      delay: '0s',   opacity: 0.45, depth: 'far'  },
  { size: 3, top: '38%', left: '10%',      delay: '1.3s', opacity: 0.30, depth: 'mid'  },
  { size: 5, top: '62%', right: '20%',     delay: '0.7s', opacity: 0.22, depth: 'near' },
  { size: 3, top: '12%', right: '32%',     delay: '2.1s', opacity: 0.35, depth: 'far'  },
  { size: 4, bottom: '28%', right: '10%',  delay: '1.6s', opacity: 0.20, depth: 'near' },
  { size: 6, bottom: '18%', left: '28%',   delay: '0.4s', opacity: 0.18, depth: 'mid'  },
  { size: 2, top: '52%', left: '38%',      delay: '2.8s', opacity: 0.28, depth: 'near' },
];

/* ─────────────────────────────────────────────────────────────────────
   Hero Section
   Parallax approach
   ─ Each 3-D object uses THREE layers to avoid transform conflicts:
       motion.div  → scroll-driven translateY (framer-motion y)
       div         → CSS float animation  (keyframe translateY)
       div         → static 3-D perspective / rotation
   ─ Rings use marginTop for centering so motion's y has no conflict.
   ─ Dots use a wrapper motion.div for position + parallax, inner div
     for the CSS dot-drift animation.
   ─ useReducedMotion disables all parallax + content fade for a11y.
───────────────────────────────────────────────────────────────────── */
export function HeroSection() {
  const router  = useRouter();
  const locale  = useLocale();
  const t       = useTranslations('home.hero');
  const reduced = useReducedMotion() ?? false;

  const { scrollY } = useScroll();

  // Positive Y = element moves DOWN relative to its section position
  // = appears to scroll SLOWER relative to the viewport = looks further away.
  // Background elements get the highest values; foreground gets the lowest.
  const goldGlowY      = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 200]);
  const blueGlowY      = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 160]);
  const ghostScalesY   = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 180]);
  const scalesY        = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 120]);
  const ringsY         = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 120]);
  const gavelY         = useTransform(scrollY, [0, 600], [0, reduced ? 0 :  90]);
  const documentY      = useTransform(scrollY, [0, 600], [0, reduced ? 0 :  70]);
  const dotsFarY       = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 180]);
  const dotsMidY       = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 130]);
  const dotsNearY      = useTransform(scrollY, [0, 600], [0, reduced ? 0 :  80]);
  // Content exits slightly faster than normal scroll + fades away
  const contentY       = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -50]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, reduced ? 1 :   0]);

  const handleSearch = (term: string) => {
    router.push(`/${locale}/search${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  };

  const practiceAreaPills = AREA_KEYS.map((key) => ({
    label: t(`practiceAreas.${key}`),
    value: t(`practiceAreas.${key}`),
  }));

  const dotYMap = { far: dotsFarY, mid: dotsMidY, near: dotsNearY } as const;

  return (
    <section
      className="relative flex items-center min-h-screen overflow-hidden"
      style={{ background: '#070d1a' }}
    >
      {/* ── 1. Static radial gradient ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 58% -10%, #1e3260 0%, #0f1f3d 38%, #070d1a 80%)',
        }}
        aria-hidden="true"
      />

      {/* ── 2. Static dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(200,168,75,0.55) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          opacity: 0.038,
        }}
        aria-hidden="true"
      />

      {/* ── 3. Gold ambient orb — very slow parallax (deepest layer) ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '860px',
          height: '780px',
          top: '-340px',
          right: '-240px',
          background:
            'radial-gradient(circle, rgba(200,168,75,0.2) 0%, rgba(200,168,75,0.06) 45%, transparent 70%)',
          filter: 'blur(48px)',
          y: goldGlowY,
        }}
        aria-hidden="true"
      />

      {/* ── 4. Blue ambient orb ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '640px',
          height: '640px',
          bottom: '-220px',
          left: '-160px',
          background: 'radial-gradient(circle, rgba(30,50,96,0.55) 0%, transparent 70%)',
          filter: 'blur(64px)',
          y: blueGlowY,
        }}
        aria-hidden="true"
      />

      {/* ── 5. Large 3-D Scales — right-center ──────────────────────────
           Layer 1 (motion.div): absolute position + scroll Y parallax
           Layer 2 (div.hero-float): CSS keyframe float animation
           Layer 3 (div): static perspective + opacity + drop-shadow
      ─────────────────────────────────────────────────────────────── */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{
          width: 'min(580px, 46vw)',
          right: '-2%',
          top: '50%',
          marginTop: 'min(-290px, -23vw)',
          y: scalesY,
        }}
        aria-hidden="true"
      >
        <div className="hero-float">
          <div
            style={{
              transform: 'perspective(960px) rotateY(-16deg) rotateX(6deg)',
              opacity: 0.24,
              filter: 'drop-shadow(0 0 44px rgba(200,168,75,0.35))',
            }}
          >
            <Scales3D prefix="main" className="w-full h-full" />
          </div>
        </div>
      </motion.div>

      {/* ── 6. Ghost scales — far left (slowest, most blurred) ── */}
      <motion.div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          width: 'min(280px, 22vw)',
          left: '-2%',
          top: '8%',
          y: ghostScalesY,
        }}
        aria-hidden="true"
      >
        <div className="hero-float-b">
          <div
            style={{
              transform: 'perspective(600px) rotateY(22deg)',
              opacity: 0.065,
              filter: 'blur(6px)',
            }}
          >
            <Scales3D prefix="ghost" className="w-full h-full" />
          </div>
        </div>
      </motion.div>

      {/* ── 7. Gavel — upper-right ── */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{
          width: 'min(200px, 16vw)',
          right: '7%',
          top: '7%',
          y: gavelY,
        }}
        aria-hidden="true"
      >
        <div className="hero-float-b">
          <div
            style={{
              transform: 'rotate(-22deg)',
              opacity: 0.17,
              filter: 'drop-shadow(0 0 18px rgba(200,168,75,0.45))',
            }}
          >
            <GavelSVG className="w-full h-full" />
          </div>
        </div>
      </motion.div>

      {/* ── 8. Legal document — lower-left ── */}
      <motion.div
        className="absolute pointer-events-none hidden lg:block"
        style={{
          width: 'min(130px, 11vw)',
          left: '7%',
          bottom: '14%',
          y: documentY,
        }}
        aria-hidden="true"
      >
        <div className="hero-float">
          <div
            style={{
              transform: 'perspective(480px) rotateY(18deg) rotateX(-4deg) rotate(-9deg)',
              opacity: 0.20,
              filter: 'drop-shadow(0 8px 24px rgba(200,168,75,0.22))',
            }}
          >
            <DocumentSVG className="w-full h-full" />
          </div>
        </div>
      </motion.div>

      {/* ── 9. Concentric rings ──────────────────────────────────────────
           Centering via marginTop (not transform) so motion's y is free.
           Layer 1 (motion.div): parallax Y
           Layer 2 (div.hero-ring): CSS scale+opacity pulse animation
      ─────────────────────────────────────────────────────────────── */}
      {([640, 420, 220] as const).map((size, i) => (
        <motion.div
          key={size}
          className="absolute pointer-events-none hidden md:block"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: '50%',
            right: `${-size / 2 - 10}px`,
            marginTop: `-${size / 2}px`,
            y: ringsY,
          }}
          aria-hidden="true"
        >
          <div
            className="rounded-full hero-ring w-full h-full"
            style={{
              border: `1px solid rgba(200,168,75,${0.05 + i * 0.03})`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        </motion.div>
      ))}

      {/* ── 10. Floating gold dots ───────────────────────────────────────
           Layer 1 (motion.div): position + parallax Y by depth tier
           Layer 2 (div.hero-dot): CSS float-drift animation
      ─────────────────────────────────────────────────────────────── */}
      {DOTS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none hidden sm:block"
          style={{
            top: dot.top,
            bottom: dot.bottom,
            left: dot.left,
            right: dot.right,
            y: dotYMap[dot.depth],
          }}
          aria-hidden="true"
        >
          <div
            className="rounded-full hero-dot"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              background: '#C8A84B',
              opacity: dot.opacity,
              animationDelay: dot.delay,
            }}
          />
        </motion.div>
      ))}

      {/* ── 11. Main content — exits faster + fades on scroll ── */}
      <motion.div
        className="relative z-10 w-full max-w-[800px] mx-auto px-6 pt-32 pb-28 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Tagline */}
        <div
          className="inline-flex items-center gap-3 mb-7 hero-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          <div className="w-8 h-px" style={{ background: 'rgba(200,168,75,0.55)' }} />
          <span
            className="font-sans font-semibold uppercase tracking-[0.16em] text-[11px]"
            style={{ color: 'rgba(200,168,75,0.9)' }}
          >
            {t('tagline')}
          </span>
          <div className="w-8 h-px" style={{ background: 'rgba(200,168,75,0.55)' }} />
        </div>

        {/* H1 */}
        <h1
          className="font-heading font-bold text-white leading-[1.06] tracking-tight mb-5 hero-fade-up"
          style={{
            fontSize: 'clamp(40px, 6.5vw, 72px)',
            animationDelay: '110ms',
            textShadow: '0 2px 48px rgba(0,0,0,0.5)',
          }}
        >
          {t('title')}{' '}
          <em
            className="not-italic"
            style={{
              background: 'linear-gradient(138deg, #E8C96A 0%, #C8A84B 52%, #F2DC78 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 22px rgba(200,168,75,0.45))',
            }}
          >
            {t('titleHighlight')}
          </em>
        </h1>

        {/* Subtitle */}
        <p
          className="font-sans text-lg leading-relaxed max-w-[580px] mx-auto mb-11 hero-fade-up"
          style={{ color: 'rgba(255,255,255,0.62)', animationDelay: '220ms' }}
        >
          {t('subtitle')}
        </p>

        {/* Search bar + pills */}
        <div className="hero-fade-up" style={{ animationDelay: '340ms' }}>
          <LegalSearchBar
            placeholder={t('searchPlaceholder')}
            buttonLabel={t('searchButton')}
            practiceAreaPills={practiceAreaPills}
            onSearch={handleSearch}
          />
        </div>
      </motion.div>

      {/* ── 12. Bottom vignette ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(7,13,26,0.65))' }}
        aria-hidden="true"
      />
    </section>
  );
}
