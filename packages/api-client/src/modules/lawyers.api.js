export function createLawyersApi(http) {
    return {
        search: (params) => http.list('/lawyers', { params }),
        getById: (id) => http.get(`/lawyers/${id}`),
        getAvailability: (id, params) => http.get(`/lawyers/${id}/availability`, { params }),
        getMyDashboard: () => http.get('/lawyers/me/dashboard'),
        uploadAvatar: (formData) => http.upload('/lawyers/me/avatar', formData),
    };
}
