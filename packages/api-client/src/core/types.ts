export interface ApiClientConfig {
  readonly baseUrl: string;
  readonly getToken: () => string | null;
}
