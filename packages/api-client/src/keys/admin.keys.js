export const adminKeys = {
    all: () => ['admin'],
    verifications: () => [...adminKeys.all(), 'verifications'],
    verificationsByStatus: (status) => [...adminKeys.verifications(), status],
};
