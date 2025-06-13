"use client";

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminLogin } from './AdminLogin';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, loading } = useAdmin();
  console.log()
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       router.push('/admin/login');
//     }
//   }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center space-x-2">
          <div className="border-4 border-primary border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}