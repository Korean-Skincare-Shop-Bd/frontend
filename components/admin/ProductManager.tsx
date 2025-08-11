"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Globe,
  EyeOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getProducts, Product, deleteProduct } from "@/lib/api/products";
import { useAdmin } from "@/contexts/AdminContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

const ITEMS_PER_PAGE = 20;

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [publishingProductId, setPublishingProductId] = useState<string | null>(
    null
  );
  const { token } = useAdmin();
  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        ...(searchQuery && { search: searchQuery }),
      };
      // Use regular function to get all products
      const response = await getProducts(params);
      setProducts(response.products);
      setTotalProducts(response.total);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [token, currentPage, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async () => {
    if (!productToDelete || !token) return;

    try {
      await deleteProduct(token, productToDelete.id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 container">
        <div className="space-y-4 animate-pulse">
          <div className="bg-gray-200 rounded w-1/4 h-8"></div>
          <div className="bg-gray-200 rounded h-10"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded h-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-4 mb-8">
        <div className="flex-1">
          <h1 className="mb-2 font-bold text-2xl sm:text-3xl">
            Products Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your product catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/admin/products/create")}
            className="w-full md:w-auto">
            <Plus className="mr-2 w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-4">
            <CardTitle className="text-lg sm:text-xl">
              All Products ({totalProducts})
            </CardTitle>
            <div className="flex sm:flex-row flex-col gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                <span className="sm:hidden ml-2">Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card View */} 
          <div className="lg:hidden block">
            <div className="p-4 space-y-4">
              {filteredProducts?.map((product) => (
                <div key={product.id} className="p-4 border border-border rounded-lg bg-card">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="flex flex-1 items-center gap-3 min-w-0">
                      <div className="flex-shrink-0 bg-gray-100 rounded-lg w-10 h-10 overflow-hidden">
                        {product.baseImageUrl ? (
                          <Image
                            src={product.baseImageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex justify-center items-center bg-gray-200 w-full h-full text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-2 leading-tight">
                          {product.name}
                        </div>
                        <div className="text-muted-foreground text-xs mt-1">
                          {product.variations?.length || 0} variations
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/products/${product.id}`)
                          }>
                          <Eye className="mr-2 w-4 h-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/products/${product.id}/edit`)
                          }>
                          <Edit className="mr-2 w-4 h-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setProductToDelete(product);
                            setDeleteDialogOpen(true);
                          }}>
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs font-medium">Category:</span>
                      <div className="font-medium text-xs truncate max-w-[120px]">
                        {product.category?.name || "Uncategorized"}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs font-medium">Brand:</span>
                      <div className="font-medium text-xs truncate max-w-[120px]">
                        {product.brand?.name || "No Brand"}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs font-medium">Price:</span>
                      <div className="font-medium text-xs">
                        {product.variations && product.variations.length > 0 ? (
                          <span className="truncate">
                            ৳{Math.min(...product.variations.map((v) => v.price)).toFixed(0)}
                            {Math.min(...product.variations.map((v) => v.price)) !== Math.max(...product.variations.map((v) => v.price)) && 
                              ` - ৳${Math.max(...product.variations.map((v) => v.price)).toFixed(0)}`
                            }
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs font-medium">Stock:</span>
                      <div className="font-medium text-xs">
                        {product.variations?.reduce(
                          (sum, v) => sum + v.stockQuantity,
                          0
                        ) || 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
                    <Badge
                      variant={product.isPublished ? "default" : "secondary"}
                      className="text-xs">
                      {product.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              ))}

              {filteredProducts?.length === 0 && (
                <div className="py-8 text-muted-foreground text-center">
                  No products found matching your search.
                </div>
              )}
            </div>
          </div>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[35%] min-w-[180px]">Product</TableHead>
                    <TableHead className="w-[12%] min-w-[90px]">Category</TableHead>
                    <TableHead className="w-[10%] min-w-[80px]">Brand</TableHead>
                    <TableHead className="w-[15%] min-w-[100px]">Price</TableHead>
                    <TableHead className="w-[8%] min-w-[60px]">Stock</TableHead>
                    <TableHead className="w-[10%] min-w-[80px]">Status</TableHead>
                    <TableHead className="w-[10%] min-w-[80px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 bg-gray-100 rounded-lg w-10 h-10 overflow-hidden">
                            {product.baseImageUrl ? (
                              <Image
                                src={product.baseImageUrl}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex justify-center items-center bg-gray-200 w-full h-full text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm line-clamp-2 leading-tight">
                              {product.name}
                            </div>
                            <div className="text-muted-foreground text-xs mt-1">
                              {product.variations?.length || 0} variations
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="text-sm truncate">
                          {product.category?.name || "Uncategorized"}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="text-sm truncate">
                          {product.brand?.name || "No Brand"}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        {product.variations && product.variations.length > 0 ? (
                          <div className="text-sm">
                            ৳{Math.min(...product.variations.map((v) => v.price)).toFixed(0)}
                            {Math.min(...product.variations.map((v) => v.price)) !== Math.max(...product.variations.map((v) => v.price)) && (
                              <><br />- ৳{Math.max(...product.variations.map((v) => v.price)).toFixed(0)}</>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="text-sm font-medium">
                          {product.variations?.reduce(
                            (sum, v) => sum + v.stockQuantity,
                            0
                          ) || 0}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge
                          variant={product.isPublished ? "default" : "secondary"}
                          className="text-xs">
                          {product.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/products/${product.id}`)
                              }>
                              <Eye className="mr-2 w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/products/${product.id}/edit`)
                              }>
                              <Edit className="mr-2 w-4 h-4" />
                              Edit Product
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setProductToDelete(product);
                                setDeleteDialogOpen(true);
                              }}>
                              <Trash2 className="mr-2 w-4 h-4" />
                              Delete Product
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredProducts?.length === 0 && (
              <div className="py-8 text-muted-foreground text-center">
                No products found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalProducts > ITEMS_PER_PAGE && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
              {/* Mobile Pagination */}
              <div className="sm:hidden flex justify-center items-center gap-2 w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}>
                  Previous
                </Button>
                <span className="px-3 text-muted-foreground text-sm">
                  {currentPage} of {Math.ceil(totalProducts / ITEMS_PER_PAGE)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === Math.ceil(totalProducts / ITEMS_PER_PAGE) || loading}>
                  Next
                </Button>
              </div>

              {/* Desktop Pagination */}
              <div className="hidden sm:flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}>
                  Previous
                </Button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Show first few pages */}
                  {Array.from(
                    { length: Math.min(3, Math.ceil(totalProducts / ITEMS_PER_PAGE)) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className="w-10">
                          {pageNum}
                        </Button>
                      );
                    }
                  )}

                  {/* Show ellipsis and last page if needed */}
                  {Math.ceil(totalProducts / ITEMS_PER_PAGE) > 5 && currentPage <= 3 && (
                    <>
                      <span className="px-2 text-muted-foreground">
                        ...
                      </span>
                      <Button
                        variant={
                          currentPage === Math.ceil(totalProducts / ITEMS_PER_PAGE)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.ceil(totalProducts / ITEMS_PER_PAGE))
                        }
                        disabled={loading}
                        className="w-10">
                        {Math.ceil(totalProducts / ITEMS_PER_PAGE)}
                      </Button>
                    </>
                  )}

                  {/* Show middle pages if current page is in the middle */}
                  {Math.ceil(totalProducts / ITEMS_PER_PAGE) > 5 &&
                    currentPage > 3 &&
                    currentPage < Math.ceil(totalProducts / ITEMS_PER_PAGE) - 2 && (
                      <>
                        <span className="px-2 text-muted-foreground">
                          ...
                        </span>
                        {Array.from({ length: 3 }, (_, i) => {
                          const pageNum = currentPage - 1 + i;
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              disabled={loading}
                              className="w-10">
                              {pageNum}
                            </Button>
                          );
                        })}
                        <span className="px-2 text-muted-foreground">
                          ...
                        </span>
                        <Button
                          variant={
                            currentPage === Math.ceil(totalProducts / ITEMS_PER_PAGE)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setCurrentPage(Math.ceil(totalProducts / ITEMS_PER_PAGE))
                          }
                          disabled={loading}
                          className="w-10">
                          {Math.ceil(totalProducts / ITEMS_PER_PAGE)}
                        </Button>
                      </>
                    )}

                  {/* Show last few pages if current page is near the end */}
                  {Math.ceil(totalProducts / ITEMS_PER_PAGE) > 5 &&
                    currentPage >= Math.ceil(totalProducts / ITEMS_PER_PAGE) - 2 && (
                      <>
                        <span className="px-2 text-muted-foreground">
                          ...
                        </span>
                        {Array.from(
                          {
                            length: Math.min(3, Math.ceil(totalProducts / ITEMS_PER_PAGE)),
                          },
                          (_, i) => {
                            const pageNum = Math.ceil(totalProducts / ITEMS_PER_PAGE) - 2 + i;
                            if (pageNum <= 3) return null; // Avoid duplicate pages
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                disabled={loading}
                                className="w-10">
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                      </>
                    )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === Math.ceil(totalProducts / ITEMS_PER_PAGE) || loading}>
                  Next
                </Button>
              </div>

              {/* Page Info */}
              <div className="sm:text-right text-center">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Page {currentPage} of {Math.ceil(totalProducts / ITEMS_PER_PAGE)} ({totalProducts} total products)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete the
              product &quot;{productToDelete?.name}&quot; and all its
              variations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-row flex-col gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="w-full sm:w-auto">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
