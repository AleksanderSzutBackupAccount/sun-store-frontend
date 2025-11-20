import {formatError} from "~~/utils/formatError";

export default defineEventHandler(async (event) => {
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
    } catch (error: unknown) {
        const err = formatError(error)
        console.error('Proxy error → Laravel:', error);

        throw createError({
            statusCode: err.statusCode,
            statusMessage: err.message
        })
    }
});