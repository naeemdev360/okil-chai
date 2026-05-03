# CLAUDE.md — Enterprise Project Constitution

> Read this file fully before writing any code. This is the authoritative guide
> for every session. All generated code must conform to every rule here.

---

## 1. Project Context

- **SRS**: See `SRS.md` (or `docs/SRS.md` if moved) — functional requirements,
  user stories, acceptance criteria. Read the relevant section before implementing any
  feature.
- **Design & Branding**: See `DESIGN.md` (or `docs/DESIGN.md` if moved) — color
  tokens, typography, spacing, component patterns. Read before writing any UI code.
- **Stack**: NestJS (latest) · Next.js 16 (latest, App Router) · TypeScript (strict mode)
- **Purpose**: Enterprise-grade, production-ready application.

---

## 2. Non-Negotiable Engineering Principles

### SOLID

- **S** — Every class/module has ONE reason to change. No God classes.
- **O** — Extend behavior via new classes/strategies, never by modifying existing ones.
- **L** — Subtypes must be substitutable for their base types without breaking behavior.
- **I** — Prefer small, focused interfaces. No fat interfaces with unused methods.
- **D** — Depend on abstractions (interfaces/tokens), not on concrete implementations.
  Use NestJS DI with injection tokens for all service dependencies.

### DRY

- Extract any logic used more than once into a shared utility, service, or hook.
- Shared backend utilities go in `apps/api/src/common/`.
- Shared frontend utilities go in `apps/web/src/lib/`.
- Never copy-paste code blocks — abstract them first.

### Clean Code

- Functions do ONE thing. Max 20 lines per function — if longer, decompose.
- No magic numbers or strings — use named constants or enums.
- Variable/function names must be self-documenting. No `data`, `res`, `tmp`, `x`.
- No commented-out code in final output. No TODO comments without a ticket reference.
- Cyclomatic complexity per function: max 5. If higher, decompose with strategy/chain pattern.

### Other Principles

- **YAGNI**: Don't build what's not in the SRS. No speculative abstractions.
- **Fail fast**: Validate at the boundary (DTOs, Zod schemas). Throw early, return late.
- **Immutability**: Prefer `readonly`, `const`, and immutable data structures.
- **Error transparency**: Every error must be typed, named, and caught at the right layer.

---

## 3. Monorepo Structure

```
/
├── apps/
│   ├── api/                        # NestJS backend
│   │   └── src/
│   │       ├── modules/            # Feature modules (one folder per domain)
│   │       │   └── [feature]/
│   │       │       ├── [feature].module.ts
│   │       │       ├── [feature].controller.ts
│   │       │       ├── [feature].service.ts
│   │       │       ├── [feature].repository.ts
│   │       │       ├── dto/        # Request/Response DTOs
│   │       │       ├── entities/   # DB entities / domain models
│   │       │       ├── interfaces/ # Contracts & injection tokens
│   │       │       └── __tests__/  # Unit + integration tests
│   │       ├── common/             # Shared backend code
│   │       │   ├── decorators/
│   │       │   ├── filters/        # Exception filters
│   │       │   ├── guards/
│   │       │   ├── interceptors/
│   │       │   ├── pipes/
│   │       │   └── utils/
│   │       ├── config/             # Typed config with @nestjs/config
│   │       ├── database/           # DB connection, migrations, seeds
│   │       └── main.ts
│   └── web/                        # Next.js frontend
│       └── src/
│           ├── app/                # App Router pages and layouts
│           │   └── (routes)/
│           │       └── [route]/
│           │           ├── page.tsx        # RSC by default
│           │           ├── loading.tsx
│           │           └── error.tsx
│           ├── components/
│           │   ├── ui/             # Pure, dumb, reusable primitives
│           │   └── features/       # Smart domain components
│           ├── lib/
│           │   ├── api/            # API client (typed fetch wrappers)
│           │   ├── hooks/          # Custom React hooks
│           │   ├── store/          # Global state (Zustand or Context)
│           │   └── utils/          # Pure utility functions
│           ├── styles/             # Global CSS, design tokens
│           └── types/              # Shared frontend types
├── packages/
│   └── shared/                     # Types/contracts shared between api & web
│       ├── src/
│       │   ├── dto/                # Shared DTOs (use class-transformer compatible)
│       │   ├── enums/
│       │   └── types/
│       └── package.json
├── docs/
│   ├── SRS.md
│   └── DESIGN.md
├── CLAUDE.md                       ← you are here
└── package.json                    # Monorepo root (pnpm workspaces)
```

**Rule**: Never create files outside this structure without justification.
**Rule**: Every new feature must be a new module — never add to existing modules unless it belongs there by domain.

---

## 4. NestJS Backend Rules

### Module Design

- One NestJS module per business domain. Modules are self-contained.
- Export only what other modules need. Keep internal services private.
- Use `forRootAsync` with factory functions for all config-dependent modules.

### Dependency Injection

- Always define an interface and an injection token for each service.
- Register using `{ provide: TOKEN, useClass: ConcreteService }`.
- Never inject concrete classes directly into controllers or other services.

