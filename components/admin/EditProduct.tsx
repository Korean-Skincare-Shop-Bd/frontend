"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Save, X, Plus, Trash2, Upload, Edit, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  getProduct,
  updateProduct,
  Product,
  UpdateProductRequest,
  ProductVariation,
  ProductImage,
  createProductVariation,
  updateProductVariation,
  deleteProductVariation,
  addProductImages,
  updateProductImage,
  deleteProductImage,
  CreateVariationRequest,
  UpdateVariationRequest,
  UpdateImageRequest
} from '@/lib/api/products';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

export default function EditProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateProductRequest>({});
  const [newTag, setNewTag] = useState('');
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);

  // Variation dialog states
  const [showVariationDialog, setShowVariationDialog] = useState(false);
  const [editingVariation, setEditingVariation] = useState<ProductVariation | null>(null);
  const [variationForm, setVariationForm] = useState<CreateVariationRequest>({
    name: '',
    price: 0,
    stockQuantity: 0,
  });

  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const params = useParams();
  const { token } = useAdmin();
  const id = params?.id as string;

  useEffect(() => {
    if (id && token) {
      fetchProduct();
    }
  }, [id, token]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(id);
      setProduct(productData);
      setFormData({
        name: productData.name,
        description: productData.description || '',
        categoryId: productData.categoryId,
        brandId: productData.brandId,
        tags: productData.tags || [],
        isPublished: productData.isPublished,
        expiryDate: productData.expiryDate ? productData.expiryDate.split('T')[0] : '',
      });
      setVariations(productData.variations || []);
      setImages(productData.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateProductRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      setSaving(true);

      const updateData: UpdateProductRequest = {
        ...formData,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
      };

      await updateProduct(token!, id, updateData);
      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  // Variation management functions
  const openVariationDialog = (variation?: ProductVariation) => {
    if (variation) {
      setEditingVariation(variation);
      setVariationForm({
        name: variation.name ?? '',
        price: variation.price,
        salePrice: variation.salePrice,
        stockQuantity: variation.stockQuantity,
        volume: variation.volume,
        weightGrams: variation.weightGrams,
        size: variation.attributes?.size as string,
        isDefault: false,
      });
    } else {
      setEditingVariation(null);
      setVariationForm({
        name: '',
        price: 0,
        stockQuantity: 0,
      });
    }
    setShowVariationDialog(true);
  };

  const handleVariationSubmit = async () => {
    try {
      if (editingVariation) {
        // Update existing variation
        const updated = await updateProductVariation(token!, id, editingVariation.id, variationForm);
        setVariations(prev => prev.map(v => v.id === editingVariation.id ? updated : v));
        toast.success('Variation updated successfully');
      } else {
        // Create new variation
        const created = await createProductVariation(token!, id, variationForm);
        setVariations(prev => [...prev, created]);
        toast.success('Variation created successfully');
      }
      setShowVariationDialog(false);
    } catch (error) {
      console.error('Error saving variation:', error);
      toast.error('Failed to save variation');
    }
  };

  const handleDeleteVariation = async (variationId: string) => {
    if (!confirm('Are you sure you want to delete this variation?')) return;

    try {
      await deleteProductVariation(token!, id, variationId);
      setVariations(prev => prev.filter(v => v.id !== variationId));
      toast.success('Variation deleted successfully');
    } catch (error) {
      console.error('Error deleting variation:', error);
      toast.error('Failed to delete variation');
    }
  };

  // Image management functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }
    setSelectedFiles(files);
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);
      const uploadedImages = await addProductImages(token!, id, selectedFiles, images.length === 0);
      setImages(prev => [...prev, ...uploadedImages]);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpdate = async (imageId: string, updates: UpdateImageRequest) => {
    try {
      const updated = await updateProductImage(token!, id, imageId, updates);
      setImages(prev => prev.map(img => img.id === imageId ? updated : img));
      toast.success('Image updated successfully');
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteProductImage(token!, id, imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto px-4 py-8 container">
        <div className="space-y-4 animate-pulse">
          <div className="bg-gray-200 rounded w-1/4 h-8"></div>
          <div className="bg-gray-200 rounded h-64"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded h-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto px-4 py-8 container">
        <div className="text-center">
          <h1 className="mb-4 font-bold text-2xl">Product not found</h1>
          <Button onClick={() => router.push('/admin/products')}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 container">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/admin/products')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="mb-2 font-bold text-3xl">Edit Product</h1>
            <p className="text-muted-foreground">
              Update product information and settings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/products/${id}`)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProduct}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Variations */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Product Variations</CardTitle>
                <Button onClick={() => openVariationDialog()}>
                  <Plus className="mr-2 w-4 h-4" />
                  Add Variation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {variations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Sale Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Weight (g)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variations.map((variation) => (
                      <TableRow key={variation.id}>
                        <TableCell>{variation.name || 'Unnamed'}</TableCell>
                        <TableCell>৳{variation.price}</TableCell>
                        <TableCell>
                          {variation.salePrice ? `৳${variation.salePrice}` : '-'}
                        </TableCell>
                        <TableCell>{variation.stockQuantity}</TableCell>
                        <TableCell>{variation.volume || '-'}</TableCell>
                        <TableCell>{variation.weightGrams || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openVariationDialog(variation)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVariation(variation.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-8 text-muted-foreground text-center">
                  No variations available. Add your first variation to get started.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Product Images</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 w-4 h-4" />
                    Select Images
                  </Button>
                  {selectedFiles.length > 0 && (
                    <Button
                      onClick={handleImageUpload}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <div className="mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></div>
                          Uploading...
                        </>
                      ) : (
                        `Upload ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}`
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFiles.length > 0 && (
                <div className="bg-gray-50 mb-4 p-4 rounded-lg">
                  <p className="mb-2 font-medium text-sm">Selected files:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <Badge key={index} variant="secondary">
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {product.baseImageUrl && (
                  <div className="relative">
                    <div className="relative w-full h-48 overflow-hidden rounded-lg border">
                      <Image
                        src={product.baseImageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Badge className="top-2 right-2 absolute" variant="secondary">
                      Base Image
                    </Badge>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="gap-4 grid grid-cols-2 md:grid-cols-3">
                    {images.map((image) => (
                      <div key={image.id} className="group relative">
                        <div className="relative w-full h-32 overflow-hidden rounded-lg border">
                          <Image
                            src={image.imageUrl}
                            alt={image.altText || product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Image controls overlay */}
                        <div className="absolute inset-0 flex justify-center items-center gap-2 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleImageUpdate(image.id, { isPrimary: !image.isMainImage })}
                          >
                            <Star className={`w-4 h-4 ${image.isMainImage ? 'fill-yellow-400' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleImageDelete(image.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Main image badge */}
                        {image.isMainImage && (
                          <Badge className="top-2 right-2 absolute">
                            Main
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {!product.baseImageUrl && images.length === 0 && (
                  <div className="py-8 text-muted-foreground text-center">
                    No images uploaded. Upload your first image to get started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={formData.isPublished || false}
                  onCheckedChange={(checked) => handleInputChange('isPublished', checked)}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate || ''}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category & Brand */}
          <Card>
            <CardHeader>
              <CardTitle>Category & Brand</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Category</Label>
                <p className="text-muted-foreground text-sm">
                  {product.category?.name || 'Uncategorized'}
                </p>
              </div>

              <div>
                <Label>Current Brand</Label>
                <p className="text-muted-foreground text-sm">
                  {product.brand?.name || 'No Brand'}
                </p>
              </div>

              <p className="text-muted-foreground text-xs">
                Note: Category and Brand changes require additional implementation
              </p>
            </CardContent>
          </Card>

          {/* Product Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Product Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Variations</span>
                  <span className="font-medium text-sm">
                    {variations.length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Total Stock</span>
                  <span className="font-medium text-sm">
                    {variations.reduce((sum, v) => sum + v.stockQuantity, 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Images</span>
                  <span className="font-medium text-sm">
                    {images.length + (product.baseImageUrl ? 1 : 0)}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-sm">Created</span>
                  <span className="font-medium text-sm">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm">Updated</span>
                  <span className="font-medium text-sm">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Variation Dialog */}
      <Dialog open={showVariationDialog} onOpenChange={setShowVariationDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingVariation ? 'Edit Variation' : 'Add New Variation'}
            </DialogTitle>
            <DialogDescription>
              {editingVariation
                ? 'Update the variation details below.'
                : 'Add a new variation to this product.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="gap-4 grid py-4">
            <div className="items-center gap-2 grid grid-cols-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={variationForm.name}
                onChange={(e) => setVariationForm(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                className="col-span-3"
                required
              />
            </div>
            <div className="items-center gap-2 grid grid-cols-4">
              <Label htmlFor="price" className="text-right">
                Price *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={variationForm.price}
                onChange={(e) => setVariationForm(prev => ({
                  ...prev,
                  price: parseFloat(e.target.value) || 0
                }))}
                className="col-span-3"
              />
            </div>
            <div className="items-center gap-2 grid grid-cols-4">
              <Label htmlFor="salePrice" className="text-right">
                Sale Price
              </Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={variationForm.salePrice || ''}
                onChange={(e) => setVariationForm(prev => ({
                  ...prev,
                  salePrice: parseFloat(e.target.value) || undefined
                }))}
                className="col-span-3"
              />
            </div>
            <div className="items-center gap-2 grid grid-cols-4">
              <Label htmlFor="stockQuantity" className="text-right">
                Stock *
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                value={variationForm.stockQuantity}
                onChange={(e) => setVariationForm(prev => ({
                  ...prev,
                  stockQuantity: parseInt(e.target.value) || 0
                }))}
                className="col-span-3"
              />
            </div>
            <div className="items-center gap-2 grid grid-cols-4">
              <Label htmlFor="volume" className="text-right">
                Volume
              </Label>
              <Input
                id="volume"
                value={variationForm.volume || ''}
                onChange={(e) => setVariationForm(prev => ({
                  ...prev,
                  volume: e.target.value
                }))}
                placeholder="e.g., 500ml"
                className="col-span-3"
              />
            </div>
            <div className="items-center gap-2 grid grid-cols-4">
              <Label htmlFor="weightGrams" className="text-right">
                Weight (g)
              </Label>
              <Input
                id="weightGrams"
                type="number"
                value={variationForm.weightGrams || ''}
                onChange={(e) => setVariationForm(prev => ({
                  ...prev,
                  weightGrams: parseInt(e.target.value) || undefined
                }))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowVariationDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleVariationSubmit}>
              {editingVariation ? 'Update' : 'Create'} Variation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}