import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/ui/navigation";
import ProductCard from "@/components/ui/product-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Plus, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Star,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar
} from "lucide-react";

const farmerProfileSchema = z.object({
  farmName: z.string().min(1, "Farm name is required"),
  description: z.string().optional(),
  county: z.string().min(1, "County is required"),
  subCounty: z.string().optional(),
  experience: z.number().min(0, "Experience must be positive").optional(),
  specializations: z.array(z.string()).optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.number().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  unit: z.string().min(1, "Unit is required"),
  stock: z.number().min(0, "Stock must be positive"),
  isOrganic: z.boolean().optional(),
});

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    if (!user?.isLoading && user?.role !== 'farmer') {
      toast({
        title: "Access Denied",
        description: "You need farmer access to view this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  }, [user, toast]);

  const { data: farmer } = useQuery({
    queryKey: ["/api/farmers", "by-user", user?.id],
    enabled: !!user?.id,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products", { farmerId: farmer?.id }],
    enabled: !!farmer?.id,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    enabled: !!farmer?.id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Farmer Profile Form
  const profileForm = useForm({
    resolver: zodResolver(farmerProfileSchema),
    defaultValues: {
      farmName: farmer?.farmName || "",
      description: farmer?.description || "",
      county: farmer?.county || "",
      subCounty: farmer?.subCounty || "",
      experience: farmer?.experience || 0,
      specializations: farmer?.specializations || [],
    },
  });

  // Product Form
  const productForm = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: 0,
      price: "",
      unit: "",
      stock: 0,
      isOrganic: false,
    },
  });

  // Create/Update Farmer Profile
  const profileMutation = useMutation({
    mutationFn: async (data: any) => {
      if (farmer) {
        return await apiRequest("PATCH", `/api/farmers/${farmer.id}`, data);
      } else {
        return await apiRequest("POST", "/api/farmers", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your farmer profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/farmers"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to update your profile.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create/Update Product
  const productMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingProduct) {
        return await apiRequest("PATCH", `/api/products/${editingProduct.id}`, data);
      } else {
        return await apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: () => {
      toast({
        title: editingProduct ? "Product updated" : "Product created",
        description: `Product has been ${editingProduct ? 'updated' : 'created'} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      productForm.reset();
      setEditingProduct(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to manage products.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: `Failed to ${editingProduct ? 'update' : 'create'} product. Please try again.`,
        variant: "destructive",
      });
    },
  });

  // Delete Product
  const deleteProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: any) => {
    profileMutation.mutate({
      ...data,
      experience: parseInt(data.experience) || 0,
    });
  };

  const onProductSubmit = (data: any) => {
    productMutation.mutate({
      ...data,
      categoryId: parseInt(data.categoryId),
      price: data.price,
      stock: parseInt(data.stock) || 0,
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    productForm.setValue("name", product.name);
    productForm.setValue("description", product.description || "");
    productForm.setValue("categoryId", product.categoryId);
    productForm.setValue("price", product.price);
    productForm.setValue("unit", product.unit);
    productForm.setValue("stock", product.stock);
    productForm.setValue("isOrganic", product.isOrganic || false);
    setActiveTab("products");
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.totalAmount), 0);
  const totalOrders = orders.length;
  const averageRating = farmer?.rating ? parseFloat(farmer.rating) : 0;

  if (user?.isLoading) {
    return (
      <div className="min-h-screen bg-neutral-warm">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-warm">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Farmer Dashboard</h1>
          <p className="text-gray-600">
            Manage your farm profile, products, and orders
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="profile" data-testid="tab-profile">Profile</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{products.length}</div>
                  <p className="text-xs text-muted-foreground">Active listings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">All time orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">KSh {totalRevenue.toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground">All time revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-earth-brown">{averageRating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">{farmer?.totalReviews || 0} reviews</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Products */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.slice(0, 6).map((product: any) => (
                      <ProductCard key={product.id} product={product} showFarmerInfo={false} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first product to the marketplace.</p>
                    <Button onClick={() => setActiveTab("products")}>
                      Add Your First Product
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="farmName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Farm Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="farm-name-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="county"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>County *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="county-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="subCounty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sub County</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="sub-county-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Years of Experience</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                data-testid="experience-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={profileForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Farm Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              placeholder="Tell customers about your farm, farming practices, and what makes your products special..."
                              data-testid="description-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={profileMutation.isPending}
                      data-testid="save-profile-button"
                    >
                      {profileMutation.isPending ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Add/Edit Product Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                      <FormField
                        control={productForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="product-name-input" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                              <FormControl>
                                <SelectTrigger data-testid="category-select">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category: any) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (KSh) *</FormLabel>
                              <FormControl>
                                <Input {...field} data-testid="price-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={productForm.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit *</FormLabel>
                              <FormControl>
                                <Input placeholder="kg, piece, bunch" {...field} data-testid="unit-input" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={productForm.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                data-testid="stock-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                rows={3}
                                placeholder="Describe your product..."
                                data-testid="product-description-input"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2">
                        <Button 
                          type="submit" 
                          disabled={productMutation.isPending}
                          data-testid="save-product-button"
                        >
                          {productMutation.isPending 
                            ? "Saving..." 
                            : editingProduct 
                              ? "Update Product" 
                              : "Add Product"
                          }
                        </Button>
                        
                        {editingProduct && (
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setEditingProduct(null);
                              productForm.reset();
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Products List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Your Products ({products.length})</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {products.length > 0 ? (
                      <div className="space-y-4">
                        {products.map((product: any) => (
                          <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                              <div>
                                <h3 className="font-medium text-gray-900">{product.name}</h3>
                                <p className="text-sm text-gray-500">
                                  KSh {product.price} per {product.unit}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                                  </Badge>
                                  {product.isOrganic && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                      Organic
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                                data-testid={`edit-product-${product.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                                data-testid={`delete-product-${product.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                        <p className="text-gray-600">Add your first product to start selling.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">KSh {parseFloat(order.totalAmount).toFixed(2)}</p>
                            <Badge 
                              variant={
                                order.status === 'delivered' ? 'default' :
                                order.status === 'shipped' ? 'secondary' :
                                order.status === 'confirmed' ? 'outline' : 'destructive'
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600">Orders will appear here when customers purchase your products.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
