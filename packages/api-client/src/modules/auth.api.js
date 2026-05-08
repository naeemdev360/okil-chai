export function createAuthApi(http) {
    return {
        signup: (dto) => http.post('/auth/signup', dto),
        login: (dto) => http.post('/auth/login', dto),
        refresh: (dto) => http.post('/auth/refresh', dto),
        logout: () => http.post('/auth/logout'),
        lawyerOnboarding: (dto) => http.post('/auth/lawyer-onboarding', dto),
        getMe: () => http.get('/auth/me'),
    };
}
