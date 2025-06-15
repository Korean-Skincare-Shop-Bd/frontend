"use client";

import { TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCards } from './StatsCards';
import { RecentOrders } from './RecentOrders';
import { TopProducts } from './TopProducts';
import { QuickActions } from './QuickActions';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto px-4 py-8 container">
        {/* Header */}
        <div className="flex md:flex-row flex-col md:justify-between md:items-center mb-8">
          <div>
            <h1 className="mb-2 font-bold text-3xl">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Button onClick={() => router.push('/admin/products/create')}>
              <Plus className="mr-2 w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <StatsCards /> */}

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TopProducts />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}