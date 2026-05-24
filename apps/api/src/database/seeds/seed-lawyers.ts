import { config } from 'dotenv';
config({ path: '.env.dev' });

import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ConsultationType, VerificationStatus } from '@repo/shared';
import { users, lawyerProfiles, lawyerLanguages, lawyerSpecializations, specializations } from '../schema';
import { eq } from 'drizzle-orm';

const SPECIALIZATION_SLUGS = [
  'criminal-law',
  'family-law',
  'corporate-law',
  'immigration',
  'real-estate',
  'employment',
  'intellectual-property',
  'tax-law',
  'personal-injury',
  'civil-litigation',
];

const LANGUAGES = ['Bengali', 'English', 'Hindi', 'Arabic', 'Urdu'];
const CONSULTATION_TYPES = [ConsultationType.VIDEO, ConsultationType.PHONE, ConsultationType.IN_PERSON];
const CITIES = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Comilla', 'Mymensingh', 'Narayanganj'];
const BAR_COUNCILS = ['Bangladesh Bar Council', 'Dhaka Bar Association', 'Chittagong Bar Association', 'High Court Bar Association'];

function pickRandom<T>(arr: readonly T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed(): Promise<void> {
  const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
  const db = drizzle(pool);

  console.log('Fetching specializations from DB...');
  const specRows = await db
    .select({ id: specializations.id, slug: specializations.slug })
    .from(specializations)
    .where(eq(specializations.isActive, true));

  const specBySlug = new Map(specRows.map((s) => [s.slug, s.id]));
  const availableSlugs = SPECIALIZATION_SLUGS.filter((slug) => specBySlug.has(slug));

  if (availableSlugs.length === 0) {
    throw new Error('No matching specializations found in DB. Run migrations and specializations seed first.');
  }

  console.log(`Seeding 50 mock lawyers (${availableSlugs.length} specialization slugs available)...`);

  for (let i = 0; i < 50; i++) {
    const isFemale = i % 2 !== 0;
    const portraitIndex = Math.floor(i / 2) + 1;
    const genderPath = isFemale ? 'women' : 'men';
    const photoUrl = `https://randomuser.me/api/portraits/${genderPath}/${portraitIndex}.jpg`;

    const firstName = faker.person.firstName(isFemale ? 'female' : 'male');
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'okilchai-test.dev' }).toLowerCase();

    const [user] = await db
      .insert(users)
      .values({
        email,
        firstName,
        lastName,
        avatarUrl: photoUrl,
        isVerified: true,
        isActive: true,
      })
      .returning({ id: users.id });

    if (!user) continue;

    const rating = (randomInt(35, 50) / 10).toFixed(2);
    const totalReviews = randomInt(3, 120);
    const yearsOfExperience = randomInt(2, 25);
    const pricePerHour = (randomInt(5, 30) * 10).toFixed(2);
    const consultTypes = pickRandom(CONSULTATION_TYPES, randomInt(1, 3));
    const city = CITIES[randomInt(0, CITIES.length - 1)]!;

    const [lawyer] = await db
      .insert(lawyerProfiles)
      .values({
        userId: user.id,
        firstName,
        lastName,
        photoUrl,
        bio: faker.lorem.paragraph(randomInt(2, 4)),
        phone: faker.phone.number({ style: 'international' }),
        yearsOfExperience,
        barNumber: `BD-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`,
        yearAdmitted: new Date().getFullYear() - yearsOfExperience,
        barCouncil: BAR_COUNCILS[randomInt(0, BAR_COUNCILS.length - 1)],
        city,
        country: 'BD',
        pricePerHour,
        consultationTypes: consultTypes,
        isPublished: true,
        isInstantBooking: Math.random() > 0.5,
        verificationStatus: VerificationStatus.APPROVED,
        onboardingStep: 5,
        avgRating: rating,
        totalReviews,
        totalConsultations: randomInt(totalReviews, totalReviews + 50),
      })
      .returning({ id: lawyerProfiles.id });

    if (!lawyer) continue;

    // Languages (1–3)
    const langs = pickRandom(LANGUAGES, randomInt(1, 3));
    await db.insert(lawyerLanguages).values(langs.map((language) => ({ lawyerId: lawyer.id, language })));

    // Specializations (1–2)
    const slugs = pickRandom(availableSlugs, randomInt(1, 2));
    const specValues = slugs.map((slug, idx) => ({
      lawyerId: lawyer.id,
      specializationId: specBySlug.get(slug)!,
      isPrimary: idx === 0,
    }));
    await db.insert(lawyerSpecializations).values(specValues);

    process.stdout.write(`  [${i + 1}/50] ${firstName} ${lastName} — ${city}\n`);
  }

  await pool.end();
  console.log('\nDone. 50 lawyers seeded successfully.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
