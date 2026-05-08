export function createReviewsApi(http) {
    return {
        create: (dto) => http.post('/reviews', dto),
    };
}