```typescript
// interfaces/user-service.interface.ts
export const USER_SERVICE = Symbol('USER_SERVICE');
export interface IUserService {
  findById(id: string): Promise<User>;
}

// users.module.ts
providers: [{ provide: USER_SERVICE, useClass: UserService }]

// users.controller.ts
constructor(@Inject(USER_SERVICE) private readonly userService: IUserService) {}
```

### Controllers

- Controllers only: parse request, delegate to service, return response.
- No business logic in controllers. Ever.
- Use class-validator DTOs for all input. Apply `ValidationPipe` globally.
- Return typed response DTOs — never return raw DB entities.
- Document every endpoint with `@ApiTags`, `@ApiOperation`, `@ApiResponse` (Swagger).

### Services

- Services contain all business logic.
- Services must not know about HTTP (no `Request`, `Response`).
- Services communicate with the DB via repositories only — never raw ORM calls in services.
- Long operations must be broken into private methods with clear names.

### Repositories

- Encapsulate all DB queries in a repository class implementing a typed interface.
- Never write raw queries in services or controllers.
- Repository methods must have descriptive names: `findActiveUsersByRole`, not `find`.

### DTOs

- Separate Request DTOs (input validation) from Response DTOs (output shaping).
- Use `class-validator` + `class-transformer` for all DTOs.
- Never expose internal fields (passwords, internal IDs) in response DTOs.
- Use `@Exclude()` + `ClassSerializerInterceptor` globally.

```typescript
// dto/create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
```

### Error Handling

- Create domain-specific exception classes extending `HttpException`.
- Register a global `AllExceptionsFilter` — never let raw errors reach the client.
- All errors must have a consistent shape: `{ statusCode, message, errorCode, timestamp }`.
- Log errors via a `LoggerService` (abstracted — never use `console.log`).

### Guards & Interceptors

- Authentication: JWT `AuthGuard` applied globally, with `@Public()` decorator to opt out.
- Authorization: `RolesGuard` with `@Roles(Role.ADMIN)` decorator.
- Logging: `LoggingInterceptor` on all routes.
- Response transformation: `TransformInterceptor` to wrap all responses in `{ data, meta }`.

### Configuration

- All config via `@nestjs/config` with a typed `ConfigService`.
- Define a config schema with Joi or Zod validation at startup.
- Never use `process.env` directly — always go through `ConfigService`.

```typescript
// config/app.config.ts
export const appConfig = registerAs("app", () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV,
}));
```

---

## 5. Next.js Frontend Rules

### App Router & Rendering Strategy

- **Default to React Server Components (RSC)**. Only add `'use client'` when you need:
  interactivity, browser APIs, event listeners, or React hooks.
- Data fetching happens in RSC using async components. Never fetch in client components
  unless it's a user-triggered action.
- Use `loading.tsx` and `error.tsx` in every route segment.
- Use `generateMetadata()` for all page-level SEO metadata.

```typescript
// app/users/page.tsx — RSC
export default async function UsersPage() {
  const users = await userService.getAll(); // server-side fetch
  return <UserList users={users} />;
}
```

### Component Architecture

