⚖

**OkilChai**

_Find a Lawyer. Book in Minutes._

Software Requirements Specification • Version 1.0

Document Type: Software Requirements Specification (SRS)

Project Name: OkilChai --- Lawyer Discovery & Appointment Platform

Version: 1.0 (Initial Release)

Prepared For: Full-Stack JS Developer (Claude Code)

Target Audience: Developers, Investors, Stakeholders

Date: 2026

**01 --- EXECUTIVE SUMMARY**

1\. Executive Summary

OkilChai is a next-generation legal services marketplace that
empowers individuals and businesses to discover, evaluate, and book
verified lawyers --- in minutes, not days. Think of it as the Airbnb of
legal services, or the Doctolib of the law industry.

Market Opportunity: The global legal services market is valued at over
\$1 trillion. Yet, 75% of people who need a lawyer do not find one due
to complexity, opacity, and lack of access. OkilChai eliminates this
gap.

## 1.1 The Problem

Finding a qualified, trustworthy lawyer is slow, expensive, and opaque

No unified platform for booking legal appointments online

Lawyers lack a modern digital presence and client acquisition tool

Consultation scheduling is handled by phone/email --- inefficient for
both sides

No transparent pricing or peer reviews in the legal market

## 1.2 The Solution

Verified lawyer profiles with specialization, reviews, and pricing

Instant and scheduled appointment booking with calendar integration

Video consultation support (telelaw) --- no need to visit an office

AI-powered lawyer matching based on case description

Transparent fee structures and in-app payments

Post-consultation feedback and ratings system

## 1.3 Business Model & Revenue Streams

---

**Revenue Stream** **Model**

**Commission** 5-15% per confirmed appointment booking

**Subscription Pro plan: \$99/mo --- unlimited listings, priority
(Lawyers)** placement, analytics

**Featured Lawyers pay to appear at top of search results
Listings**

**Document Vault \$9.99/mo for clients --- encrypted document
(SaaS)** storage + e-sign

**Telelaw Plans** Premium video consultation packages

**API Licensing** White-label platform to law firms / bar associations

---

##

##

## Conservative Year-3 Revenue Projection: \$8M ARR with 25,000 active lawyers and 300,000 registered clients in a single country market.

##

## 02 --- PRODUCT VISION & SCOPE

##

2\. Product Vision & Scope

## 2.1 Vision Statement

## To become the most trusted legal services platform where anyone, regardless of background or budget, can access professional legal help instantly.

##

## 2.2 Target Users (Personas)

### Persona A --- The Client (User)

---

**Who** Individual or SME owner needing legal help

**Needs** Fast access to a lawyer, transparent pricing, easy
booking

**Pain Points** Doesn\'t know who to trust, scared of hidden fees,
too busy to call

**Goal** Book a consultation today, get legal clarity fast

---

###

###

### Persona B --- The Lawyer

---

**Who** Solo practitioner or small firm attorney

**Needs** More client leads, less admin overhead, digital
presence

**Pain Points** Relies on referrals, no online booking, no analytics

**Goal** Fill calendar, earn more, build reputation online

---

###

###

### Persona C --- The Platform Admin

---

**Who** Startup operations team

**Needs** Manage users, verify lawyers, handle disputes, view
analytics

**Pain Points** Scale safely without fraud or fake profiles

**Goal** Grow platform trust and revenue

---

###

###

## 2.3 Scope --- MVP vs. Future Phases

---

**Phase** **Features Included**

**MVP (Phase 1)** Lawyer search, profile view, appointment booking,
basic payments, email notifications, Dual-language
support: Initial launch localized for **English**
and **Bengali (bn-BD)**.

**Phase 2** Video consultations, AI lawyer match, reviews &
ratings, lawyer analytics dashboard

**Phase 3** Document vault, e-signature, multi-language, mobile
apps (React Native)

**Phase 4** API licensing, corporate accounts, law firm
management, court date tracking

---

##

##

## 03 --- FEATURE SPECIFICATIONS

