const messageLoaders = {
    en: async () => {
        const [common, auth, booking, lawyer] = await Promise.all([
            import('./locales/en/common.json'),
            import('./locales/en/auth.json'),
            import('./locales/en/booking.json'),
            import('./locales/en/lawyer.json'),
        ]);
        return {
            common: common.default,
            auth: auth.default,
            booking: booking.default,
            lawyer: lawyer.default,
        };
    },
    bn: async () => {
        const [common, auth, booking, lawyer] = await Promise.all([
            import('./locales/bn/common.json'),
            import('./locales/bn/auth.json'),
            import('./locales/bn/booking.json'),
            import('./locales/bn/lawyer.json'),
        ]);
        return {
            common: common.default,
            auth: auth.default,
            booking: booking.default,
            lawyer: lawyer.default,
        };
    },
};
export async function getMessages(locale) {
    return messageLoaders[locale]();
}
