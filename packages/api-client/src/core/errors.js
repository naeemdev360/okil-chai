export class ApiError extends Error {
    statusCode;
    errorCode;
    timestamp;
    path;
    constructor(shape) {
        super(shape.message);
        this.name = 'ApiError';
        this.statusCode = shape.statusCode;
        this.errorCode = shape.errorCode;
        this.timestamp = shape.timestamp;
        this.path = shape.path;
    }
}
export const isApiError = (e) => e instanceof ApiError;