##

3\. Full Feature Specification

Priority Key --- P0: Launch-critical \| P1: High value, ship in first 60
days \| P2: Growth phase

## 3.1 Client-Facing Features

---

**Feature** **Description** **Priority** **Module**

Smart Search & Search by specialization, city, **P0** Discovery
Filter language, price, rating,  
 availability, gender

Lawyer Profile Bio, photo, credentials, bar **P0** Discovery
Page number, specializations, fee  
 structure, reviews, availability  
 calendar

AI Case Matcher Describe your issue in plain **P1** Discovery
language → AI suggests top 3  
 matched lawyers

Appointment Select date/time slot, choose **P0** Booking
Booking consultation type  
 (in-person/video/phone), select case  
 category, confirm

Instant Booking Book verified lawyers who allow **P1** Booking
instant confirmation (no manual  
 approval)

Booking View upcoming, past, cancelled **P0** Booking
Management appointments with full details

In-App Payments Secure payment via card/bank, pay **P0** Payments
consultation fee upfront or  
 deposit

Refund & Policy-driven cancellation with **P1** Payments
Cancellation partial/full refund flows

Reviews & Leave star rating + text review **P1** Trust
Ratings after consultation is marked  
 complete

Lawyer Side-by-side compare up to 3 **P2** Discovery
Comparison lawyers: price, rating,  
 availability, specialty

Saved / Bookmark lawyers for later, **P1** UX
Favourites revisit without searching again

Consultation Private notes visible only to **P2** UX
Notes client, stored per appointment

Document Vault Upload encrypted documents, share **P2** Legal Tools
securely with booked lawyer

Notifications Email + push: booking confirmed, **P0** Comms
reminder 24h before, follow-up  
 after

Live Chat Message lawyer before booking to **P1** Comms
(Pre-booking) ask quick qualifying questions

---

##

##

## 3.2 Lawyer-Facing Features

---

**Feature** **Description** **Priority** **Module**

Lawyer Multi-step profile setup: **P0** Onboarding
Onboarding credentials, bar number, photo,  
 specializations, bio, fee  
 structure

Availability Set recurring weekly hours + **P0** Scheduling
Calendar block specific dates, sync with  
 Google Calendar

Appointment View all upcoming/past bookings, **P0** Dashboard
Dashboard client details, consultation type

Earnings Total earned, pending payouts, **P0** Dashboard
Overview per-consultation breakdown,  
 payout history

Client Profiles View past client notes, **P1** Dashboard
consultation history per client

Review Read & respond to client reviews **P1** Trust
Management professionally

Profile Profile views, booking conversion **P1** Analytics
Analytics rate, search impressions

Subscription Free tier (limited slots) vs Pro **P1** Monetization
Plans (unlimited + priority listing +  
 analytics)

Video Room Integrated video consultation via **P1** Consultation
embedded WebRTC or Daily.co

No-Show Flag no-show clients, auto-charge **P2** Trust
Protection cancellation fee based on policy

Referral Program Refer another lawyer → earn **P2** Growth
platform fee credits

---

##

##

## 3.3 Admin Panel Features

---

**Feature** **Description** **Priority** **Module**

Lawyer Review submitted credentials, **P0** Trust
Verification approve/reject with reason,  
 manual re-review

User Management View, suspend, ban clients or **P0** Ops
lawyers with reason log

Dispute Manage client-lawyer disputes, **P1** Ops
Resolution issue refunds, add resolution  
 notes

Platform MAU, bookings/day, revenue, **P0** Analytics
Analytics churn, top lawyers, top  
 specializations

Content Manage FAQ, legal specialization **P1** Ops
Management taxonomy, city/region data

Payout Approve/process lawyer payouts, **P0** Payments
Management view pending balances

Featured Manage which lawyers appear in **P2** Revenue
Listings featured sections, ad slot  
 management

Notification Send platform-wide emails/push to **P2** Comms
Broadcast all users or segments

---

##

##

## 04 --- RECOMMENDED TECH STACK

