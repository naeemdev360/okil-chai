export function createAdminApi(http) {
    return {
        getVerifications: () => http.list('/admin/verifications'),
        approveVerification: (id, dto) => http.post(`/admin/verifications/${id}/approve`, dto),
        rejectVerification: (id, dto) => http.post(`/admin/verifications/${id}/reject`, dto),
    };
}
