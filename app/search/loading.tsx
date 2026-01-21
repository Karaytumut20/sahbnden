import React from 'react';

export default function SearchLoading() {
  return (
    <div className="flex gap-4 pt-4 animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="w-[240px] shrink-0 hidden md:block">
        <div className="bg-white border border-gray-200 h-[400px] rounded-sm p-4 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
               <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
          <div className="h-px bg-gray-200 my-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Ad Cards Skeleton */}
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
             <div key={i} className="bg-white border border-gray-200 p-2 flex gap-4 h-[120px] rounded-sm">
                <div className="w-[140px] bg-gray-200 h-full"></div>
                <div className="flex-1 py-2 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/4 mt-auto"></div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}