import type { ProductSearchResponse, Product } from '~/types/ProductSearch'
import { ref, computed, watch } from 'vue'


export interface ProductsQuery {
    query: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    filters: Record<string, any>,
    priceRange: { min?: number, max?: number };
    category: string | null;
    page: number;
}

function buildFilterQuery(filters: Record<string, any>) {
    const params: Record<string, any> = {}

    console.log(filters)
    for (const key in filters) {
        const value = filters[key]

        if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
            params[`filters[${key}][]`] = value
            continue
        }

        if (Array.isArray(value)) {
            params[`filters[${key}][]`] = value
            continue
        }

        params[`filters[${key}]`] = value
    }
    console.log(params)

    return params
}

export function useProductList() {
    const products = ref<Product[]>([])
    const loading = ref(false)
    const filters = ref({})
    const error = ref<string | null>(null)

    const searchQueryData = ref<ProductsQuery>({
        query: '',
        sortField: 'created_at',
        sortOrder: 'asc',
        filters: {},
        priceRange: { min: 0, max: undefined },
        category: null,
        page: 1,
    });

    // cursors
    const nextCursor = ref<string | null>(null)
    const previousCursor = ref<string | null>(null)

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
                query: {
                    cursor: cursor ?? null,
                    query: searchQueryData.value.query || null,
                    category: searchQueryData.value.category,
                    sort_by: searchQueryData.value.sortField || null,
                    sort_order: searchQueryData.value.sortOrder || null,
                    min_price: searchQueryData.value.priceRange.min,
                    max_price: searchQueryData.value.priceRange.max,
                    ...buildFilterQuery(searchQueryData.value.filters),
                },
            })

            products.value = res.data
            nextCursor.value = res.meta.next_cursor
            previousCursor.value = res.meta.previous_cursor
            total.value = res.meta.total
            perPage.value = res.meta.per_page
            pageCursorMap.value[searchQueryData.value.page] = cursor ?? null
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }
   async function fetchFilters() {
        try {
            const res = await $fetch<ProductSearchResponse>('/api/filters', {
            })

            filters.value = res
        } catch (e: any) {
            error.value = e.message
        } finally {
            loading.value = false
        }
    }

    watch(() => searchQueryData.value.page, (p, old) => {
        if (p !== old) {
            void goToPage(p)
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
        filters,
        total,
        fetchFilters,
        fetchProducts,
        searchQueryData,
    }
}