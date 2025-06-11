"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Heart,
  HelpCircle,
  Home,
  ListOrdered,
  LogOut,
  Menu,
  Store,
  Text,
  User,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Loader from "../others/Loader";

// Define the Category type
interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string;
}

const MobileHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/catagories?page=1&limit=20');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/search?query=${encodeURIComponent(categoryName)}`);
  };

  const userLinks = [
    {
      link: "/my-account",
      label: "My Account",
      icon: <User />,
      isActive: pathname.includes("/my-account"),
    },
    {
      link: "/wishlist",
      label: "Wishlist",
      icon: <Heart />,
      isActive: pathname.includes("/wishlist"),
    },
    {
      link: "/my-orders",
      label: "My Orders",
      icon: <ListOrdered />,
      isActive: pathname.includes("/my-orders"),
    },
    {
      link: "/help",
      label: "Help",
      icon: <HelpCircle />,
      isActive: pathname.includes("/help"),
    },
  ];

  

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <Menu className="mt-2" size={25} />
        </SheetTrigger>
        <SheetContent className="bg-amber-50 dark:bg-slate-900 border-amber-200 dark:border-slate-800">
          <SheetHeader>
            <SheetDescription>
              <ul className="space-y-1 p-2 text-amber-900 dark:text-amber-100 text-lg text-start">
                

                {/* Categories Dropdown (custom implementation) */}
                <div className="w-full">
                  <button 
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className="flex justify-between items-center hover:bg-amber-200 dark:hover:bg-slate-800 p-2 rounded-md w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Store />
                      Categories
                    </div>
                    {categoriesOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  
                  {/* Categories content */}
                  {categoriesOpen && (
                    <div className="space-y-1 mt-1 pl-4">
                      {isLoading ? (
                        <div className="flex justify-center p-2">
                          <Loader />
                        </div>
                      ) : (
                        categories.map((category) => (
                          <div
                            key={category.id}
                            className="hover:bg-amber-100 dark:hover:bg-slate-700 p-2 rounded-md cursor-pointer"
                            onClick={() => handleCategoryClick(category.name)}
                          >
                            {category.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <Separator className="bg-amber-200 dark:bg-slate-800 !my-2" />
                
                {/* theme toggle option here */}
                <div className="flex items-center gap-2 p-2">
                  <ThemeToggle />
                  <p>Change Theme</p>
                </div>
                
                <Separator className="bg-amber-200 dark:bg-slate-800 !my-2" />

                {/* user related options here */}
                {userLinks.map((link) => (
                  <Link
                    key={link.link}
                    href={link.link}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-md hover:bg-amber-200 dark:hover:bg-slate-800",
                      link.isActive && "bg-amber-200 dark:bg-slate-800"
                    )}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
                
                {/* Admin Login */}
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 hover:bg-amber-200 dark:hover:bg-slate-800 p-2 rounded-md"
                >
                  <User /> Admin Login
                </Link>
                
                <Separator className="bg-amber-200 dark:bg-slate-800 !my-2" />
                
                <button className="flex justify-start items-start gap-2 bg-transparent hover:opacity-50 p-2 text-amber-900 dark:text-amber-100">
                  <LogOut />
                  Logout
                </button>
              </ul>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileHeader;