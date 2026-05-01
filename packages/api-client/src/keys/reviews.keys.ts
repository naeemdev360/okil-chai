export const reviewsKeys = {
  all: () => ['reviews'] as const,

  byLawyer: (lawyerId: string) => [...reviewsKeys.all(), 'lawyer', lawyerId] as const,
  byAppointment: (appointmentId: string) =>
    [...reviewsKeys.all(), 'appointment', appointmentId] as const,
} as const;
