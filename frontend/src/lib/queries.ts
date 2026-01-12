import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    navigationApi,
    categoryApi,
    productApi,
    reviewApi,
    scrapeJobApi,
    viewHistoryApi,
} from './api';
import type { ProductQueryParams } from '@/types';

// Query Keys
export const queryKeys = {
    navigations: ['navigations'],
    navigation: (slug: string) => ['navigation', slug],
    categories: ['categories'],
    categoryTree: ['categories', 'tree'],
    category: (slug: string) => ['category', slug],
    products: (params?: ProductQueryParams) => ['products', params],
    product: (id: string) => ['product', id],
    productDetails: (id: string) => ['product', id, 'details'],
    productRelated: (id: string) => ['product', id, 'related'],
    recentProducts: ['products', 'recent'],
    reviews: (productId: string) => ['reviews', productId],
    scrapeJobs: ['scrapeJobs'],
    viewHistory: (sessionId: string) => ['viewHistory', sessionId],
};

// Navigation Hooks
export function useNavigations() {
    return useQuery({
        queryKey: queryKeys.navigations,
        queryFn: navigationApi.getAll,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useNavigation(slug: string) {
    return useQuery({
        queryKey: queryKeys.navigation(slug),
        queryFn: () => navigationApi.getBySlug(slug),
        enabled: !!slug,
    });
}

export function useScrapeNavigations() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (forceRefresh?: boolean) => navigationApi.scrape(forceRefresh),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.navigations });
        },
    });
}

// Category Hooks
export function useCategories() {
    return useQuery({
        queryKey: queryKeys.categories,
        queryFn: categoryApi.getAll,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCategoryTree() {
    return useQuery({
        queryKey: queryKeys.categoryTree,
        queryFn: categoryApi.getTree,
        staleTime: 1000 * 60 * 5,
    });
}

export function useCategory(slug: string) {
    return useQuery({
        queryKey: queryKeys.category(slug),
        queryFn: () => categoryApi.getBySlug(slug),
        enabled: !!slug,
    });
}

export function useScrapeCategories() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ slug, forceRefresh }: { slug?: string; forceRefresh?: boolean }) =>
            categoryApi.scrape(slug, forceRefresh),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.categories });
        },
    });
}

// Product Hooks
export function useProducts(params?: ProductQueryParams) {
    return useQuery({
        queryKey: queryKeys.products(params),
        queryFn: () => productApi.getAll(params),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: queryKeys.product(id),
        queryFn: () => productApi.getById(id),
        enabled: !!id,
    });
}

export function useProductDetails(id: string) {
    return useQuery({
        queryKey: queryKeys.productDetails(id),
        queryFn: () => productApi.getDetails(id),
        enabled: !!id,
    });
}

export function useProductRelated(id: string, limit = 6) {
    return useQuery({
        queryKey: queryKeys.productRelated(id),
        queryFn: () => productApi.getRelated(id, limit),
        enabled: !!id,
    });
}

export function useRecentProducts(limit = 10) {
    return useQuery({
        queryKey: queryKeys.recentProducts,
        queryFn: () => productApi.getRecent(limit),
        staleTime: 1000 * 60 * 2,
    });
}

export function useScrapeProductDetail() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, forceRefresh }: { id: string; forceRefresh?: boolean }) =>
            productApi.scrapeDetail(id, forceRefresh),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.product(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.productDetails(variables.id) });
        },
    });
}

export function useScrapeProductList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            categorySlug,
            page,
            limit,
            forceRefresh,
        }: {
            categorySlug: string;
            page?: number;
            limit?: number;
            forceRefresh?: boolean;
        }) => productApi.scrapeProductList(categorySlug, page, limit, forceRefresh),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

// Review Hooks
export function useReviews(productId: string) {
    return useQuery({
        queryKey: queryKeys.reviews(productId),
        queryFn: () => reviewApi.getByProductId(productId),
        enabled: !!productId,
    });
}

export function useProductRating(productId: string) {
    return useQuery({
        queryKey: [...queryKeys.reviews(productId), 'rating'],
        queryFn: () => reviewApi.getAverageRating(productId),
        enabled: !!productId,
    });
}

// Scrape Job Hooks
export function useScrapeJobs() {
    return useQuery({
        queryKey: queryKeys.scrapeJobs,
        queryFn: scrapeJobApi.getAll,
        refetchInterval: 5000, // Poll every 5 seconds
    });
}

// View History Hooks
export function useViewHistory(sessionId: string) {
    return useQuery({
        queryKey: queryKeys.viewHistory(sessionId),
        queryFn: () => viewHistoryApi.getBySessionId(sessionId),
        enabled: !!sessionId,
    });
}

export function useRecordView() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: viewHistoryApi.recordView,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.viewHistory(variables.sessionId) });
        },
    });
}
