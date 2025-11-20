import type {Product, ProductSearchResponse} from "~/types/ProductSearch";
import {ref} from "vue";
import {formatError} from "~~/utils/formatError";

export function useProductFetch() {

    const products = ref<Product[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const searchQuery = ref<string>('')
    const sortField = ref<string>('name')
    const sortOrder = ref<'asc' | 'desc'>('asc')

    // cursors
    const nextCursor = ref<string | null>(null)
    const previousCursor = ref<string | null>(null)
    const currentPage = ref(1)

    const pageCursorMap = ref<Record<number, string | null>>({
        1: null
    })

    const total = ref(0)
    const perPage = ref(15)

    async function fetch(cursor?: string | null) {
        loading.value = true
        error.value = null

        try {
            const res = await $fetch<ProductSearchResponse>('/api/products', {
                params: {
                    cursor: cursor ?? null,
                    search: searchQuery.value || null,
                    sort_field: sortField.value || null,
                    sort_order: sortOrder.value || null,
                },
            })

            products.value = res.data
            nextCursor.value = res.meta.next_cursor
            previousCursor.value = res.meta.previous_cursor
            total.value = res.meta.total
            perPage.value = res.meta.per_page
            pageCursorMap.value[currentPage.value] = cursor ?? null
        } catch (e: unknown) {
            const err = formatError(e)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return {fetch, products, searchQuery}

}