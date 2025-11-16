import type { ProductSearchResponse, Product } from '~/types/ProductSearch'
import { ref, computed } from 'vue'
export function useProductsSearch() {
    const products = ref<Product[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // cursors
    const nextCursor = ref<string | null>(null)
    const previousCursor = ref<string | null>(null)
    const currentPage = ref(1)

    const pageCursorMap = ref<Record<number, string | null>>({
        1: null
    })

    // numeric pagination
    const total = ref(0)
    const perPage = ref(15)

    // UI pages
    const totalPages = computed(() => Math.ceil(total.value / perPage.value))

    async function fetchProducts(cursor?: string | null) {
        loading.value = true
        error.value = null

        try {
            const res = await $fetch<ProductSearchResponse>('/api/products', {
                params: {
                    cursor: cursor ?? null,
                },
            })

            products.value = res.data
            nextCursor.value = res.meta.next_cursor
            previousCursor.value = res.meta.previous_cursor
            total.value = res.meta.total
            perPage.value = res.meta.per_page
            pageCursorMap.value[currentPage.value] = cursor ?? null
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    function nextPage() {
        if (!nextCursor.value) return
        fetchProducts(nextCursor.value)
    }

    function prevPage() {
        if (!previousCursor.value) return
        fetchProducts(previousCursor.value)
    }
    watch(currentPage, (p, old) => {
        if (p !== old) {
            goToPage(p)
        }
    })
    async function goToPage(page: number) {
        if (pageCursorMap.value[page] !== undefined) {
            return fetchProducts(pageCursorMap.value[page])
        }

        for (let i = Object.keys(pageCursorMap.value).length; i < page; i++) {
            if (!nextCursor.value) break
            await fetchProducts(nextCursor.value)
        }
    }

    return {
        products,
        loading,
        error,
        totalPages,
        total,
        currentPage,
        fetchProducts,
        nextPage,
        prevPage,
        goToPage,
    }
}