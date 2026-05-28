export { createQueryClient } from './create-query-client';
export { QueryProvider } from './QueryProvider';
export { ApiClientProvider, useApiClient } from './api-client-context';

export { useLawyerSearch } from './lawyers/useLawyerSearch';
export { useLawyerDetail } from './lawyers/useLawyerDetail';
export { useLawyerAvailability } from './lawyers/useLawyerAvailability';

export { useAppointment } from './appointments/useAppointment';
export { useClientAppointments } from './appointments/useClientAppointments';
export { useCreateAppointment } from './appointments/useCreateAppointment';
export { useCancelAppointment } from './appointments/useCancelAppointment';

export { useCreateReview } from './reviews/useCreateReview';
export { useLawyerReviews } from './reviews/useLawyerReviews';

export { useAiMatch } from './ai-match/useAiMatch';

export { useFavouriteLawyers } from './favourites/useFavouriteLawyers';
export { useToggleFavourite } from './favourites/useToggleFavourite';
export { useIsFavourited } from './favourites/useIsFavourited';
export { useConversations } from './messages/useConversations';
export { useClientDashboard } from './dashboard/useClientDashboard';
