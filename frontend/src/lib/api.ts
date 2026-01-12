import axios from 'axios';
import type {
    Navigation,
    Category,
    Product,
    ProductDetail,
    Review,
    ScrapeJob,
    ViewHistory,
    PaginatedResponse,
    ProductQueryParams,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Navigation API
export const navigationApi = {
    getAll: async (): Promise<Navigation[]> => {
        const { data } = await api.get('/api/navigations');
        return data;
    },

    getBySlug: async (slug: string): Promise<Navigation> => {
        const { data } = await api.get(`/api/navigations/${slug}`);
        return data;
    },

    scrape: async (forceRefresh = false): Promise<Navigation[]> => {
        const { data } = await api.post('/api/navigations/scrape', { forceRefresh });
        return data;
    },
};

// Category API
export const categoryApi = {
    getAll: async (): Promise<Category[]> => {
        const { data } = await api.get('/api/categories');
        return data;
    },

    getTree: async (): Promise<Category[]> => {
        const { data } = await api.get('/api/categories/tree');
        return data;
    },

    getRootCategories: async (): Promise<Category[]> => {
        const { data } = await api.get('/api/categories/root');
        return data;
    },

    getBySlug: async (slug: string): Promise<Category> => {
        const { data } = await api.get(`/api/categories/${slug}`);
        return data;
    },

    getByNavigationId: async (navigationId: string): Promise<Category[]> => {
        const { data } = await api.get(`/api/categories/navigation/${navigationId}`);
        return data;
    },

    getSubcategories: async (categoryId: string): Promise<Category[]> => {
        const { data } = await api.get(`/api/categories/${categoryId}/subcategories`);
        return data;
    },

    scrape: async (slug?: string, forceRefresh = false): Promise<Category[]> => {
        const url = slug ? `/api/categories/${slug}/scrape` : '/api/categories/scrape';
        const { data } = await api.post(url, { forceRefresh });
        return data;
    },
};

// Product API
export const productApi = {
    getAll: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
        const { data } = await api.get('/api/products', { params });
        return data;
    },

    getById: async (id: string): Promise<Product> => {
        const { data } = await api.get(`/api/products/${id}`);
        return data;
    },

    getBySourceId: async (sourceId: string): Promise<Product> => {
        const { data } = await api.get(`/api/products/source/${sourceId}`);
        return data;
    },

    getDetails: async (id: string): Promise<ProductDetail | null> => {
        const { data } = await api.get(`/api/products/${id}/details`);
        return data;
    },

    getRelated: async (id: string, limit = 6): Promise<Product[]> => {
        const { data } = await api.get(`/api/products/${id}/related`, { params: { limit } });
        return data;
    },

    getRecent: async (limit = 10): Promise<Product[]> => {
        const { data } = await api.get('/api/products/recent', { params: { limit } });
        return data;
    },

    scrapeDetail: async (id: string, forceRefresh = false): Promise<ProductDetail> => {
        const { data } = await api.post(`/api/products/${id}/scrape`, { forceRefresh });
        return data;
    },

    scrapeProductList: async (
        categorySlug: string,
        page = 1,
        limit = 20,
        forceRefresh = false,
    ): Promise<Product[]> => {
        const { data } = await api.post(`/api/products/category/${categorySlug}/scrape`, {
            forceRefresh,
        }, { params: { page, limit } });
        return data;
    },
};

// Review API
export const reviewApi = {
    getByProductId: async (productId: string): Promise<Review[]> => {
        const { data } = await api.get(`/api/reviews/product/${productId}`);
        return data;
    },

    getAverageRating: async (productId: string): Promise<{ average: number; count: number }> => {
        const { data } = await api.get(`/api/reviews/product/${productId}/rating`);
        return data;
    },
};

// Scrape Job API
export const scrapeJobApi = {
    getAll: async (): Promise<ScrapeJob[]> => {
        const { data } = await api.get('/api/scrape-jobs');
        return data;
    },

    getById: async (id: string): Promise<ScrapeJob> => {
        const { data } = await api.get(`/api/scrape-jobs/${id}`);
        return data;
    },

    scrapeNavigations: async (forceRefresh = false): Promise<Navigation[]> => {
        const { data } = await api.post('/api/scrape-jobs/navigations', { forceRefresh });
        return data;
    },

    scrapeCategories: async (slug?: string, forceRefresh = false): Promise<Category[]> => {
        const url = slug ? `/api/scrape-jobs/categories/${slug}` : '/api/scrape-jobs/categories';
        const { data } = await api.post(url, { forceRefresh });
        return data;
    },

    scrapeProducts: async (
        categorySlug: string,
        page = 1,
        limit = 20,
        forceRefresh = false,
    ): Promise<Product[]> => {
        const { data } = await api.post(`/api/scrape-jobs/products/${categorySlug}`, {
            forceRefresh,
            page,
            limit,
        });
        return data;
    },

    scrapeProductDetail: async (sourceId: string, forceRefresh = false): Promise<ProductDetail> => {
        const { data } = await api.post(`/api/scrape-jobs/product-detail/${sourceId}`, { forceRefresh });
        return data;
    },
};

// View History API
export const viewHistoryApi = {
    getBySessionId: async (sessionId: string, limit = 50): Promise<ViewHistory[]> => {
        const { data } = await api.get(`/api/view-history/session/${sessionId}`, { params: { limit } });
        return data;
    },

    getRecentlyViewedProducts: async (sessionId: string, limit = 10): Promise<ViewHistory[]> => {
        const { data } = await api.get(`/api/view-history/session/${sessionId}/products`, { params: { limit } });
        return data;
    },

    recordView: async (viewData: {
        sessionId: string;
        path: string;
        pageType?: string;
        entityId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<ViewHistory> => {
        const { data } = await api.post('/api/view-history', viewData);
        return data;
    },

    clearSessionHistory: async (sessionId: string): Promise<void> => {
        await api.delete(`/api/view-history/session/${sessionId}`);
    },
};

export default api;
