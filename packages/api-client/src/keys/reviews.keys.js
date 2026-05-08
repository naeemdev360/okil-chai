export const reviewsKeys = {
    all: () => ['reviews'],
    byLawyer: (lawyerId) => [...reviewsKeys.all(), 'lawyer', lawyerId],
    byAppointment: (appointmentId) => [...reviewsKeys.all(), 'appointment', appointmentId],
};