##

4\. Recommended Tech Stack

Curated for a solo full-stack JS developer using Claude Code ---
maximizes productivity while being production-grade and investor-ready.

## 4.1 Frontend

---

**Layer** **Technology & Reasoning**

**Frontend Apps** Four separate apps: Landing Page (Next.js 16, App Router),
Client Portal (React 19), Lawyer Portal (React 19), Admin Portal (React 19)

**Framework Strategy** Next.js 16 for public SEO pages (SSR/SSG);
React 19 SPA architecture for authenticated portals (client/lawyer/admin)

**UI Library** Tailwind CSS + shadcn/ui --- rapid, accessible,
consistent design system

**State Zustand --- lightweight, no boilerplate, perfect for
Management** auth/cart/booking state

**Data Fetching** TanStack Query (React Query) --- caching,
refetching, optimistic updates

**Forms** React Hook Form + Zod --- type-safe form validation

**Calendar UI** react-big-calendar or FullCalendar --- for
availability & booking UI

**Maps** Mapbox GL JS --- lawyer location on map, filter by
radius

**Video** Daily.co SDK or 100ms SDK --- embedded video
consultations

**Animation** Framer Motion --- polished transitions for landing
page

---

##

##

## 4.2 Backend

---

**Layer** **Technology & Reasoning**

**Runtime** Node.js 20 LTS --- familiar, fast, huge ecosystem

**Framework** Express.js or Hono --- lightweight REST API, easy
Claude Code generation

**API Design** REST with OpenAPI spec --- simple for MVP, easy to
document

**Auth** Passport.js (Local + OAuth strategies) --- backend-managed
email/password + social sign-up/login (Google/Facebook), JWT + refresh token flow, full control over auth logic

**File Uploads** AWS S3 + presigned URLs --- lawyer photos,
credential PDFs, documents

**Background BullMQ + Redis --- email reminders, payout
Jobs** processing, notification queues

**Email** Resend.com + React Email --- transactional emails
with beautiful templates

**Push OneSignal (free tier) or Firebase Cloud Messaging
Notifications**

**Real-time** Socket.io --- live chat between client/lawyer
pre-booking

---

##

##

## 4.3 Database & ORM

---

**Layer** **Technology & Reasoning**

**Primary DB** PostgreSQL --- relational, ACID, perfect for
appointments, transactions, users

**ORM** Drizzle ORM --- type-safe SQL builder/ORM, schema-first migrations, superb DX,
works perfectly with Claude Code

**Cache / Redis (Upstash serverless) --- session store, rate
Sessions** limiting, job queues

**Search** Algolia (free tier 10K records) or Typesense
(self-hosted) --- instant lawyer search

**Migrations** Drizzle Kit --- version-controlled schema
evolution

---

##

##

## 4.4 Payments & Finance

---

**Layer** **Technology & Reasoning**

**Payments** Stripe --- card payments, saved cards, refunds,
webhooks

**Marketplace** Stripe Connect --- split payments between platform
and lawyer (automatic payout)

**Invoicing** Stripe Billing --- auto-generate PDF
receipts/invoices

**Fraud** Stripe Radar --- built-in ML fraud detection

---

##

##

## 4.5 AI Features

---

**Layer** **Technology & Reasoning**

**AI Matching** Anthropic Claude API --- embed case description,
match to lawyer specializations via semantic
similarity

**Legal FAQ Bot** Claude API with RAG --- answer generic legal process
questions to build trust pre-booking

**Review Claude API --- flag abusive/fake reviews
Moderation** automatically before they go live

**Embeddings** OpenAI text-embedding-3-small or Cohere --- for
semantic search of lawyers

**Vector DB** pgvector (PostgreSQL extension) --- store lawyer
embeddings, no extra infra

---

##

##

## 4.6 Infrastructure & DevOps

---

**Layer** **Technology & Reasoning**

**Hosting (Frontend)** Vercel --- instant deploys, edge network,
preview URLs per PR

