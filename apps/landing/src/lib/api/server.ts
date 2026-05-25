import type { AvailabilitySlot, LawyerPublicProfileResponse } from '@repo/shared';

const API_BASE = `${process.env['NEXT_PUBLIC_API_URL'] ?? ''}/api/v1`;

export async function fetchPublicLawyerProfile(
  id: string,
): Promise<LawyerPublicProfileResponse | null> {
  const res = await fetch(`${API_BASE}/lawyers/${id}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch lawyer profile: ${res.status}`);
  const json = (await res.json()) as { data: LawyerPublicProfileResponse };
  return json.data;
}

export async function fetchLawyerAvailability(
  id: string,
  from: string,
  to: string,
): Promise<AvailabilitySlot[]> {
  const params = new URLSearchParams({ from, to });
  const res = await fetch(`${API_BASE}/lawyers/${id}/availability?${params.toString()}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { data: AvailabilitySlot[] };
  return json.data ?? [];
}
