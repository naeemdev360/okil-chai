export const lawyersKeys = {
    all: () => ['lawyers'],
    lists: () => [...lawyersKeys.all(), 'list'],
    list: (params) => [...lawyersKeys.lists(), params],
    details: () => [...lawyersKeys.all(), 'detail'],
    detail: (id) => [...lawyersKeys.details(), id],
    availability: (id, params) => [...lawyersKeys.detail(id), 'availability', params],
    dashboard: () => [...lawyersKeys.all(), 'dashboard'],
};
