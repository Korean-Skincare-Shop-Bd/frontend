import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { AdminProvider } from '@/contexts/AdminContext';
import { getCategories } from "@/lib/api/categories";
export const dynamic = 'force-dynamic';
const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: "KOREAN SKINCARE SHOP",
  description:
    "Discover premium beauty products with our curated collection of skincare, makeup, and wellness items.",
  keywords: [
    "beauty",
    "skincare",
    "makeup",
    "cosmetics",
    "premium",
    "KOREAN SKINCARE SHOP BD",
  ],
  icons: {
    icon: "/logo1.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  const { categories } = await getCategories(1, 5);
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        {" "}
        <ThemeProvider>
          <AdminProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer/>
            </div>
            <Toaster />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
