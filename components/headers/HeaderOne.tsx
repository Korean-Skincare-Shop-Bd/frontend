"use client";
import React, { Suspense, useEffect, useState } from "react";
import Logo from "../logo/Logo";
import Link from "next/link";
import SearchBox from "./SearchBox";
import Cart from "../carts/Cart";
import { ThemeToggle } from "../theme/ThemeToggle";
import AccountPopover from "../account/AccountPopover";
import { Search, ChevronDown } from "lucide-react";
import MobileHeader from "./MobileHeader";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMobileSearchModal } from "@/store/mobileSearchStore";
import Loader from "../others/Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Define the Category type
interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string;
}
interface Brand{
  id:string;
  name:string;
  logo:string;
  description:string;
}

const HeaderOne = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([])

  const { openModal } = useMobileSearchModal();

   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/categories?page=1&limit=20');
        const data = await response.json();
        const response1 = await fetch('http://localhost:8000/api/v1/brands?page=1&limit=20');
        const data1 = await response1.json();
        console.log(data1)
        console.log(data)
        if (data.success) {
          setCategories(data.data);
        }
        if(data1.success){
          setBrands(data1.data)
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

  return (
    <header className="top-0 z-50 sticky bg-amber-50 dark:bg-slate-900 border-amber-200 dark:border-slate-800 border-b w-full">
      <div className="flex justify-between items-center gap-2 mx-auto p-4 md:px-8 md:py-4 max-w-screen-xl">
        <Logo />
        <ul className="hidden lg:flex items-center gap-4 xl:gap-6 text-lg">
          
          
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:bg-amber-200 dark:hover:bg-slate-800 px-4 py-1 rounded-full font-medium">
              Categories <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800">
              {isLoading ? (
                <div className="flex justify-center p-2">
                  <Loader />
                </div>
              ) : (
                categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    className="hover:bg-amber-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:bg-amber-200 dark:hover:bg-slate-800 px-4 py-1 rounded-full font-medium">
              Brands <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800">
              {isLoading ? (
                <div className="flex justify-center p-2">
                  <Loader />
                </div>
              ) : (
                brands.map((brand) => (
                  <DropdownMenuItem
                    key={brand.id}
                    className="hover:bg-amber-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={() => handleCategoryClick(brand.name)}
                  >
                    {brand.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </ul>
        
        <div className="flex items-center gap-6">
          {/* mobile search option */}
          <div className="lg:hidden text-center">
            <Search size={25} onClick={openModal} />
          </div>
          {/* desktop search */}
          <div className="hidden lg:block">
            <Suspense fallback={<p>Loading...</p>}>
              <SearchBox />
            </Suspense>
          </div>
          <div className="flex items-center gap-6 lg:gap-2 lg:-mt-1">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <AccountPopover />
            <Cart />
            
            {/* Admin Login */}
            <Link 
              href="/admin/login" 
              className="hidden lg:block ml-3 font-medium text-amber-800 dark:text-amber-400 hover:underline"
            >
              Admin
            </Link>
            
            <MobileHeader />
          </div>
        </div>
      </div>
      <Separator className="bg-amber-200 dark:bg-slate-800" />
    </header>
  );
};

export default HeaderOne;