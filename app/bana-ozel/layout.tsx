
import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 py-6">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
