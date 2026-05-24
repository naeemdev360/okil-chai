import { config } from 'dotenv';
config({ path: '.env.dev' });

import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AppointmentStatus, CaseCategory, ConsultationType } from '@repo/shared';
import { users, lawyerProfiles, appointments, reviews } from '../schema';
import { eq, avg, count, sql } from 'drizzle-orm';

const CASE_CATEGORIES = Object.values(CaseCategory);
const CONSULT_TYPES   = Object.values(ConsultationType);

const REVIEW_TEXTS = [
  'Very professional and knowledgeable. Explained everything clearly and helped me understand my options.',
  'Excellent service. Got exactly the advice I needed and the process was smooth from start to finish.',
  'Highly recommend. Patient, thorough, and genuinely cared about my case outcome.',
  'Great experience overall. Prompt responses and very clear communication throughout.',
  'Very helpful and honest. Did not waste my time or money. Will consult again.',
  'Knowledgeable lawyer who knows the Bangladesh legal system very well. Highly satisfied.',
  'Took the time to understand my situation before giving advice. Much appreciated.',
  'Good consultation. Gave practical advice that I could actually act on.',
  'Professional and reliable. Everything was handled with care and discretion.',
  'Explained my legal rights clearly. I felt confident after our consultation.',
  'Responded quickly and gave me exactly what I needed to proceed with my case.',
  'Very thorough review of my documents. Caught issues I had missed entirely.',
  'Friendly and approachable. Made a stressful situation much easier to deal with.',
  'Competent and efficient. No unnecessary delays. Highly recommend for corporate matters.',
  'Exceptional knowledge of immigration law. My visa issue was resolved quickly.',
  'Helped me navigate a complex family dispute with sensitivity and expertise.',
  'Outstanding service. The advice given was practical, clear, and actionable.',
  'Honest about what was realistic and what was not. Saved me time and money.',
];

const LAWYER_RESPONSES = [
  'Thank you for your kind words! It was a pleasure working with you.',
  'Glad I could help. Wishing you the best with your case.',
  'Thank you! Feel free to reach out if you need anything further.',
  null, null, null, null, // most reviews don't get a response
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function weightedRating(): number {
  const roll = Math.random();
  if (roll < 0.55) return 5;
  if (roll < 0.80) return 4;
  if (roll < 0.92) return 3;
  if (roll < 0.97) return 2;
  return 1;
}

function pastDate(monthsAgo: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  d.setDate(randomInt(1, 28));
  d.setHours(randomInt(9, 17), 0, 0, 0);
  return d;
}

async function seed(): Promise<void> {
  const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
  const db = drizzle(pool);

  // ── 1. Create 10 fake client users ────────────────────────────────────────
  console.log('Creating 10 fake client users...');
  const clientIds: string[] = [];

  for (let i = 0; i < 10; i++) {
    const isFemale = i % 2 !== 0;
    const firstName = faker.person.firstName(isFemale ? 'female' : 'male');
    const lastName  = faker.person.lastName();

    const [user] = await db.insert(users).values({
      email: faker.internet.email({ firstName, lastName, provider: 'seed-client.dev' }).toLowerCase(),
      firstName,
      lastName,
      isVerified: true,
      isActive: true,
    }).returning({ id: users.id });

    clientIds.push(user!.id);
  }
  console.log(`  Created ${clientIds.length} clients.`);

  // ── 2. Fetch all lawyer profiles ──────────────────────────────────────────
  const lawyers = await db.select({ id: lawyerProfiles.id, firstName: lawyerProfiles.firstName }).from(lawyerProfiles);
  console.log(`Found ${lawyers.length} lawyer profiles. Seeding reviews...`);

  let totalReviews = 0;

  for (const lawyer of lawyers) {
    const reviewCount = randomInt(3, 8);

    for (let r = 0; r < reviewCount; r++) {
      const clientId      = clientIds[r % clientIds.length]!;
      const monthsAgo     = randomInt(1, 14);
      const startAt       = pastDate(monthsAgo);
      const endAt         = new Date(startAt.getTime() + 60 * 60 * 1000);
      const consultationType = pickRandom(CONSULT_TYPES);
      const caseCategory  = pickRandom(CASE_CATEGORIES);

      // Create a completed appointment
      const [appt] = await db.insert(appointments).values({
        clientId,
        lawyerId: lawyer.id,
        consultationType,
        caseCategory,
        startAt,
        endAt,
        status: AppointmentStatus.COMPLETED,
      }).returning({ id: appointments.id });

      // Create the review
      await db.insert(reviews).values({
        appointmentId: appt!.id,
        clientId,
        lawyerId: lawyer.id,
        rating: weightedRating(),
        text: pickRandom(REVIEW_TEXTS),
        lawyerResponse: pickRandom(LAWYER_RESPONSES),
        lawyerRespondedAt: null,
        isModerated: true,
      });

      totalReviews++;
    }

    process.stdout.write(`  ${lawyer.firstName}: ${reviewCount} reviews\n`);
  }

  // ── 3. Recalculate avgRating + totalReviews for all lawyers ───────────────
  console.log('\nRecalculating lawyer aggregates...');
  await db.execute(sql`
    UPDATE lawyer_profiles lp
    SET
      avg_rating    = sub.avg_rating,
      total_reviews = sub.total_reviews
    FROM (
      SELECT
        lawyer_id,
        ROUND(AVG(rating)::numeric, 2) AS avg_rating,
        COUNT(*)                       AS total_reviews
      FROM reviews
      GROUP BY lawyer_id
    ) sub
    WHERE lp.id = sub.lawyer_id
  `);

  await pool.end();
  console.log(`\nDone. ${totalReviews} reviews seeded across ${lawyers.length} lawyers.`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