**Hosting (Backend)** Railway.app or Render --- Node.js deploy,
managed PostgreSQL, Redis add-ons

**Domain / CDN** Cloudflare --- DNS, DDoS protection, edge
caching, free SSL

**Object Storage** AWS S3 + CloudFront CDN for media

**Monitoring** Sentry (errors) + PostHog (product analytics) +
Axiom (logs)

**CI/CD** GitHub Actions --- run tests, lint, deploy on
merge to main

**Environment** dotenv + Infisical or Doppler --- secret
management

**Testing** Vitest (unit) + Playwright (E2E) --- critical
booking flows must be tested

**Monorepo Turborepo - Manages the monorepo containing
Orchestration** apps/landing, apps/client-portal, apps/lawyer-portal,
apps/admin-portal, apps/api, and packages/shared.
Provides remote caching and optimized task
execution for CI/CD efficiency.

---

##

##

## 05 --- SYSTEM ARCHITECTURE

##

5\. System Architecture

## 5.1 High-Level Architecture Overview

## OkilChai follows a modern multi-app, three-tier architecture optimized for a JS-only developer stack:

##

+:----------------------+:----------------------+:----------------------+
| **PRESENTATION TIER** | **APPLICATION TIER** | **DATA TIER** |
+-----------------------+-----------------------+-----------------------+
| • Landing Page: Next.js 16 | • Node.js / | • PostgreSQL + Drizzle ORM |
| (Vercel) | NestJS(latest) | |
| | | • Redis (Upstash) |
| • Client Portal: React 19 | • REST API (OpenAPI) | |
| | | • pgvector (AI) |
| • Lawyer Portal: React 19 | • Stripe Webhooks | |
| | | • S3 (Files) |
| • Admin Portal: React 19 | • BullMQ Workers | |
| | | • Algolia (Search) |
| • Custom Auth UI + TanStack Query + shadcn/ui | • Socket.io | |
+-----------------------+-----------------------+-----------------------+

##

##

## 5.2 Data Model Overview (Core Entities)

---

**Entity** **Key Fields**

**User** id, email, role (CLIENT\|LAWYER\|ADMIN), authProvider,
providerUserId, createdAt, isVerified

**LawyerProfile** userId, barNumber, bio, specializations\[\],
languages\[\], city, pricePerHour, isApproved

**Availability** lawyerId, dayOfWeek, startTime, endTime,
isRecurring, blockedDates\[\]

**Appointment** id, clientId, lawyerId, type
(VIDEO\|PHONE\|IN_PERSON), caseCategory
(CRIMINAL\|FAMILY\|LAND\_PROPERTY\|COMMERCIAL\|CIVIL\|LABOR\|CONSTITUTIONAL\|INTELLECTUAL\_PROPERTY\|IMMIGRATION\|TAX\|CONSUMER\_RIGHTS\|OTHER),
startAt, status, stripePaymentId

**Review** appointmentId, clientId, lawyerId, rating, text,
isModerated, createdAt

**Payment** appointmentId, amount, currency, stripeChargeId,
status, platformFee, lawyerPayout

**Message** id, senderId, receiverId, appointmentId, content,
createdAt, isRead

**Document** id, ownerId, lawyerId, name, s3Key, encryptionKey,
sharedAt

---

##

##

## 06 --- CORE USER FLOWS

##

6\. Core User Flows

## 6.1 Client Booking Flow (Happy Path)

Client lands on homepage → sees hero search bar (specialization + city)

Enters search → results page shows filtered lawyer cards (photo, rating,
price, next available slot)

Clicks lawyer card → Lawyer Profile Page: full bio, reviews, calendar
availability

Selects date/time slot → selects consultation type (Video / In-Person /
Phone) → selects case category (e.g. Criminal, Family, Land & Property)

Prompted to sign up / log in if not authenticated (custom auth modal/page with local + social options)

Review & Confirm page: appointment summary + total fee breakdown

Enters payment details via Stripe Elements → submits

Booking confirmation page + email sent to client and lawyer

