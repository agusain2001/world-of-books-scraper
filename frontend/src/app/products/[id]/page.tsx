'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    ShoppingCartIcon,
    HeartIcon,
    ShareIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import {
    useProduct,
    useProductDetails,
    useProductRelated,
    useReviews,
    useScrapeProductDetail
} from '@/lib/queries';
import { ProductCard, StarRating } from '@/components/products';
import { ProductDetailSkeleton, ProductGridSkeleton, Skeleton } from '@/components/ui';
import { formatPrice, formatDate, calculateDiscount } from '@/lib/utils';

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const { id } = use(params);
    const { data: product, isLoading: productLoading } = useProduct(id);
    const { data: details, isLoading: detailsLoading } = useProductDetails(id);
    const { data: relatedProducts, isLoading: relatedLoading } = useProductRelated(id, 4);
    const { data: reviews, isLoading: reviewsLoading } = useReviews(id);
    const scrapeMutation = useScrapeProductDetail();

    const handleScrape = async () => {
        await scrapeMutation.mutateAsync({ id, forceRefresh: true });
    };

    if (productLoading) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ProductDetailSkeleton />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
                    <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
                    <Link
                        href="/products"
                        className="px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
                    >
                        Browse All Products
                    </Link>
                </div>
            </div>
        );
    }

    const discount = calculateDiscount(product.originalPrice || 0, product.price || 0);

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-gradient-to-b from-purple-900/20 to-transparent py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <Link href="/products" className="hover:text-white transition">Products</Link>
                        <span>/</span>
                        <span className="text-white line-clamp-1">{product.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Image */}
                        <div className="relative">
                            <div className="aspect-[3/4] relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
                                {product.imageUrl ? (
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            className="w-24 h-24 text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                )}

                                {/* Badges */}
                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {discount > 0 && (
                                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                            -{discount}% OFF
                                        </div>
                                    )}
                                    {product.condition && (
                                        <div className="bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                                            {product.condition}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            {/* Title & Author */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    {product.title}
                                </h1>
                                {product.author && (
                                    <p className="text-xl text-gray-400">by {product.author}</p>
                                )}
                            </div>

                            {/* Rating */}
                            {details?.ratingsAvg && (
                                <div className="flex items-center gap-3">
                                    <StarRating rating={details.ratingsAvg} showValue size="lg" />
                                    {details.reviewsCount && (
                                        <span className="text-gray-400">
                                            ({details.reviewsCount} reviews)
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-purple-400">
                                    {formatPrice(product.price, product.currency)}
                                </span>
                                {product.originalPrice && product.originalPrice > (product.price || 0) && (
                                    <span className="text-xl text-gray-500 line-through">
                                        {formatPrice(product.originalPrice, product.currency)}
                                    </span>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="flex items-center gap-2">
                                {product.inStock ? (
                                    <>
                                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                        <span className="text-green-400">In Stock</span>
                                    </>
                                ) : (
                                    <>
                                        <XCircleIcon className="h-5 w-5 text-red-400" />
                                        <span className="text-red-400">Out of Stock</span>
                                    </>
                                )}
                            </div>

                            {/* Format & Condition */}
                            <div className="flex flex-wrap gap-3">
                                {product.format && (
                                    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
                                        📚 {product.format}
                                    </span>
                                )}
                                {product.condition && (
                                    <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white">
                                        ✨ {product.condition}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href={product.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                                >
                                    <ShoppingCartIcon className="h-5 w-5" />
                                    Buy on World of Books
                                </a>
                                <button
                                    onClick={handleScrape}
                                    disabled={scrapeMutation.isPending}
                                    className="px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition disabled:opacity-50"
                                    title="Refresh product details"
                                >
                                    <ArrowPathIcon className={`h-5 w-5 ${scrapeMutation.isPending ? 'animate-spin' : ''}`} />
                                </button>
                                <button className="px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">
                                    <HeartIcon className="h-5 w-5" />
                                </button>
                                <button className="px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition">
                                    <ShareIcon className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Product Specs */}
                            {details && (
                                <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                    {details.isbn && (
                                        <div>
                                            <span className="text-gray-500 text-sm">ISBN</span>
                                            <p className="text-white">{details.isbn}</p>
                                        </div>
                                    )}
                                    {details.isbn13 && (
                                        <div>
                                            <span className="text-gray-500 text-sm">ISBN-13</span>
                                            <p className="text-white">{details.isbn13}</p>
                                        </div>
                                    )}
                                    {details.publisher && (
                                        <div>
                                            <span className="text-gray-500 text-sm">Publisher</span>
                                            <p className="text-white">{details.publisher}</p>
                                        </div>
                                    )}
                                    {details.publicationDate && (
                                        <div>
                                            <span className="text-gray-500 text-sm">Published</span>
                                            <p className="text-white">{formatDate(details.publicationDate)}</p>
                                        </div>
                                    )}
                                    {details.pages && (
                                        <div>
                                            <span className="text-gray-500 text-sm">Pages</span>
                                            <p className="text-white">{details.pages}</p>
                                        </div>
                                    )}
                                    {details.language && (
                                        <div>
                                            <span className="text-gray-500 text-sm">Language</span>
                                            <p className="text-white">{details.language}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {details?.description && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                    {details.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    {reviews && reviews.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Reviews ({reviews.length})
                            </h2>
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="p-6 bg-white/5 rounded-xl border border-white/10"
                                    >
                                        <div className="flex items-center gap-4 mb-3">
                                            {review.rating && (
                                                <StarRating rating={review.rating} size="sm" />
                                            )}
                                            {review.author && (
                                                <span className="text-white font-medium">{review.author}</span>
                                            )}
                                            {review.reviewDate && (
                                                <span className="text-gray-500 text-sm">
                                                    {formatDate(review.reviewDate)}
                                                </span>
                                            )}
                                            {review.verified && (
                                                <span className="text-green-400 text-xs px-2 py-0.5 bg-green-500/20 rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        {review.title && (
                                            <h4 className="text-white font-semibold mb-2">{review.title}</h4>
                                        )}
                                        {review.text && (
                                            <p className="text-gray-400">{review.text}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Products */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-white mb-6">You May Also Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
