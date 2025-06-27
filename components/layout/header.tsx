"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  Crown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { getEnhancedCart } from "@/lib/api/cart";
import { getSessionIdCookie } from "@/lib/cookies/session";
import Image from "next/image";

// Type definitions
interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
}

interface ApiResponse<T> {
  categories: T[];
  message: string;
  data: {
    brands: Brand[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
interface CartItemWithProduct {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  loading?: boolean;
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<number>(0); // Mock cart count
  const [isAdmin, setIsAdmin] = useState(false); // Mock admin state
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { logout } = useAdmin();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  // const sessionIdcookie = getSessionIdCookie();
  const [authed, setAuthed] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      const authedValue = localStorage.getItem("authed") === "true";
      setAuthed(authedValue);
      console.log("Auth checked:", authedValue);
    };

    const interval = setInterval(() => {
      checkAuth();
    }, 10000); // 30 seconds

    return () => clearInterval(interval);
  }, []);


  // Prevent hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories?limit=50`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const result: ApiResponse<Category> = await response.json();

      if (result) {
        setCategories(result.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to empty array or show error message
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch categories from API
  useEffect(() => {

    // Poll every 10 seconds for new categories
    const interval = setInterval(() => {
      fetchCategories(); // Refetch every 30 seconds
    }, 10000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount

  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);

        // Get cart items
        const cartResponse = await getEnhancedCart();
        const cartItems = cartResponse.data.cart.items;

        // Convert cart items to our interface
        const cartItemsWithProduct: CartItemWithProduct[] = cartItems.map(
          (item) => ({
            id: item.productId, // Using productId as ID for now
            productId: item.productId,
            quantity: item.quantity,
            price: Number(item.totalPrice),
            loading: true,
          })
        );

        setItems(cartItemsWithProduct);
        let count = 0;
        for (const item of cartItemsWithProduct) {
          count += item.quantity;
        }
        setCartItems(count);

        // Fetch product details for each item
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
    window.addEventListener("cartUpdated", fetchCartData);

    return () => {
      window.removeEventListener("cartUpdated", fetchCartData);
    };
  }, [toast]);
  const fetchBrands = async () => {
    try {
      setIsLoadingBrands(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/brands?limit=50`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }

      const result: ApiResponse<Brand> = await response.json();

      if (result) {
        console.log(result);
        setBrands(result.data.brands || []);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      // Fallback to empty array or show error message
      setBrands([]);
    } finally {
      setIsLoadingBrands(false);
    }
  };


  // Fetch brands from API
  useEffect(() => {


    // Poll every 10 seconds for new categories
    const interval = setInterval(() => {
      fetchBrands();
    }, 10000); // 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleAdmin = () => {
    setAuthed(false);
    logout();

    router.push("/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "glass-effect shadow-lg border-b"
          : "bg-white/95 dark:bg-gray-900/95"
      )}>
      <div className="mx-auto px-4 container">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center bg-white rounded-full w-12 h-12">
              <Image
                src="/logo.png"
                width={25}
                height={25}
                alt="Korean Skincare Shop BD Logo"
                className="pt-1 w-12 h-8"
              />
            </motion.div>
            <span className="hidden lg:inline-block font-bold text-xl lg:text-2xl golden-text">
              KOREAN SKINCARE SHOP BD
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex justify-center items-center bg-background data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 hover:bg-accent focus:bg-accent disabled:opacity-50 px-4 py-2 rounded-md focus:outline-none w-max h-10 font-medium text-sm transition-colors hover:text-accent-foreground focus:text-accent-foreground disabled:pointer-events-none">
                    Products
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="gap-3 grid md:grid-cols-2 p-4 w-[400px] md:w-[500px] lg:w-[600px]">
                    { categories.length > 0 ? (
                      categories.map((category) => (
                        <NavigationMenuLink key={category.id} asChild>
                          <Link
                            href={`/products?category=${category.id}`}
                            className="block space-y-1 hover:bg-accent focus:bg-accent p-3 rounded-md outline-none no-underline leading-none transition-colors hover:text-accent-foreground focus:text-accent-foreground select-none">
                            <div className="font-medium text-sm leading-none">
                              {category.name}
                            </div>
                            {category.description && (
                              <p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
                                {category.description}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      ))
                    ) : (
                      <div className="col-span-2 py-4 text-muted-foreground text-sm text-center">
                        No categories available
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Brands</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="gap-3 grid md:grid-cols-2 p-4 w-[400px] md:w-[500px] lg:w-[600px]">
                    { brands.length > 0 ? (
                      brands.map((brand) => (
                        <NavigationMenuLink key={brand.id} asChild>
                          <Link
                            href={`/products?brand=${brand.id}`}
                            className="block space-y-1 hover:bg-accent focus:bg-accent p-3 rounded-md outline-none no-underline leading-none transition-colors hover:text-accent-foreground focus:text-accent-foreground select-none">
                            <div className="flex items-center space-x-2">
                              {" "}
                              {brand.logo && (
                                <Image
                                  src={brand.logo}
                                  alt={brand.name}
                                  width={24}
                                  height={24}
                                  className="rounded w-6 h-6 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                              <div className="font-medium text-sm leading-none">
                                {brand.name}
                              </div>
                            </div>
                            {brand.description && (
                              <p className="text-muted-foreground text-sm line-clamp-2 leading-snug">
                                {brand.description}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      ))
                    ) : (
                      <div className="col-span-2 py-4 text-muted-foreground text-sm text-center">
                        No brands available
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex md:flex-1 md:mx-8 md:max-w-sm">
            <div className="relative w-full">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-4 pl-10 w-full"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {" "}
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden sm:inline-flex">
                <Sun className="w-5 h-5 rotate-0 dark:-rotate-90 scale-100 dark:scale-0 transition-all" />
                <Moon className="absolute w-5 h-5 rotate-90 dark:rotate-0 scale-0 dark:scale-100 transition-all" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="group relative hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary/70 transition-shadow"
              aria-label="View cart">
              <Link href="/cart" className="flex justify-center items-center">
                <span className="relative flex items-center">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  {cartItems > 0 && (
                    <span
                      className="-top-2 -right-2 absolute flex justify-center items-center bg-gradient-to-tr from-primary to-yellow-400 shadow-md border-2 border-background rounded-full w-5 h-5 font-semibold text-white text-xs"
                      aria-label={`${cartItems} items in cart`}>
                      {cartItems}
                    </span>
                  )}
                </span>
              </Link>
            </Button>
            {/* Admin/User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {authed && (
                    <DropdownMenuItem onClick={toggleAdmin}>
                      <LogOut className="mr-2 w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  )}
                </>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pt-4 pb-4 border-t">
          <form onSubmit={handleSearch} className="relative">
            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-4 pl-10"
            />
          </form>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t">
            <div className="mx-auto px-4 py-4 container">
              <nav className="space-y-4">
                <Link
                  href="/products"
                  className="block py-2 font-medium hover:text-primary text-lg">
                  Products
                </Link>
                <div>
                  <h3 className="py-2 font-medium text-lg">Categories</h3>
                  <div className="space-y-2 pl-4">
                    { categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.id}`}
                          className="block py-1 text-muted-foreground hover:text-primary"
                          onClick={() => setIsOpen(false)}>
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <span className="block py-1 text-muted-foreground text-sm">
                        No categories available
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="py-2 font-medium text-lg">Brands</h3>
                  <div className="space-y-2 pl-4">
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/products?brand=${brand.id}`}
                          className="flex items-center py-1 text-muted-foreground hover:text-primary"
                          onClick={() => setIsOpen(false)}>
                          {" "}
                          {brand.logo && (
                            <Image
                              src={brand.logo}
                              alt={brand.name}
                              width={16}
                              height={16}
                              className="mr-2 rounded w-4 h-4 object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                          {brand.name}
                        </Link>
                      ))
                    ) : (
                      <span className="block py-1 text-muted-foreground text-sm">
                        No brands available
                      </span>
                    )}
                  </div>
                </div>{" "}
                <div className="pt-4 border-t">
                  {mounted && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className="justify-start w-full">
                      {theme === "dark" ? (
                        <>
                          <Sun className="mr-2 w-4 h-4" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="mr-2 w-4 h-4" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
