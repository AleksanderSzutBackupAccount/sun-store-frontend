import type {FiltersResponse, Product, ProductSearchResponse} from '~/types/ProductSearch'
import {computed, ref, watch} from 'vue'


export type FilterRange = { 0: number, 1: number }
export type FilterSelect = string
export type FilterSelectMany = string[]

export type FilterValue = FilterRange | FilterSelect | FilterSelectMany | null
export type Filters = Record<string, FilterValue>

export interface ProductsQuery {
    query: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    filters: Filters,
    priceRange: { min?: number, max?: number };
    category: string | null;
    page: number;
}

function buildFilterQuery(filters: Filters) {
    const params: Record<string, unknown> = {}

    for (const key in filters) {
        const value = filters[key]

        if (Array.isArray(value)) {
            params[`filters[${key}][]`] = value
            continue
        }

        params[`filters[${key}]`] = value
    }

    return params
}

export function useProductList() {
    const products = ref<Product[]>([])
    const loading = ref(false)
    const filtersDefinition = ref<FiltersResponse>({})
    const error = ref<string | null>(null)

    const searchQueryData = ref<ProductsQuery>({
        query: '',
        sortField: 'created_at',
        sortOrder: 'asc',
        filters: {},
        priceRange: {min: 0, max: undefined},
        category: null,
        page: 1,
    });
    const filters = computed(() => {
        const raw = searchQueryData.value.filters

        return Object.fromEntries(
            Object.entries(raw).filter(([_, value]) => {
                if(Array.isArray(value)) {
                    return value.length > 0
                }
                return value !== null
            })
        )
    })

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
            filtersDefinition.value = await $fetch<FiltersResponse>('/api/filters', {})
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
        filtersDefinition,filters,
        total,
        fetchFilters,
        fetchProducts,
        searchQueryData,
    }
}