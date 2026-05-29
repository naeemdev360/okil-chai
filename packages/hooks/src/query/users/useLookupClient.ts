import { useMutation } from '@tanstack/react-query';
import { useApiClient } from '../api-client-context';

// Imperative lookup — UI calls it on demand (e.g. when the lawyer hits "Find client" or onBlur)
// instead of polling on every keystroke. Returns the client or throws on 404.
export function useLookupClient() {
  const api = useApiClient();
  return useMutation({
    mutationFn: (email: string) => api.users.lookupClientByEmail(email),
  });
}
