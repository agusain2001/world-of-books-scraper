'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, FolderIcon } from '@heroicons/react/24/outline';
import { useCategory, useProducts, useScrapeProductList } from '@/lib/queries';
import { CategoryCard } from '@/components/categories';
import { ProductCard } from '@/components/products';
import { ProductGridSkeleton, CategoryGridSkeleton, Skeleton } from '@/components/ui';

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = use(params);
    const { data: category, isLoading: categoryLoading } = useCategory(slug);
    const { data: products, isLoading: productsLoading, refetch } = useProducts({
        categorySlug: slug,
        limit: 20,
    });
    const scrapeMutation = useScrapeProductList();

    const handleScrapeProducts = async () => {
        await scrapeMutation.mutateAsync({ categorySlug: slug, forceRefresh: true });
        refetch();
    };

    if (categoryLoading) {
        return (
            <div className="min-h-screen">
                <section className="py-16 bg-gradient-to-b from-purple-900/20 to-transparent">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Skeleton className="h-6 w-48 mb-4" />
                        <Skeleton className="h-10 w-64 mb-2" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                </section>
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <ProductGridSkeleton count={8} />
                    </div>
                </section>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Category Not Found</h1>
                    <p className="text-gray-400 mb-6">The category you're looking for doesn't exist.</p>
                    <Link
                        href="/categories"
                        className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
                    >
                        Browse All Categories
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent py-16">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <Link href="/categories" className="hover:text-white transition">Categories</Link>
                        <span>/</span>
                        <span className="text-white">{category.title}</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white">{category.title}</h1>
                            <p className="text-gray-400 mt-2">
                                {category.productCount > 0
                                    ? `${category.productCount.toLocaleString()} books available`
                                    : 'Browse books in this category'
                                }
                            </p>
                        </div>

                        <button
                            onClick={handleScrapeProducts}
                            disabled={scrapeMutation.isPending}
                            className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {scrapeMutation.isPending ? 'Scraping...' : 'Refresh Products'}
                        </button>
                    </div>
                </div>
            </section>

            {/* Subcategories */}
            {category.children && category.children.length > 0 && (
                <section className="py-12 border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Subcategories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {category.children.map((child) => (
                                <CategoryCard key={child.id} category={child} variant="compact" />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Products */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Books in {category.title}
                    </h2>

                    {productsLoading ? (
                        <ProductGridSkeleton count={8} />
                    ) : products && products.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    {products.hasPrevPage && (
                                        <Link
                                            href={`/categories/${slug}?page=${products.page - 1}`}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
                                        >
                                            Previous
                                        </Link>
                                    )}
                                    <span className="px-4 py-2 text-gray-400">
                                        Page {products.page} of {products.totalPages}
                                    </span>
                                    {products.hasNextPage && (
                                        <Link
                                            href={`/categories/${slug}?page=${products.page + 1}`}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <FolderIcon className="h-10 w-10 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                            <p className="text-gray-400 mb-6">
                                Products will appear here once data is scraped from World of Books.
                            </p>
                            <button
                                onClick={handleScrapeProducts}
                                disabled={scrapeMutation.isPending}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
                            >
                                {scrapeMutation.isPending ? 'Scraping...' : 'Scrape Products Now'}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
