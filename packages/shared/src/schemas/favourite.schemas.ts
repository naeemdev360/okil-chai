import { z } from 'zod';

export const FavouriteToggleResponseSchema = z.object({
  lawyerId: z.string().uuid(),
  isFavourited: z.boolean(),
});

export type FavouriteToggleResponse = z.infer<typeof FavouriteToggleResponseSchema>;
