export function createAppointmentsApi(http) {
    return {
        create: (dto) => http.post('/appointments', dto),
        getById: (id) => http.get(`/appointments/${id}`),
        cancel: (id) => http.patch(`/appointments/${id}/cancel`),
    };
}
