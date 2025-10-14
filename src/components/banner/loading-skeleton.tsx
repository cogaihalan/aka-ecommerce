"use client";

interface LoadingSkeletonProps {
    slideCount: number;
}

export const LoadingSkeleton = ({ slideCount }: LoadingSkeletonProps) => (
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/30" />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-7xl mx-auto w-full">
                <div className="space-y-6">
                    <div className="h-12 bg-white/20 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-8 bg-white/15 rounded-lg w-1/2 animate-pulse" />
                    <div className="h-6 bg-white/10 rounded-lg w-2/3 animate-pulse" />
                    <div className="flex gap-4">
                        <div className="h-12 bg-white/20 rounded-lg w-32 animate-pulse" />
                        <div className="h-12 bg-white/15 rounded-lg w-28 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: slideCount }, (_, index) => (
                <div
                    key={index}
                    className="w-3 h-3 rounded-full bg-white/20 animate-pulse"
                />
            ))}
        </div>
    </div>
);