- **ui/**: Purely presentational. No data fetching. No business logic. Fully typed props.
  Follows design tokens from `DESIGN.md` exactly.
- **features/**: Domain-aware components. May use hooks and context. Compose `ui/` primitives.
- Props interfaces must be explicit — never use `any` or object spread for props.
- Extract any logic > 5 lines from JSX into a custom hook or utility.

### Design system reuse (monorepo)

- **Shared visual primitives** (surfaces, controls, consistent shells) belong in `packages/ui` and are imported as `@okil-chai/ui`. Prefer variants (`cva`) and design-token shadows/radii over duplicated class strings or ad hoc hex values.
- **Extract when** the same styling pattern appears in more than one place or app, or when a second use is clearly imminent — keep one component with props/variants instead of copy-paste.
- **Keep local** when the UI is a one-off layout or tightly tied to one feature’s domain; compose smaller primitives rather than forcing premature abstraction.
- Cursor: see `.cursor/rules/design-system-reuse.mdc` for the full extraction checklist.

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

### Data Fetching & API Layer

- All API calls go through a typed client in `lib/api/`.
- Use a base `fetcher` that handles auth headers, error normalization, and retries.
- Use React Query (TanStack Query) for all client-side data fetching and caching.
- Never call `fetch` directly in a component — always use the `lib/api` layer.

```typescript
// lib/api/users.api.ts
export const usersApi = {
  getAll: (): Promise<User[]> => fetcher("/users"),
  getById: (id: string): Promise<User> => fetcher(`/users/${id}`),
  create: (dto: CreateUserDto): Promise<User> =>
    fetcher("/users", { method: "POST", body: dto }),
};
```

### Type Safety

- `strict: true` in `tsconfig.json`. No `@ts-ignore` or `@ts-expect-error` without comment.
- All API response types live in `packages/shared/` and are used by both apps.
- Validate runtime data from APIs with Zod before using it.
- Use `satisfies` operator for config objects to get type-checking without widening.

### State Management

- Server state: React Query (TanStack Query).
- UI/client state: `useState` and `useReducer` for local; Zustand for global.
- No Redux. No Context for frequently-changing values (use Zustand instead).
- Store shape must be defined with a TypeScript interface before implementation.

### Styling

- Use Tailwind CSS utility classes as defined in `DESIGN.md`.
- Design tokens (colors, spacing, font sizes) must come from `tailwind.config.ts` — never
  hard-code hex values or pixel values directly in JSX.
- Component-level styles via CSS Modules only when Tailwind is insufficient.
- Never use inline `style={{}}` unless the value is dynamic and cannot be expressed with Tailwind.

### Forms

- All forms use React Hook Form + Zod resolver.
- Every form field must have accessible labels, error messages, and ARIA attributes.
- Validation schemas are defined separately and reused in both frontend and backend (via shared package).

---

## 6. TypeScript Rules (Both Apps)

- **Strict mode always**. No exceptions.
- No `any`. If the type is unknown, use `unknown` and narrow it.
- Prefer `interface` for object shapes, `type` for unions/intersections/aliases.
- Use `readonly` arrays and properties for data that shouldn't be mutated.
- Generic functions must have descriptive type parameter names: `T extends Entity`, not just `T`.
- Enums for fixed sets of values — string enums preferred for debuggability.
- Avoid `as` type assertions. If you must, add a comment explaining why.

```typescript
// Good
interface PaginatedResponse<TData> {
  readonly data: TData[];
  readonly meta: PaginationMeta;
}

// Bad
const result = response as any;
```

---

## 7. Testing Requirements

Every feature must ship with tests. Claude must generate tests alongside implementation.

### Backend (NestJS)

- **Unit tests**: Every service method. Mock repositories with `jest.fn()`.
- **Integration tests**: Every controller endpoint using `@nestjs/testing` + `supertest`.
- **Test file location**: `src/modules/[feature]/__tests__/`.
- Coverage target: 80% minimum on services.

```typescript
// __tests__/users.service.spec.ts
describe('UserService', () => {
  describe('findById', () => {
    it('should return user when found', async () => { ... });
    it('should throw NotFoundException when user does not exist', async () => { ... });
  });
});
```

### Frontend (Next.js)

- **Unit tests**: Utility functions and custom hooks with Vitest.
- **Component tests**: UI components with React Testing Library.
  Test behavior, not implementation.
- **E2E tests**: Critical user flows with Playwright.

---

## 8. Security Rules

- Never trust client input — validate with DTOs + class-validator on every endpoint.
- Never log sensitive data (passwords, tokens, PII).
- Use parameterized queries always — never string-interpolate into SQL.
- Apply rate limiting (`@nestjs/throttler`) on all public endpoints.
- CORS configured explicitly — no wildcard `*` in production.
- Secrets only via environment variables, never hard-coded.
- Use `helmet` middleware for HTTP security headers.
- JWT tokens: short expiry (15min access, 7d refresh). Refresh token rotation enabled.

---

## 9. Code Generation Workflow (How to Use Claude)

### Session-start gate (mandatory, every new chat/session)

Before writing or modifying any code, Claude must:

1. Read `CLAUDE.md`.
2. Read relevant sections from `SRS.md`.
3. Read relevant sections from `design-system.md` for any UI/styling work.
4. Post a short "context check" confirming which SRS and design-system sections are being
   followed.

If this context check is missing, do not generate code yet.

### Starting a new feature

```
Read SRS.md section [X] and design-system.md section [Y].
Implement the [feature name] feature following all CLAUDE.md rules.
Generate: module, controller, service, repository, DTOs, interfaces, and tests.
Do not skip tests.
```

### Starting a new UI component

```
Read design-system.md for the [component name] spec.
Build the component in components/ui/[ComponentName].tsx.
Use Tailwind tokens only. Follow the component architecture rules in CLAUDE.md.
Include Storybook story and unit tests.
```

### Reviewing generated code

```
Review [file path] for CLAUDE.md compliance.
Check: SOLID violations, DRY violations, missing tests, any/ts-ignore usage,
       business logic in wrong layer, missing error handling.
```

### When context window is filling up

Run `/clear` between features. Always re-read CLAUDE.md at the start of a new session.
Claude will reload it automatically, but you can reinforce with:

```
We're starting a new session. You have CLAUDE.md loaded.
Before coding, confirm the SRS.md and design-system.md sections you'll follow.
We're now implementing [next feature from SRS.md].
```

---

## 10. Commit & PR Standards

- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- One logical change per commit.
- PR description must reference the SRS requirement it satisfies.
- No PR merges without passing tests and lint.

---

## 11. What Claude Must Never Do

- Never put business logic in a controller or component.
- Never return raw DB entities from an API endpoint.
- Never use `any` type.
- Never skip tests for a new feature.
- Never call `process.env` directly in application code.
- Never hard-code credentials, URLs, or magic values.
- Never create a file outside the defined folder structure.
- Never use `console.log` — use the injected `LoggerService`.
- Never duplicate code that already exists in `common/` or `lib/`.
- Never use `as` type assertion without an explanatory comment.
