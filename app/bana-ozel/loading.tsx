import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
       <div className="bg-white border border-gray-200 p-6 rounded-sm h-[200px]">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-4 gap-4">
             {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
          </div>
       </div>
       <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-sm h-[300px]"></div>
          <div className="bg-white border border-gray-200 p-6 rounded-sm h-[300px]"></div>
       </div>
    </div>
  );
}