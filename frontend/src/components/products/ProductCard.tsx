'use client';

import Link from 'next/link';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import type { Product } from '@/types';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const discount = calculateDiscount(product.originalPrice || 0, product.price || 0);

    return (
        <Link
            href={`/products/${product.id}`}
            className={cn(
                'group block bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1',
                className
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-gray-600"
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

                {/* Discount Badge */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                    </div>
                )}

                {/* Condition Badge */}
                {product.condition && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        {product.condition}
                    </div>
                )}

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white font-bold px-4 py-2 rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                {/* Title */}
                <h3 className="font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {product.title}
                </h3>

                {/* Author */}
                {product.author && (
                    <p className="text-sm text-gray-400 line-clamp-1">
                        by {product.author}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 pt-2">
                    <span className="text-xl font-bold text-purple-400">
                        {formatPrice(product.price, product.currency)}
                    </span>
                    {product.originalPrice && product.originalPrice > (product.price || 0) && (
                        <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice, product.currency)}
                        </span>
                    )}
                </div>

                {/* Format */}
                {product.format && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-white/5 rounded">
                            {product.format}
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}

// Star Rating component
interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

export function StarRating({ rating, maxRating = 5, size = 'md', showValue = false }: StarRatingProps) {
    const sizeClasses = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxRating }).map((_, i) => (
                <span key={i}>
                    {i < Math.floor(rating) ? (
                        <StarIcon className={cn(sizeClasses[size], 'text-yellow-400')} />
                    ) : i < rating ? (
                        <StarIcon className={cn(sizeClasses[size], 'text-yellow-400/50')} />
                    ) : (
                        <StarOutlineIcon className={cn(sizeClasses[size], 'text-gray-500')} />
                    )}
                </span>
            ))}
            {showValue && (
                <span className="ml-1 text-sm text-gray-400">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
