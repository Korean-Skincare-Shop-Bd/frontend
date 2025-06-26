"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  Brand,
  CreateBrandRequest,
} from "@/lib/api/brands";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import Image from "next/image";

export function BrandsManager() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<CreateBrandRequest>({
    name: "",
    description: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { token } = useAdmin();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await getBrands();
      setBrands(response.data.brands);
    } catch (error) {
      console.error("Error fetching brands:", error);
      toast.error("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!formData.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      setFormLoading(true);
      const submitData = { ...formData, logo: logoFile || undefined };

      if (editingBrand) {
        await updateBrand(token, editingBrand.id, submitData);
        toast.success("Brand updated successfully");
      } else {
        await createBrand(token, submitData);
        toast.success("Brand created successfully");
      }

      fetchBrands();
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving brand:", error);
      toast.error("Failed to save brand");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
    });
    setLogoPreview(brand.logoUrl || null);
    setLogoFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!brandToDelete || !token) return;

    try {
      await deleteBrand(token, brandToDelete.id);
      toast.success("Brand deleted successfully");
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Failed to delete brand");
    } finally {
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingBrand(null);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const filteredBrands = Array.isArray(brands)
    ? brands.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
            Brands Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your product brands
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full md:w-auto">
              <Plus className="mr-2 w-4 h-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="mx-4 w-full max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {editingBrand ? "Edit Brand" : "Create New Brand"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-medium text-sm">
                  Brand Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter brand name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="font-medium text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter brand description"
                  rows={3}
                  className="mt-1 resize-none"
                />
              </div>

              <div>
                <Label className="font-medium text-sm">Brand Logo</Label>
                <div className="mt-2">
                  {logoPreview ? (
                    <div className="inline-block relative">
                      {" "}
                      <Image
                        src={logoPreview}
                        alt="Brand logo"
                        fill
                        className="border rounded-lg w-20 h-20 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="-top-2 -right-2 absolute w-6 h-6"
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col justify-center items-center bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg w-full h-20 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Upload className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-500 text-sm">
                          Upload Logo
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex sm:flex-row flex-col gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 sm:flex-none">
                  {formLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                      {editingBrand ? "Updating..." : "Creating..."}
                    </div>
                  ) : editingBrand ? (
                    "Update Brand"
                  ) : (
                    "Create Brand"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1 sm:flex-none">
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-4">
            <CardTitle className="text-lg sm:text-xl">
              All Brands ({brands.length})
            </CardTitle>
            <div className="relative flex-1 lg:flex-none">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
              <Input
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full lg:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {" "}
          {/* Mobile Card View */}
          <div className="lg:hidden block">
            {filteredBrands.map((brand) => (
              <div key={brand.id} className="p-4 border-b last:border-b-0">
                <div className="flex justify-between items-start gap-3 mb-3">
                  <div className="flex flex-1 items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg w-12 h-12 overflow-hidden">
                      {brand.logoUrl ? (
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full">
                          <span className="font-medium text-white text-sm">
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{brand.name}</div>
                      <div className="text-muted-foreground text-sm">
                        ID: {brand.id}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(brand)}>
                        <Edit className="mr-2 w-4 h-4" />
                        Edit Brand
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setBrandToDelete(brand);
                          setDeleteDialogOpen(true);
                        }}>
                        <Trash2 className="mr-2 w-4 h-4" />
                        Delete Brand
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Description:</span>
                    <div className="mt-1 font-medium">
                      {brand.description || "No description"}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-muted-foreground">Products:</span>
                      <Badge variant="secondary" className="ml-2">
                        {brand.productCount || 0} products
                      </Badge>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {(filteredBrands.length === 0 || !filteredBrands) && (
              <div className="py-8 text-muted-foreground text-center">
                No brands found matching your search.
              </div>
            )}
          </div>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Brand</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[120px]">Products</TableHead>
                  <TableHead className="min-w-[100px]">Created</TableHead>
                  <TableHead className="min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-gray-100 rounded-lg w-12 h-12 overflow-hidden">
                          {brand.logoUrl ? (
                            <Image
                              src={brand.logoUrl}
                              alt={brand.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 w-full h-full">
                              <span className="font-medium text-white text-sm">
                                {brand.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">
                            {brand.name}
                          </div>
                          <div className="text-muted-foreground text-sm">
                            ID: {brand.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {brand.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {brand.productCount || 0} products
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(brand.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(brand)}>
                            <Edit className="mr-2 w-4 h-4" />
                            Edit Brand
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setBrandToDelete(brand);
                              setDeleteDialogOpen(true);
                            }}>
                            <Trash2 className="mr-2 w-4 h-4" />
                            Delete Brand
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {(filteredBrands.length === 0 || !filteredBrands) && (
              <div className="py-8 text-muted-foreground text-center">
                No brands found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 w-full max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              This action cannot be undone. This will permanently delete the
              brand &quot;{brandToDelete?.name}&quot; and may affect associated
              products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-row flex-col gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full sm:w-auto">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
