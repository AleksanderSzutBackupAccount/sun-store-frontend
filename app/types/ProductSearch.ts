export interface Product {
    id: string
    name: string
    category: string
    price: number
    description: string
    attributes: Record<string, string>
    manufacturer: string
    created_at: string
}

export interface ProductSearchMeta {
    next_cursor: string | null
    previous_cursor: string | null
    per_page: number
    count: number
    total: number
}

export interface ProductSearchResponse {
    data: Product[]
    meta: ProductSearchMeta
}