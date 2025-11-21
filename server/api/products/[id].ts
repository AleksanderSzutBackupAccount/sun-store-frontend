import { formatError } from '~~/utils/formatError'

export default defineEventHandler(async (event) => {
    const { id } = event.context.params!

    const backendUrl = `${process.env.NUXT_API_URL}/api/search/products/${id}`

    try {
        return await $fetch(backendUrl, {
            method: 'GET',
            headers: {
                Authorization: getHeader(event, 'authorization') || '',
                'Content-Type': 'application/json',
            },
        })
    } catch (error: unknown) {
        const err = formatError(error)
        console.error('Proxy error → Laravel:', error)

        throw createError({
            statusCode: err.statusCode,
            statusMessage: err.message,
        })
    }
})