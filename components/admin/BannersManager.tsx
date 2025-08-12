"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Eye,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  Banner,
  CreateBannerRequest,
} from "@/lib/api/banners";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import Image from "next/image";

export function BannersManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<{
    linkUrl: string;
    isActive: boolean;
  }>({
    linkUrl: "",
    isActive: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const { token } = useAdmin();

  const fetchBanners = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await getBanners(token, currentPage, 20);
      console.log("Fetched banners:", data.banners); // Debug log
      setBanners(data.banners);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  }, [token, currentPage]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!imageFile && !editingBanner) {
      toast.error("Banner image is required");
      return;
    }

    try {
      setFormLoading(true);
      const submitData: CreateBannerRequest = {
        image: imageFile!,
        linkUrl: formData.linkUrl || undefined,
        isActive: formData.isActive,
      };

      if (editingBanner) {
        await updateBanner(token, editingBanner.id, {
          linkUrl: formData.linkUrl || undefined,
          isActive: formData.isActive,
          ...(imageFile && { image: imageFile }),
        });
        toast.success("Banner updated successfully");
      } else {
        await createBanner(token, submitData);
        toast.success("Banner created successfully");
      }

      fetchBanners();
      resetForm();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      linkUrl: banner.linkUrl || "",
      isActive: banner.isActive,
    });
    setImagePreview(banner.imageUrl);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!bannerToDelete || !token) return;

    try {
      await deleteBanner(token, bannerToDelete.id);
      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    } finally {
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const handlePreview = (banner: Banner) => {
    setPreviewBanner(banner);
    setPreviewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      linkUrl: "",
      isActive: true,
    });
    setEditingBanner(null);
    setImageFile(null);
    setImagePreview(null);
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 container">
        <div className="space-y-4 animate-pulse">
          <div className="bg-gray-200 rounded w-1/4 h-8"></div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded h-48"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="flex md:flex-row flex-col md:justify-between md:items-center mb-8">
        <div>
          <h1 className="mb-2 font-bold text-3xl">Banners Management</h1>
          <p className="text-muted-foreground">
            Manage promotional banners for your store
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 w-4 h-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Create New Banner"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Banner Image *</Label>
                <div className="mt-2">
                  {" "}
                  {imagePreview ? (
                    <div className="relative w-full h-32 bg-gray-100">
                      <Image
                        src={imagePreview}
                        alt="Banner preview"
                        fill
                        className="border rounded-lg object-cover"
                        onError={(e) => {
                          console.error(
                            "Preview image failed to load:",
                            imagePreview
                          );
                          console.error("Error:", e);
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="-top-2 -right-2 absolute w-6 h-6"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col justify-center items-center bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg w-full h-32 cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 text-gray-500" />
                        <span className="text-gray-500 text-sm">
                          Upload Banner Image
                        </span>
                        <span className="text-gray-400 text-xs">
                          Recommended: 1200x400px
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="linkUrl">Link URL (Optional)</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkUrl: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/promotion"
                />
              </div>

              <div className="flex justify-between items-center">
                <Label htmlFor="active">Active</Label>
                <Switch
                  id="active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked }))
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                      {editingBanner ? "Updating..." : "Creating..."}
                    </div>
                  ) : editingBanner ? (
                    "Update Banner"
                  ) : (
                    "Create Banner"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col justify-center items-center py-12">
            <div className="text-center">
              <h3 className="mb-2 font-semibold text-2xl">No banners yet</h3>
              <p className="mb-4 text-muted-foreground">
                Create your first promotional banner to get started
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 w-4 h-4" />
                Create Banner
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {(Array.isArray(banners) ? banners : []).map((banner) => (
              <Card key={banner.id} className="overflow-hidden">
                <div className="relative w-full h-48 bg-gray-100">
                  {banner.imageUrl ? (
                    <Image
                      src={banner.imageUrl}
                      alt="Banner"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", banner.imageUrl);
                        console.error("Error:", e);
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                      <span className="text-gray-500 text-sm">No image</span>
                    </div>
                  )}
                  <div className="top-2 right-2 absolute flex gap-2">
                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-muted-foreground text-sm">
                      Created: {new Date(banner.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {banner.linkUrl && (
                    <div className="flex items-center gap-2 mb-3">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={banner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline truncate">
                        {banner.linkUrl}
                      </a>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                      className="flex-1">
                      <Edit className="mr-2 w-4 h-4" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(banner)}>
                          <Eye className="mr-2 w-4 h-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setBannerToDelete(banner);
                            setDeleteDialogOpen(true);
                          }}>
                          <Trash2 className="mr-2 w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex sm:flex-row flex-col justify-between items-center gap-4 mt-6">
              <div className="text-muted-foreground text-sm">
                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} banners
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={!pagination.hasPrev}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum = 1;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="p-0 w-8 h-8"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  disabled={!pagination.hasNext}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Banner Preview</DialogTitle>
          </DialogHeader>
          {previewBanner && (
            <div className="space-y-4">
              <div className="relative w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                {previewBanner.imageUrl ? (
                  <Image
                    src={previewBanner.imageUrl}
                    alt="Banner Preview"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      console.error(
                        "Preview image failed to load:",
                        previewBanner.imageUrl
                      );
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-gray-700">Status:</strong>
                  <Badge
                    variant={previewBanner.isActive ? "default" : "secondary"}
                    className="ml-2">
                    {previewBanner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div>
                  <strong className="text-gray-700">Created:</strong>
                  <span className="ml-2">
                    {new Date(previewBanner.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {previewBanner.linkUrl && (
                  <div className="md:col-span-2">
                    <strong className="text-gray-700">Link URL:</strong>
                    <a
                      href={previewBanner.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2 break-all">
                      {previewBanner.linkUrl}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(previewBanner)}
                  className="flex-1">
                  <Edit className="mr-2 w-4 h-4" />
                  Edit Banner
                </Button>
                {previewBanner.linkUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(previewBanner.linkUrl, "_blank")}
                    className="flex-1">
                    <ExternalLink className="mr-2 w-4 h-4" />
                    Test Link
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              banner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