24-hour reminder email/push notification sent automatically

Post-consultation: prompted to leave review (triggered 2 hours after end
time)

## 6.2 Lawyer Onboarding Flow

Lawyer clicks \'Join as a Lawyer\' → creates account via local signup or social login

Multi-step wizard: Personal Info → Credentials (bar number,
certifications) → Specializations → Pricing → Availability → Profile
Photo

Submits for verification → status: Pending Review

Admin receives notification → reviews credentials → approves or requests
more info

Lawyer receives approval email → profile goes live → appears in search

Prompted to connect Stripe account (Stripe Connect onboarding) for
payouts

## 6.3 Admin Verification Flow

Admin logs into Admin Panel → sees queue of pending lawyer verifications

Opens submission → views all uploaded credential documents via S3 viewer

Approve (profile published) or Reject (with reason sent to lawyer via
email)

All actions logged with timestamp, admin ID, and reason

**07 --- API DESIGN**

7\. API Design (RESTful)

All endpoints are prefixed with /api/v1. Authentication via backend-issued JWT in
Authorization header. Rate limiting via Redis: 100 req/min per IP, 1000
req/min per authenticated user.

## 7.1 Core Endpoints

---

**Endpoint** **Description**

**POST /auth/signup** Local account signup (email + password)

**POST /auth/login** Local login (email + password)

**GET /auth/social/:provider** Start social OAuth flow (Google/Facebook)

**GET /auth/social/:provider/callback** OAuth callback, issue JWT + refresh token

**POST /auth/refresh** Rotate refresh token and issue new access token

**POST /auth/logout** Invalidate refresh token/session

**GET /lawyers** Search & filter lawyers --- query params:
specialization, city, lang, minPrice, maxPrice,
rating, availability, page, limit

**GET /lawyers/:id** Full lawyer profile: bio, specializations, reviews
aggregate, next 14 days of available slots

**GET /lawyers/:id/availability** Return available time slots for a given date range

**POST /appointments** Create a new appointment --- triggers Stripe
PaymentIntent creation

**GET /appointments/:id** Get appointment details (auth: must be client or
lawyer on appointment)

**PATCH /appointments/:id/cancel** Cancel appointment --- triggers refund logic based
on cancellation policy

**POST /reviews** Submit review --- only allowed if appointment status
is COMPLETED

**GET /lawyers/me/dashboard** Lawyer\'s own dashboard: earnings, upcoming appts,
analytics

**POST /auth/lawyer-onboarding** Submit lawyer profile for admin review

**GET /admin/verifications** Admin: list pending lawyer verifications

**POST Admin: approve lawyer profile
/admin/verifications/:id/approve**

**POST Admin: reject with reason
/admin/verifications/:id/reject**

**POST /webhooks/stripe** Handle Stripe payment/connect webhooks --- not
authenticated

**POST /ai/match** Client describes problem in natural language →
returns ranked lawyers

**GET /messages/:conversationId** Fetch messages in a pre-booking chat thread

**POST /messages** Send message in a chat thread --- triggers Socket.io
event

---

##

##

## 08 --- SECURITY & COMPLIANCE

##

8\. Security & Compliance Requirements

## 8.1 Authentication & Authorization

Backend handles all auth via Passport.js --- Local strategy for email/password and OAuth2 strategies for social login, with JWT + refresh token session management

Role-based access control (RBAC): CLIENT, LAWYER, ADMIN roles enforced
at API middleware

Lawyers can only see their own bookings; clients can only see their own
data

All admin routes require ADMIN role --- separate admin subdomain
(admin.okilchai.com)

MFA optional for clients, recommended for lawyers, mandatory for admins

## 8.2 Data Security

All data in transit: TLS 1.3 enforced via Cloudflare

Database at rest: encrypted by Railway/Render managed PostgreSQL

Documents in S3: server-side encryption (SSE-S3), access only via
short-lived presigned URLs

Sensitive fields (bar number, bank details) stored encrypted in DB
(AES-256)

