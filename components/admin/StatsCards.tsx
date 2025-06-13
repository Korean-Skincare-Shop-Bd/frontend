"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminStats, AdminStats } from '@/lib/api/admin';
import { useAdmin } from '@/contexts/AdminContext';

export function StatsCards() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAdmin();

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const data = await getAdminStats(token);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const statsConfig = [
    {
      title: 'Total Revenue',
      value: stats ? `$${stats.totalRevenue?.toLocaleString()}` : '$0',
      change: stats?.revenueChange || '0%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: stats ? stats.totalOrders?.toLocaleString() : '0',
      change: stats?.ordersChange || '0%',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Total Products',
      value: stats ? stats.totalProducts?.toLocaleString() : '0',
      change: stats?.productsChange || '0%',
      icon: Package,
      color: 'text-purple-600'
    },
    {
      title: 'Total Customers',
      value: stats ? stats.totalCustomers?.toLocaleString() : '0',
      change: stats?.customersChange || '0%',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <div className="bg-gray-200 rounded w-24 h-4"></div>
              <div className="bg-gray-200 rounded w-4 h-4"></div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 mb-2 rounded w-20 h-8"></div>
              <div className="bg-gray-200 rounded w-16 h-3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {statsConfig.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{stat.value}</div>
              <p className="text-muted-foreground text-xs">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}