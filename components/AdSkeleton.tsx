
import React from 'react';

export default function AdSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm h-full flex flex-col animate-pulse">
      <div className="aspect-[4/3] bg-gray-200 w-full"></div>
      <div className="p-2 space-y-2 flex-1">
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="pt-2 mt-auto">
           <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
           <div className="h-2 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
