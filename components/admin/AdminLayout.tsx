'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  Tag,
  Image,
  FolderOpen,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Brands', href: '/admin/brands', icon: Tag },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  // { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Banners', href: '/admin/banners', icon: Image },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Manual Orders', href: '/admin/manual-order', icon: Wrench} 
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, adminData } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/')
  };

  return (
    <div className="flex flex-1 bg-gray-50 dark:bg-gray-900 min-h-0">
      {/* --- Mobile sidebar overlay --- */}
      <div
        className={cn(
          "fixed inset-0 mt-32 z-40 flex lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        aria-modal="true"
        role="dialog"
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        {/* Drawer */}
        <div className="relative flex flex-col bg-white dark:bg-gray-800 w-full max-w-xs">
          <div className="top-0 right-0 absolute -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-300 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex items-center px-4 py-5">
            <Crown className="w-8 h-8 text-primary" />
            <span className="ml-2 font-bold text-xl">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-1 mt-2 px-2 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-4 w-6 h-6" />
                {item.name}
              </Link>
            ))}
          </nav>
          {/* User info on mobile */}
          <div className="flex items-center p-4 border-gray-200 dark:border-gray-700 border-t">
            <div className="flex-shrink-0">
              <div className="flex justify-center items-center bg-primary rounded-full w-8 h-8">
                <span className="font-medium text-primary-foreground text-sm">
                  {adminData?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                {adminData?.username || 'Admin'}
              </p>
              <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">
                {adminData?.email || 'admin@example.com'}
              </p>
            </div>
            {/* Optional logout button for mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="ml-auto"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {/* blank space to right of drawer */}
        <div className="flex-1" onClick={() => setSidebarOpen(false)} />
      </div>

      {/* --- Desktop sidebar --- */}
      <div className="hidden lg:flex lg:flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-r lg:w-64">
        <div className="flex flex-col flex-1 pt-5 pb-4 min-h-0 overflow-y-auto">
          <div className="flex items-center px-4">
        <Crown className="w-8 h-8 text-primary" />
        <span className="ml-2 font-bold text-xl truncate">Admin Panel</span>
          </div>
          <nav className="flex-1 space-y-1 mt-5 px-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
          "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
          pathname === item.href
            ? "bg-primary text-primary-foreground"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            )}
          >
            <item.icon className="flex-shrink-0 mr-3 w-5 h-5" />
            <span className="truncate">{item.name}</span>
          </Link>
        ))}
          </nav>
        </div>
        {/* User info and logout at bottom */}
        <div className="flex-shrink-0 p-4 border-gray-200 dark:border-gray-700 border-t">
          <div className="flex items-center min-w-0">
        <div className="flex-shrink-0">
          <div className="flex justify-center items-center bg-primary rounded-full w-8 h-8">
            <span className="font-medium text-primary-foreground text-sm">
          {adminData?.username?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
        </div>
        <div className="flex-1 ml-3 min-w-0">
          <p className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">
            {adminData?.username || 'Admin'}
          </p>
          <p className="font-medium text-gray-500 dark:text-gray-400 text-xs truncate">
            {adminData?.email || 'admin@example.com'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="ml-2"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </Button>
          </div>
        </div>
      </div>

      {/* --- Main content pane (always present) --- */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Mobile hamburger button */}
        <div className="lg:hidden top-0 z-10 sticky bg-gray-50 dark:bg-gray-900 pt-1 sm:pt-3 pl-1 sm:pl-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="-mt-0.5 -ml-0.5 w-12 h-12"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        <main className="flex-1 p-4 overflow-y-auto">
          {/* Main admin content */}
          {children}
        </main>
      </div>
    </div>
  );
}