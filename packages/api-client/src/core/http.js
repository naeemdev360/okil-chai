export function createHttp(instance) {
    return {
        get: (url, config) => instance.get(url, config).then((r) => r.data.data),
        list: (url, config) => instance.get(url, config).then((r) => r.data),
        post: (url, data, config) => instance.post(url, data, config).then((r) => r.data.data),
        patch: (url, data, config) => instance.patch(url, data, config).then((r) => r.data.data),
        upload: (url, formData, config) => instance.post(url, formData, config).then((r) => r.data.data),
        remove: (url, config) => instance.delete(url, config).then((r) => r.data.data),
    };
}
