export interface ApiClientConfig {
  readonly baseUrl: string;
  /** Invoked when a silent token refresh fails — apps use this to redirect to the login page. */
  readonly onAuthFailure?: () => void;
}

/** Holds the short-lived access token in memory (never persisted) so interceptors and callers share one source. */
export interface TokenStore {
  get(): string | null;
  set(token: string | null): void;
}
