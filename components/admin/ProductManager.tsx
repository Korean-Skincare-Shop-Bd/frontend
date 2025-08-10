"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, Globe, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getProducts, Product, deleteProduct, publishProduct, unpublishProduct } from '@/lib/api/products';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [publishingProductId, setPublishingProductId] = useState<string | null>(null);
  const { token } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [token, currentPage]);

  const fetchProducts = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const params = { 
        page: currentPage, 
        limit: 20,
        ...(searchQuery && { search: searchQuery })
      };
      // Use regular function to get all products
      const response = await getProducts(params);
      setProducts(response.products);
      setTotalProducts(response.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (product: Product) => {
    if (!token) return;
    
    try {
      setPublishingProductId(product.id);
      
      if (product.isPublished) {
        await unpublishProduct(token, product.id);
        toast.success(`${product.name} unpublished successfully`);
      } else {
        await publishProduct(token, product.id);
        toast.success(`${product.name} published successfully`);
      }
      
      // Update the product in the list
      setProducts(prev => prev.map(p => 
        p.id === product.id 
          ? { ...p, isPublished: !p.isPublished }
          : p
      ));
    } catch (error: any) {
      console.error('Error toggling publish status:', error);
      toast.error(error.message || 'Failed to update publish status');
    } finally {
      setPublishingProductId(null);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete || !token) return;

    try {
      await deleteProduct(token, productToDelete.id)
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products?.filter(product =>
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
          <h1 className="mb-2 font-bold text-2xl sm:text-3xl">Products Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your product catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push('/admin/products/create')}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-4">
            <CardTitle className="text-lg sm:text-xl">All Products ({totalProducts})</CardTitle>
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
              <Button variant="outline" size="icon" className="w-full sm:w-auto">
                <Filter className="w-4 h-4" />
                <span className="sm:hidden ml-2">Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card View */}{" "}
          <div className="lg:hidden block">
            {filteredProducts?.map((product) => (
              <div key={product.id} className="p-4 border-b last:border-b-0">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg w-12 h-12 overflow-hidden">
                      {product.baseImageUrl ? (
                        <Image
                          src={product.baseImageUrl}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex justify-center items-center bg-gray-200 w-full h-full text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-muted-foreground text-sm">
                        {product.variations?.length || 0} variations
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}`)}>
                        <Eye className="mr-2 w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
                        <Edit className="mr-2 w-4 h-4" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePublishToggle(product)}
                        disabled={publishingProductId === product.id}
                      >
                        {product.isPublished ? (
                          <>
                            <EyeOff className="mr-2 w-4 h-4" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Globe className="mr-2 w-4 h-4" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setProductToDelete(product);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 w-4 h-4" />
                        Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="gap-4 grid grid-cols-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <div className="font-medium">{product.category?.name || 'Uncategorized'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Brand:</span>
                    <div className="font-medium">{product.brand?.name || 'No Brand'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Price Range:</span>
                    <div className="font-medium">
                      {product.variations && product.variations.length > 0 ? (
                        <span>
                          ${Math.min(...product.variations.map(v => v.price)).toFixed(2)} -
                          ${Math.max(...product.variations.map(v => v.price)).toFixed(2)}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stock:</span>
                    <div className="font-medium">
                      {product.variations?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <Badge variant={product.isPublished ? "default" : "secondary"}>
                    {product.isPublished ? 'Published' : 'Draft'}
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
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Product</TableHead>
                  <TableHead className="min-w-[120px]">Category</TableHead>
                  <TableHead className="min-w-[100px]">Brand</TableHead>
                  <TableHead className="min-w-[140px]">Price Range</TableHead>
                  <TableHead className="min-w-[80px]">Stock</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-gray-100 rounded-lg w-12 h-12 overflow-hidden">
                          {product.baseImageUrl ? (
                            <Image
                              src={product.baseImageUrl}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex justify-center items-center bg-gray-200 w-full h-full text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{product.name}</div>
                          <div className="text-muted-foreground text-sm">
                            {product.variations?.length || 0} variations
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category?.name || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      {product.brand?.name || 'No Brand'}
                    </TableCell>
                    <TableCell>
                      {product.variations && product.variations.length > 0 ? (
                        <div className="text-sm">
                          ৳{Math.min(...product.variations.map(v => v.price)).toFixed(2)} -
                          ৳{Math.max(...product.variations.map(v => v.price)).toFixed(2)}
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {product.variations?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.isPublished ? "default" : "secondary"}>
                        {product.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}`)}>
                            <Eye className="mr-2 w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
                            <Edit className="mr-2 w-4 h-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteDialogOpen(true);
                            }}
                          >
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

            {filteredProducts?.length === 0 && (
              <div className="py-8 text-muted-foreground text-center">
                No products found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete the
              product &quot;{productToDelete?.name}&quot; and all its
              variations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-row flex-col gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="w-full sm:w-auto"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}