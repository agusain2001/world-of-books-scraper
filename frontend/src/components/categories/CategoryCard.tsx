'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FolderIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
    category: Category;
    className?: string;
    variant?: 'default' | 'compact';
}

export function CategoryCard({ category, className, variant = 'default' }: CategoryCardProps) {
    if (variant === 'compact') {
        return (
            <Link
                href={`/categories/${category.slug}`}
                className={cn(
                    'group flex items-center gap-3 p-3 bg-white/5 backdrop-blur border border-white/10 rounded-xl transition-all duration-300 hover:border-purple-500/50 hover:bg-white/10',
                    className
                )}
            >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <FolderIcon className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate group-hover:text-purple-300 transition-colors">
                        {category.title}
                    </h3>
                    {category.productCount > 0 && (
                        <p className="text-xs text-gray-500">
                            {category.productCount.toLocaleString()} books
                        </p>
                    )}
                </div>
                <ChevronRightIcon className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
            </Link>
        );
    }

    return (
        <Link
            href={`/categories/${category.slug}`}
            className={cn(
                'group block bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1',
                className
            )}
        >
            {/* Image Container */}
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                {category.imageUrl ? (
                    <Image
                        src={category.imageUrl}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                        <FolderIcon className="w-16 h-16 text-purple-400/50" />
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Title on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors">
                        {category.title}
                    </h3>
                    {category.productCount > 0 && (
                        <p className="text-sm text-gray-300 mt-1">
                            {category.productCount.toLocaleString()} books available
                        </p>
                    )}
                </div>
            </div>

            {/* Subcategories Preview */}
            {category.children && category.children.length > 0 && (
                <div className="p-4 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                        {category.children.slice(0, 3).map((child) => (
                            <span
                                key={child.id}
                                className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-full"
                            >
                                {child.title}
                            </span>
                        ))}
                        {category.children.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                                +{category.children.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
            )}
        </Link>
    );
}

// Navigation item for the landing page
interface NavigationItemProps {
    title: string;
    slug: string;
    icon?: React.ReactNode;
    description?: string;
    className?: string;
}

export function NavigationItem({ title, slug, icon, description, className }: NavigationItemProps) {
    return (
        <Link
            href={`/categories?nav=${slug}`}
            className={cn(
                'group block p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1',
                className
            )}
        >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                {icon || <FolderIcon className="h-7 w-7 text-purple-400" />}
            </div>
            <h3 className="font-semibold text-lg text-white group-hover:text-purple-300 transition-colors">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-gray-400 mt-1">
                    {description}
                </p>
            )}
            <div className="flex items-center gap-1 mt-3 text-sm text-purple-400 group-hover:text-purple-300">
                <span>Browse</span>
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}