PII minimization: only collect data that is strictly necessary

## 8.3 Payment Security

No card data touches the server --- all handled by Stripe.js client-side
tokenization

Stripe webhook signatures verified with signing secret before processing

Stripe Connect used for marketplace payouts --- platform never holds
funds long-term

## 8.4 Rate Limiting & Abuse Prevention

Redis-backed rate limiting on all public endpoints

CAPTCHA on registration and search endpoints (Cloudflare Turnstile ---
free, privacy-friendly)

Stripe Radar for payment fraud ML detection

Review system: only one review per completed appointment, email verified
accounts only

## 8.5 Compliance Checklist

---

**Area** **Implementation**

**GDPR / Privacy** Privacy policy, right to deletion, data export
endpoint, cookie consent banner

**CCPA** Do-not-sell toggle, privacy rights page

**ADA / WCAG 2.1 shadcn/ui is accessible by default; audit with
AA** axe-core in CI

**Bar Association Disclaimer on all pages: \'OkilChai is not a law
Rules** firm. Use of this platform does not create an
attorney-client relationship.\'

**Payment Stripe handles PCI-DSS compliance --- platform is
Compliance** SAQ A eligible

**Data Retention** Auto-delete client PII after 2 years of inactivity
per configurable policy

---

##

##

## 09 --- NON-FUNCTIONAL REQUIREMENTS

##

9\. Non-Functional Requirements

+:-------------------------+:--------------------------------------------------+
| **Requirement** | **Specification** |
+--------------------------+---------------------------------------------------+
| **Performance** | Search results load in \< 300ms (Algolia CDN). |
| | Appointment booking completes in \< 2s end-to-end |
| | including Stripe PaymentIntent creation. |
+--------------------------+---------------------------------------------------+
| **Availability** | 99.9% uptime SLA for core booking API. |
| | Auto-scaling on Railway/Render. Vercel CDN for |
| | zero-downtime frontend deploys. |
+--------------------------+---------------------------------------------------+
| **Scalability** | Architecture supports horizontal scaling of |
| | backend. BullMQ workers scale independently. |
| | Database connection pooling via PgBouncer. |
+--------------------------+---------------------------------------------------+
| **SEO** | Next.js 16 SSR for landing and lawyer profile pages. Dynamic OG |
| | images (satori). Structured data (JSON-LD: |
| | LegalService schema). Sitemap auto-generated. |
+--------------------------+---------------------------------------------------+
| **Accessibility** | WCAG 2.1 Level AA target. Keyboard navigable. |
| | Screen reader compatible. Colour contrast ratios |
| | met. |
+--------------------------+---------------------------------------------------+
| **Internationalisation** | next-intl for i18n-ready architecture from day |
| | one. Date/time in user\'s local timezone. |
| | Multi-currency support via Stripe. |
| | |
| | Project must support Bengali and English |
| | initially. Use next-intl for localized routing, |
| | date/time formatting, and translations. The |
| | database must store lawyer-provided content |
| | (bios) in a way that supports multi-language |
| | retrieval. |
+--------------------------+---------------------------------------------------+
| **Mobile** | Mobile-first responsive design. PWA capability |
| | (offline appointment viewing). Phase 3: React |
| | Native apps using shared business logic. |
+--------------------------+---------------------------------------------------+
| **Monitoring** | Sentry error tracking with \< 5min alert. Uptime |
| | monitoring (Better Uptime). Core Web Vitals |
| | tracked via Vercel Analytics. |
+--------------------------+---------------------------------------------------+

10 --- DEVELOPMENT MILESTONES

10\. Development Roadmap & Milestones

Timeline assumes 1 senior full-stack JS developer using Claude Code
heavily for scaffolding, boilerplate, and code generation.

---

**Timeline** **Deliverables**

**Week 1-2** Project setup: 4-app monorepo (Next.js landing + React 19
client/lawyer/admin portals) + Express API, Drizzle schema, Passport.js auth
(local + social), Railway DB, CI/CD pipeline, component library setup

