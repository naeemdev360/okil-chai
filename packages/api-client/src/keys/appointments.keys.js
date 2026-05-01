export const appointmentsKeys = {
    all: () => ['appointments'],
    details: () => [...appointmentsKeys.all(), 'detail'],
    detail: (id) => [...appointmentsKeys.details(), id],
};
