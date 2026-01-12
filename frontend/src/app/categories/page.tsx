'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useCategoryTree, useScrapeCategories } from '@/lib/queries';
import { CategoryCard } from '@/components/categories';
import { CategoryGridSkeleton } from '@/components/ui';

function CategoriesContent() {
    const searchParams = useSearchParams();
    const navigationFilter = searchParams.get('nav');

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { data: categories, isLoading, refetch } = useCategoryTree();
    const scrapeMutation = useScrapeCategories();

    const handleScrape = async () => {
        await scrapeMutation.mutateAsync({ forceRefresh: true });
        refetch();
    };

    // Filter categories by navigation if specified
    const filteredCategories = categories?.filter(cat => {
        if (!navigationFilter) return true;
        return cat.navigationId === navigationFilter || true; // TODO: proper filtering
    });

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent py-16">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <span className="text-white">Categories</span>
                    </nav>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white">Book Categories</h1>
                            <p className="text-gray-400 mt-2">
                                Browse our extensive collection by category
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Scrape Button */}
                            <button
                                onClick={handleScrape}
                                disabled={scrapeMutation.isPending}
                                className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {scrapeMutation.isPending ? 'Scraping...' : 'Refresh Data'}
                            </button>

                            {/* View Toggle */}
                            <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <Squares2X2Icon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    <ListBulletIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <CategoryGridSkeleton count={9} />
                    ) : filteredCategories && filteredCategories.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCategories.map((category) => (
                                    <CategoryCard key={category.id} category={category} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredCategories.map((category) => (
                                    <CategoryCard key={category.id} category={category} variant="compact" />
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <FunnelIcon className="h-10 w-10 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No categories found</h3>
                            <p className="text-gray-400 mb-6">
                                Categories will appear here once data is scraped from World of Books.
                            </p>
                            <button
                                onClick={handleScrape}
                                disabled={scrapeMutation.isPending}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition disabled:opacity-50"
                            >
                                {scrapeMutation.isPending ? 'Scraping...' : 'Scrape Categories Now'}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function CategoriesPage() {
    return (
        <Suspense fallback={<CategoryGridSkeleton count={9} />}>
            <CategoriesContent />
        </Suspense>
    );
}
