'use client';

import Link from 'next/link';
import {
  BookOpenIcon,
  SparklesIcon,
  TagIcon,
  TruckIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useNavigations, useCategories, useRecentProducts } from '@/lib/queries';
import { NavigationItem, CategoryCard } from '@/components/categories';
import { ProductCard } from '@/components/products';
import {
  Skeleton,
  NavigationCardSkeleton,
  CategoryGridSkeleton,
  ProductGridSkeleton
} from '@/components/ui';

const features = [
  {
    icon: <BookOpenIcon className="h-6 w-6" />,
    title: 'Millions of Books',
    description: 'Access our vast collection of new and used books from around the world.',
  },
  {
    icon: <TagIcon className="h-6 w-6" />,
    title: 'Best Prices',
    description: 'Find amazing deals with savings of up to 70% off retail prices.',
  },
  {
    icon: <SparklesIcon className="h-6 w-6" />,
    title: 'Quality Guaranteed',
    description: 'Every book is checked and graded for quality before shipping.',
  },
  {
    icon: <TruckIcon className="h-6 w-6" />,
    title: 'Fast Delivery',
    description: 'Quick and reliable shipping to get your books to you faster.',
  },
];

export default function HomePage() {
  const { data: navigations, isLoading: navLoading } = useNavigations();
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: recentProducts, isLoading: productsLoading } = useRecentProducts(8);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="block text-white">Discover Your Next</span>
              <span className="block gradient-text mt-2">Favorite Book</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Explore millions of books from around the world. From timeless classics to
              contemporary bestsellers, find your perfect read at unbeatable prices.
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="relative group">
                <input
                  type="search"
                  placeholder="Search for books, authors, or genres..."
                  className="w-full px-6 py-4 pl-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition group-hover:border-white/20"
                />
                <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Link
                  href="/products"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium text-white hover:from-purple-600 hover:to-pink-600 transition"
                >
                  Search
                </Link>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/categories"
                className="btn btn-primary px-8 py-4 text-lg glow-hover"
              >
                Browse Categories
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/products"
                className="btn btn-secondary px-8 py-4 text-lg"
              >
                View All Books
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Headings Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Browse by Section</h2>
              <p className="text-gray-400 mt-2">Explore our main navigation categories</p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {navLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <NavigationCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {navigations?.slice(0, 8).map((nav) => (
                <NavigationItem
                  key={nav.id}
                  title={nav.title}
                  slug={nav.slug}
                  description={`Explore ${nav.title.toLowerCase()}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Popular Categories</h2>
              <p className="text-gray-400 mt-2">Discover books across different genres</p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {catLoading ? (
            <CategoryGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.slice(0, 6).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Recently Added</h2>
              <p className="text-gray-400 mt-2">Fresh additions to our collection</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition"
            >
              View All
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {productsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Mobile View All Link */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-purple-400 hover:bg-white/10 transition"
            >
              View All Products
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900 to-pink-900 p-8 sm:p-12 lg:p-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Reading?
              </h2>
              <p className="text-lg text-purple-100 max-w-xl mx-auto mb-8">
                Join millions of book lovers who have discovered their perfect reads with us.
                Start browsing our vast collection today!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-white text-purple-900 font-semibold rounded-xl hover:bg-gray-100 transition"
                >
                  Start Browsing
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
