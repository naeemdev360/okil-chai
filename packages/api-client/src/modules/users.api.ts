import type { ClientLookupResponse } from '@repo/shared';
import type { Http } from '../core/http';

export function createUsersApi(http: Http) {
  return {
    // Lawyer-only: resolve a client by email to open a case on their behalf.
    lookupClientByEmail: (email: string) =>
      http.get<ClientLookupResponse>('/users/clients/lookup', { params: { email } }),
  } as const;
}