**Week 3-4** Lawyer search: Algolia indexing, search UI, filter
system, lawyer profile page (SSR), lawyer card
components

**Week 5-6** Appointment booking: availability calendar UI,
booking flow (select slot → confirm → pay), Stripe
PaymentIntent integration

**Week 7-8** Lawyer onboarding: multi-step wizard, S3 credential
upload, admin verification panel, approval workflow,
email notifications (Resend)

**Week 9-10** Lawyer dashboard: earnings, booking management,
availability calendar editor, Google Calendar sync,
payout connect (Stripe Connect)

**Week 11-12** Reviews system, dispute/cancellation flows, BullMQ
reminder jobs, landing page, SEO optimization,
Playwright E2E tests

**Week 13-14** Beta testing with real lawyers, performance audit,
security pen test, legal disclaimers, soft launch
(invite-only)

**Week 15-16** AI lawyer matching (Claude API), video consultations
(Daily.co), public launch, investor deck ready

**Month 5-6** Mobile PWA, review analytics, lawyer subscription
tiers, featured listings, referral program, first
\$10K MRR target

---

## 10.1 Claude Code Usage Strategy

## Use Claude Code (claude \--code) for: Drizzle schema generation from natural language, Express route scaffolding, React component generation, Stripe webhook handlers, BullMQ job templates, OpenAPI spec generation, and Playwright test writing. Estimated 40-50% productivity gain.

##

## 11 --- RISKS & MITIGATIONS

##

11\. Risk Analysis

---

**Risk** **Probability** **Mitigation**

**Fake Lawyer HIGH Manual
Profiles** verification + bar
association API
checks + community
flagging system

**Payment MEDIUM Stripe Radar +
Disputes** clear cancellation
policy shown at
booking +
escrow-style hold

**Low Lawyer HIGH Seed with 50-100
Supply at lawyers in target
Launch** city before client
launch. Offer
3-month free Pro
plan.

**Legal HIGH Strong disclaimers,
Liability** Terms of Service
drafted by a
lawyer,
attorney-client
disclaimer on all
pages

**Low Client MEDIUM Verified badge
Trust** system, review
transparency,
money-back
guarantee for
no-shows

**Competitor LOW Move fast, build
Copycat** review moat, lock
in lawyer
exclusivity deals
with Pro annual
plans

**GDPR MEDIUM Privacy-by-design
Violation** from day 1, DPA
with all
third-party
processors, regular
audits

**Stripe Account LOW Maintain low
Termination** dispute rate
(\<0.5%), clear
business
description,
respond to disputes
fast

---

12 --- APPENDIX & GLOSSARY

12\. Appendix

## 12.1 Glossary

---

**Term** **Definition**

**SRS** Software Requirements Specification --- this
document

**MVP** Minimum Viable Product --- the smallest shippable
version

**RBAC** Role-Based Access Control --- permission model

**SSR** Server-Side Rendering --- Next.js renders HTML on
server for SEO

**Stripe Connect** Stripe\'s marketplace product for split payments

**BullMQ** Node.js job queue backed by Redis for background
tasks

**pgvector** PostgreSQL extension for storing and querying ML
embeddings

**Drizzle ORM** TypeScript-first ORM/SQL builder for type-safe database access

**P0 / P1 / P2** Priority levels: P0=ship at launch, P1=60 days,
P2=growth phase

**Telelaw** Legal consultation conducted via video/phone (remote
legal services)

---

##

##

## 12.2 Recommended Learning Resources

Next.js 16 App Router: nextjs.org/docs

Drizzle ORM with PostgreSQL: orm.drizzle.team/docs

Stripe Connect for Marketplaces: stripe.com/docs/connect

Passport.js Authentication: passportjs.org

Claude API for AI features: docs.anthropic.com

BullMQ Job Queues: docs.bullmq.io

_OkilChai SRS v1.0 --- Prepared with Claude AI_

Confidential & Proprietary --- Not for Distribution
