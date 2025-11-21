import type {FiltersResponse, Product, ProductSearchResponse} from '~/types/ProductSearch'
import {computed, ref, watch} from 'vue'
import {formatError} from "~~/utils/formatError";

export type FilterRange = { 0: number, 1: number }
export type FilterSelect = string
export type FilterSelectMany = string[]

export type FilterValue = FilterRange | FilterSelect | FilterSelectMany | undefined
export type Filters = Record<string, FilterValue>

export interface ProductsQuery {
    query: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    filters: Filters,
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
    });
    const filters = computed(() => {
        const raw = searchQueryData.value.filters

        return Object.fromEntries(
            Object.entries(raw).filter(([_, value]) => {
                if(Array.isArray(value)) {
                    return value.length > 0
                }
                return value !== undefined
            })
        )
    })

    // cursors
    const nextCursor = ref<string | null>(null)

    const pageCursorMap = ref<Record<number, string | null>>({
        1: null
    })

    // numeric pagination
    const total = ref(0)
    const perPage = ref(15)

    // UI pages
    const totalPages = computed(() => Math.ceil(total.value / perPage.value))
    const page = ref(1)

    watch(searchQueryData, () => {
        pageCursorMap.value = {1: null}
        if(page.value === 1) {
            fetchProducts()
            return
        }
        page.value = 1
    }, {deep: true})

    async function fetchProducts(cursor?: string | null, page: number = 1) {
        loading.value = true
        error.value = null

        try {
            const res = await $fetch<ProductSearchResponse>('/api/products', {
                query: {
                    cursor: cursor ?? null,
                    search: searchQueryData.value.query || null,
                    sort_by: searchQueryData.value.sortField || null,
                    sort_order: searchQueryData.value.sortOrder || null,
                    ...buildFilterQuery(searchQueryData.value.filters),
                },
            })

            products.value = res.data
            nextCursor.value = res.meta.next_cursor
            total.value = res.meta.total
            perPage.value = res.meta.per_page
            pageCursorMap.value[page+1] = res.meta.next_cursor
        } catch (e: unknown) {
            const err = formatError(e)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    async function fetchFilters() {
        try {
            filtersDefinition.value = await $fetch<FiltersResponse>('/api/filters', {})
        } catch (e: unknown) {
            const err = formatError(e)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    watch(() => page.value, (p, old) => {
        if (p !== old) {
            void goToPage(p)
        }
    })

    async function iterateOnPageCursors(targetPage: number) {
        const knownPages = Object.keys(pageCursorMap.value).map(Number)
        let currentPage = knownPages.length ? Math.max(...knownPages) : 1

        while (currentPage < targetPage) {
            const currentCursor = pageCursorMap.value[currentPage] ?? null

            await fetchProducts(currentCursor, currentPage)

            currentPage++

            if (pageCursorMap.value[currentPage] === undefined) {
                break
            }
        }
    }

    const isPageChanging = ref(false)

    async function goToPage(page: number) {
        if(isPageChanging.value) {
            return
        }
        isPageChanging.value = true

        await iterateOnPageCursors(page);

        if (pageCursorMap.value[page] !== undefined) {
            await fetchProducts(pageCursorMap.value[page], page)
        }

        isPageChanging.value = false
    }

    return {
        products,
        loading,
        error,
        page,
        totalPages,
        filtersDefinition,
        filters,
        total,
        fetchFilters,
        fetchProducts,
        searchQueryData,
        isPageChanging
    }
}