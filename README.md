# Sun Store Frontend – Technical Documentation

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Composables & State Management](#composables--state-management)
  - [useProductList](#useproductlist)
  - [searchQueryData](#searchquerydata)
- [Product Search & Pagination](#product-search--pagination)
  - [Cursor-Based Pagination](#cursor-based-pagination)
  - [iterateOnPageCursors](#iterateonpagecursors)
- [Dynamic Filters](#dynamic-filters)
  - [Filter Types](#filter-types)
  - [Mapping Filters to Backend](#mapping-filters-to-backend)
  - [Filter Normalization](#filter-normalization)
  - [Clearing and Applying Filters](#clearing-and-applying-filters)
- [Error Handling](#error-handling)
- [Development](#development)
- [Production Build](#production-build)
- [TODO](#todo)

## Overview

Sun Store Frontend is a Nuxt 4 + Vue 3 application implementing a high-performance product search and filtering interface for photovoltaic and electrical components.

The frontend integrates with the backend search API and supports:

- Cursor-based pagination
- Dynamic filters (range, multi-select, attributes)
- Full-text search
- Sorting
- Reactive state management via composables
- SSR compatibility
- Component-driven structure

## Architecture

Main technologies:

- Nuxt 4 (Vue 3, Vite)
- Server-side rendering (SSR-ready)
- Composables for business logic
- `$fetch` for API communication
- Local reactive state (no Vuex/Pinia required)

Primary data flow:

Components → useProductList() composable → Backend API  
Dynamic filters are loaded once and reused throughout the UI.

## Composables & State Management

### useProductList

This composable is the core of the search UI and manages:

- Fetching products  
- Fetching filter definitions  
- Cursor-based pagination  
- Sorting and search text  
- Filter state  
- Loading and error state  
- Derived metadata (total pages, active filters)

It exposes:

- `products`
- `loading`
- `error`
- `page`
- `totalPages`
- `filtersDefinition`
- `filters`
- `total`
- `fetchFilters`
- `fetchProducts`
- `searchQueryData`
- `isPageChanging`

### searchQueryData

Central state object:

```ts
{
  query: string,
  sortField: string,
  sortOrder: 'asc' | 'desc',
  filters: Record<string, FilterValue>
}
```

All search and filter components mutate this single source of truth.

A deep watcher resets pagination when anything inside searchQueryData changes.

## Product Search & Pagination

### Cursor-Based Pagination

The backend returns:

- `meta.next_cursor`
- `meta.total`
- `meta.per_page`

Cursor pagination is used instead of offset pagination because:

- It performs significantly better in Elasticsearch.
- Results remain consistent even when sorting dynamically.
- It scales properly for large datasets.

The frontend maintains a cursor map:

```ts
pageCursorMap = {
  1: null,
  2: "cursor-1",
  3: "cursor-2"
}
```

Every new page fetch stores its corresponding cursor.

### iterateOnPageCursors

Because cursor-based pagination only moves forward, numeric page navigation is implemented by iteratively generating missing cursors.

If a user jumps from page 1 → 5:

1. Known cursors are read from pageCursorMap.
2. The app fetches pages sequentially until page 5 cursor is generated.
3. The requested page is fetched using the stored cursor.

Key properties:

- Preserves numeric pagination UX
- Avoids using backend offsets
- Guarantees consistent page content

## Dynamic Filters

### Filter Types

The system supports:

- Range filters  
- Single select  
- Multi-select  
- Attribute-based filters (dynamic)  
- Category filters  

Internal filter types:

```ts
FilterRange: { 0: number, 1: number }
FilterSelect: string
FilterSelectMany: string[]
FilterValue = FilterRange | FilterSelect | FilterSelectMany | undefined
```

### Mapping Filters to Backend

`buildFilterQuery()` converts internal filter structure into backend-compatible query parameters.

Examples:

```
filters[category]=battery
filters[manufacturer][]=EcoCharge
filters[price]=[0,100]
filters[attr_capacity][]=4
filters[attr_capacity][]=8
```

Range filters are sent as arrays.  
Multi-select values correctly expand to `filters[key][]=value`.

### Filter Normalization

The `filters` computed property removes:

- Empty arrays  
- Undefined values  

This ensures clean, minimal API requests.

### Clearing and Applying Filters

Filters live inside `searchQueryData.filters`.

To clear:

```ts
searchQueryData.value.filters = {}
```

The deep watcher triggers a refetch and resets pagination to page 1 automatically.

## Error Handling

All $fetch calls use `formatError()` to standardize errors.

Returned errors populate:

`error.value = "Something went wrong"`

The UI displays safe messages while internal details remain in the console.

## Development

Install dependencies:

```
yarn install
```

Start dev server:

```
yarn dev
```

The app runs at:

http://localhost:3000

## Production Build

Build for production:

```
yarn build
```

Preview:

```
yarn preview
```

## TODO

- Add URL sync for filters & sorting  
- Add debounce to search input  
- Add virtual scroll for long lists  
- Add tests for composables  
- Add skeleton loaders  
- Add caching for visited pages  
- Add accessibility improvements  
