'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { useProducts } from '@/lib/queries';
import { ProductCard } from '@/components/products';
import { ProductGridSkeleton } from '@/components/ui';
import type { ProductQueryParams } from '@/types';

const sortOptions = [
    { value: 'createdAt-DESC', label: 'Newest First' },
    { value: 'createdAt-ASC', label: 'Oldest First' },
    { value: 'price-ASC', label: 'Price: Low to High' },
    { value: 'price-DESC', label: 'Price: High to Low' },
    { value: 'title-ASC', label: 'Title: A to Z' },
    { value: 'title-DESC', label: 'Title: Z to A' },
];

const conditionOptions = ['Like New', 'Very Good', 'Good', 'Acceptable'];
const formatOptions = ['Paperback', 'Hardback', 'Audio CD', 'DVD'];

function ProductsContent() {
    const searchParams = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt-DESC');
    const [condition, setCondition] = useState(searchParams.get('condition') || '');
    const [format, setFormat] = useState(searchParams.get('format') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const [sortBy, sortOrder] = sort.split('-') as [ProductQueryParams['sortBy'], ProductQueryParams['sortOrder']];

    const page = parseInt(searchParams.get('page') || '1');

    const queryParams: ProductQueryParams = {
        page,
        limit: 20,
        search: search || undefined,
        sortBy,
        sortOrder,
        condition: condition || undefined,
        format: format || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };

    const { data: products, isLoading } = useProducts(queryParams);

    const clearFilters = () => {
        setSearch('');
        setCondition('');
        setFormat('');
        setMinPrice('');
        setMaxPrice('');
        setSort('createdAt-DESC');
    };

    const hasActiveFilters = search || condition || format || minPrice || maxPrice;

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="relative overflow-hidden bg-gradient-to-b from-purple-900/20 to-transparent py-16">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <span className="text-white">Products</span>
                    </nav>

                    <h1 className="text-4xl font-bold text-white">All Books</h1>
                    <p className="text-gray-400 mt-2">
                        {products?.total
                            ? `Showing ${products.data.length} of ${products.total.toLocaleString()} books`
                            : 'Browse our complete collection'
                        }
                    </p>
                </div>
            </section>

            {/* Search and Filters */}
            <section className="py-6 border-b border-white/5 sticky top-16 z-40 bg-slate-950/95 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <input
                                type="search"
                                placeholder="Search books..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="appearance-none px-4 py-3 pr-10 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition cursor-pointer"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-slate-900">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition ${showFilters || hasActiveFilters
                                ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                                }`}
                        >
                            <FunnelIcon className="h-5 w-5" />
                            <span>Filters</span>
                            {hasActiveFilters && (
                                <span className="w-2 h-2 rounded-full bg-purple-400" />
                            )}
                        </button>
                    </div>

                    {/* Extended Filters */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex flex-wrap gap-4">
                                {/* Condition */}
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm text-gray-400 mb-2">Condition</label>
                                    <select
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="" className="bg-slate-900">All Conditions</option>
                                        {conditionOptions.map((opt) => (
                                            <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Format */}
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm text-gray-400 mb-2">Format</label>
                                    <select
                                        value={format}
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="" className="bg-slate-900">All Formats</option>
                                        {formatOptions.map((opt) => (
                                            <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm text-gray-400 mb-2">Price Range</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <div className="mt-4 flex items-center gap-2">
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-400 hover:text-red-300 transition"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <ProductGridSkeleton count={20} />
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
                                            href={`/products?page=${products.page - 1}`}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
                                        >
                                            Previous
                                        </Link>
                                    )}

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, products.totalPages) }).map((_, i) => {
                                            const pageNum = products.page <= 3
                                                ? i + 1
                                                : products.page + i - 2;
                                            if (pageNum > products.totalPages || pageNum < 1) return null;
                                            return (
                                                <Link
                                                    key={pageNum}
                                                    href={`/products?page=${pageNum}`}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${pageNum === products.page
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {products.hasNextPage && (
                                        <Link
                                            href={`/products?page=${products.page + 1}`}
                                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition"
                                        >
                                            Next
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <MagnifyingGlassIcon className="h-10 w-10 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                            <p className="text-gray-400 mb-6">
                                {hasActiveFilters
                                    ? 'Try adjusting your filters or search terms.'
                                    : 'Products will appear here once data is scraped from World of Books.'
                                }
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:from-purple-600 hover:to-pink-600 transition"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductGridSkeleton count={20} />}>
            <ProductsContent />
        </Suspense>
    );
}
