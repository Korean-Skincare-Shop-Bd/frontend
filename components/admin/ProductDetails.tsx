"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Package,
  DollarSign,
  Calendar,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProduct, Product } from "@/lib/api/products";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import Image from "next/image";

export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to fetch product details");
    } finally {
      setLoading(false);
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
          <Button onClick={() => router.push("/admin/products")}>
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
            onClick={() => router.push("/admin/products")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="mb-2 font-bold text-3xl">{product.name}</h1>
            <p className="text-muted-foreground">
              Product Details • Created{" "}
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/products/${id}/edit`)}>
            <Edit className="mr-2 w-4 h-4" />
            Edit Product
          </Button>
        </div>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="gap-4 grid grid-cols-2 md:grid-cols-3">
                {product.baseImageUrl && (
                  <div className="relative">
                    <Image
                      src={product.baseImageUrl}
                      alt={product.name}
                      className="border rounded-lg w-full h-32 object-cover"
                    />
                    <Badge
                      className="top-2 right-2 absolute"
                      variant="secondary">
                      Main
                    </Badge>
                  </div>
                )}
                {product.images?.map((image) => (
                  <div key={image.id} className="relative">
                    <Image
                      src={image.imageUrl}
                      alt={image.altText || product.name}
                      className="border rounded-lg w-full h-32 object-cover"
                    />
                    {image.isMainImage && (
                      <Badge
                        className="top-2 right-2 absolute"
                        variant="secondary">
                        Main
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              {!product.baseImageUrl &&
                (!product.images || product.images.length === 0) && (
                  <div className="flex justify-center items-center bg-gray-100 rounded-lg h-32 text-gray-500">
                    No images available
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Product Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {/* Product Variations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Variations ({product.variations?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.variations && product.variations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Sale Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variations.map((variation) => (
                      <TableRow key={variation.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {variation.imageUrl && (
                              <Image
                                src={variation.imageUrl}
                                alt={variation.name || product.name}
                                className="rounded w-8 h-8 object-cover"
                              />
                            )}
                            {variation.name || "Default Variation"}
                          </div>
                        </TableCell>
                        <TableCell>৳{variation.price}</TableCell>
                        <TableCell>
                          {variation.salePrice ? (
                            <span className="text-green-600">
                              ৳{variation.salePrice}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              variation.stockQuantity > 0
                                ? "default"
                                : "destructive"
                            }>
                            {variation.stockQuantity}
                          </Badge>
                        </TableCell>
                        <TableCell>{variation.volume || "-"}</TableCell>
                        <TableCell>
                          {variation.weightGrams
                            ? `${variation.weightGrams}g`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">
                  No variations available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={product.isPublished ? "default" : "secondary"}
                className="mb-4">
                {product.isPublished ? "Published" : "Draft"}
              </Badge>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Category</p>
                  <p className="text-muted-foreground text-sm">
                    {product.category?.name || "Uncategorized"}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm">Brand</p>
                  <p className="text-muted-foreground text-sm">
                    {product.brand?.name || "No Brand"}
                  </p>
                </div>

                {product.expiryDate && (
                  <div>
                    <p className="font-medium text-sm">Expiry Date</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(product.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.variations && product.variations.length > 0 ? (
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Price Range</p>
                    <p className="text-muted-foreground text-sm">
                      ৳
                      {Math.min(
                        ...product.variations.map((v) => v.price)
                      ).toFixed(2)}{" "}
                      - ৳
                      {Math.max(
                        ...product.variations.map((v) => v.price)
                      ).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Total Stock</p>
                    <p className="text-muted-foreground text-sm">
                      {product.variations.reduce(
                        (sum, v) => sum + v.stockQuantity,
                        0
                      )}{" "}
                      units
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Variations</p>
                    <p className="text-muted-foreground text-sm">
                      {product.variations.length} variation(s)
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No pricing information available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-sm">Created</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm">Last Updated</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
