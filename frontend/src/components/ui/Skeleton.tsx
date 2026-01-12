import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg',
                className
            )}
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
            <Skeleton className="aspect-[3/4] w-full" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    );
}

export function CategoryCardSkeleton() {
    return (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}

export function NavigationCardSkeleton() {
    return (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <Skeleton className="h-12 w-12 rounded-xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
            ))}
        </div>
    );
}
