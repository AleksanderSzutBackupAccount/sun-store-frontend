export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const query = getQuery(event);

    const backendUrl = `${process.env.NUXT_API_URL}/api/search/products/filters`;

    try {
        const response = await $fetch(backendUrl, {
            method: 'GET',
            query,
            headers: {
                Authorization: getHeader(event, 'authorization') || '',
                'Content-Type': 'application/json',
            }
        });

        return response;
    } catch (error: any) {
        console.error('Proxy error → Laravel:', error);
        throw createError({
            statusCode: error?.statusCode || 500,
            statusMessage: error?.message || 'Proxy error',
        });
    }
});