"use client";

import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus, 
  FolderOpen, 
  Tag, 
  Image, 
  Settings,
  FileText,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      label: 'Add Product',
      icon: Plus,
      onClick: () => router.push('/admin/products/create'),
      variant: 'default' as const,
    },
    {
      label: 'Manage Products',
      icon: Package,
      onClick: () => router.push('/admin/products'),
      variant: 'ghost' as const,
    },
    {
      label: 'Categories',
      icon: FolderOpen,
      onClick: () => router.push('/admin/categories'),
      variant: 'ghost' as const,
    },
    {
      label: 'Brands',
      icon: Tag,
      onClick: () => router.push('/admin/brands'),
      variant: 'ghost' as const,
    },
    {
      label: 'View Orders',
      icon: ShoppingCart,
      onClick: () => router.push('/admin/orders'),
      variant: 'ghost' as const,
    },
    {
      label: 'Customer Management',
      icon: Users,
      onClick: () => router.push('/admin/customers'),
      variant: 'ghost' as const,
    },
    {
      label: 'Banners',
      icon: Image,
      onClick: () => router.push('/admin/banners'),
      variant: 'ghost' as const,
    },
    {
      label: 'Dashboard',
      icon: BarChart3,
      onClick: () => router.push('/admin'),
      variant: 'ghost' as const,
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => router.push('/admin/settings'),
      variant: 'ghost' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              className="justify-start w-full"
              variant={action.variant}
              onClick={action.onClick}
            >
              <action.icon className="mr-2 w-4 h-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}