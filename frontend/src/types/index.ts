// Navigation
export interface Navigation {
    id: string;
    title: string;
    slug: string;
    url?: string;
    order: number;
    lastScrapedAt?: string;
    createdAt: string;
    updatedAt: string;
    categories?: Category[];
}

// Category
export interface Category {
    id: string;
    title: string;
    slug: string;
    url?: string;
    imageUrl?: string;
    productCount: number;
    order: number;
    parentId?: string;
    navigationId?: string;
    lastScrapedAt?: string;
    createdAt: string;
    updatedAt: string;
    children?: Category[];
    parent?: Category;
}

// Product
export interface Product {
    id: string;
    sourceId: string;
    title: string;
    author?: string;
    price?: number;
    originalPrice?: number;
    currency: string;
    imageUrl?: string;
    sourceUrl: string;
    condition?: string;
    format?: string;
    inStock: boolean;
    categoryId?: string;
    lastScrapedAt?: string;
    createdAt: string;
    updatedAt: string;
    category?: Category;
    detail?: ProductDetail;
    reviews?: Review[];
}

// Product Detail
export interface ProductDetail {
    id: string;
    productId: string;
    description?: string;
    publisher?: string;
    publicationDate?: string;
    isbn?: string;
    isbn13?: string;
    pages?: number;
    language?: string;
    dimensions?: string;
    weight?: string;
    specs?: Record<string, string>;
    ratingsAvg?: number;
    reviewsCount?: number;
    relatedProducts?: RelatedProduct[];
    recommendedProducts?: RelatedProduct[];
    createdAt: string;
    updatedAt: string;
}

export interface RelatedProduct {
    sourceId: string;
    title: string;
    url: string;
}

// Review
export interface Review {
    id: string;
    productId: string;
    author?: string;
    rating?: number;
    title?: string;
    text?: string;
    reviewDate?: string;
    verified: boolean;
    createdAt: string;
}

// Scrape Job
export interface ScrapeJob {
    id: string;
    targetUrl: string;
    targetType: 'navigation' | 'category' | 'product_list' | 'product_detail';
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    itemsScraped: number;
    retryCount: number;
    maxRetries: number;
    startedAt?: string;
    finishedAt?: string;
    errorLog?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
}

// View History
export interface ViewHistory {
    id: string;
    userId?: string;
    sessionId: string;
    path: string;
    pageType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// Query params
export interface ProductQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    categorySlug?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    author?: string;
    condition?: string;
    format?: string;
    sortBy?: 'title' | 'price' | 'createdAt' | 'updatedAt';
    sortOrder?: 'ASC' | 'DESC';
}
