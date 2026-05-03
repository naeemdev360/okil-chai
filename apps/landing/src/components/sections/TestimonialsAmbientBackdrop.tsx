'use client';

import {
  TestimonialsBooksAmbientSVG,
  TestimonialsPedimentAmbientSVG,
  TestimonialsPillarAmbientSVG,
  TestimonialsScrollAmbientSVG,
} from './TestimonialsAmbientArt';

/**
 * Decorative 3D-style legal motifs behind testimonials (art unique to this section).
 * Motion is CSS-only; prefers-reduced-motion in globals.css.
 */
export function TestimonialsAmbientBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,transparent_20%,color-mix(in_srgb,var(--color-navy)_88%,transparent)_100%)]"
        aria-hidden="true"
      />

      <div className="absolute hidden md:block w-[min(300px,30vw)] -left-[10%] top-[8%] testimonials-ambient-float testimonials-ambient-delay-a">
        <div
          className="will-change-transform"
          style={{
            transform: 'perspective(880px) rotateY(-12deg) rotateX(6deg)',
            opacity: 0.12,
            filter: 'drop-shadow(0 0 28px rgba(200,168,75,0.22))',
          }}
        >
          <TestimonialsPillarAmbientSVG idPrefix="amb-pl" className="h-auto w-full" />
        </div>
      </div>

      <div className="absolute hidden lg:block w-[min(260px,26vw)] -right-[6%] bottom-[12%] testimonials-ambient-float-slow testimonials-ambient-delay-b">
        <div
          className="will-change-transform"
          style={{
            transform: 'perspective(760px) rotateY(18deg) rotateX(-4deg)',
            opacity: 0.09,
            filter: 'blur(2px) drop-shadow(0 0 18px rgba(200,168,75,0.14))',
          }}
        >
          <TestimonialsPedimentAmbientSVG idPrefix="amb-pd" className="h-auto w-full" />
        </div>
      </div>

      <div className="absolute hidden md:block w-[min(200px,20vw)] right-[8%] top-[4%] testimonials-ambient-float-slow testimonials-ambient-delay-c">
        <div
          className="will-change-transform"
          style={{
            transform: 'rotate(-12deg) perspective(600px) rotateX(6deg)',
            opacity: 0.1,
            filter: 'drop-shadow(0 6px 16px rgba(232,201,106,0.2))',
          }}
        >
          <TestimonialsBooksAmbientSVG idPrefix="amb-bk" className="h-auto w-full" />
        </div>
      </div>

      <div className="absolute hidden lg:block w-[min(220px,20vw)] left-[4%] bottom-[22%] testimonials-ambient-float testimonials-ambient-delay-b">
        <div
          className="will-change-transform"
          style={{
            transform: 'perspective(540px) rotateY(14deg) rotateX(-4deg) rotate(-5deg)',
            opacity: 0.09,
            filter: 'drop-shadow(0 8px 20px rgba(200,168,75,0.16))',
          }}
        >
          <TestimonialsScrollAmbientSVG idPrefix="amb-sc" className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}
