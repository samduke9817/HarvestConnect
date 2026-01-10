import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";
import ProductCard from "@/components/ui/product-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { FarmerStats } from "./components/FarmerStats";
import { FarmerProfileForm } from "./components/FarmerProfileForm";
import { ProductForm } from "./components/ProductForm";
import { ProductList } from "./components/ProductList";
import { OrdersList } from "./components/OrdersList";
import { Package } from "lucide-react";

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
            <FarmerStats 
              productsCount={products.length}
              ordersCount={totalOrders}
              totalRevenue={totalRevenue}
              averageRating={averageRating}
              totalReviews={farmer?.totalReviews}
            />

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.slice(0, 6).map((product: any) => (
                  <ProductCard key={product.id} product={product} showFarmerInfo={false} />
                ))}
              </div>
            </div>

            {products.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first product to the marketplace.</p>
                <Button onClick={() => setActiveTab("products")}>
                  Add Your First Product
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <FarmerProfileForm 
              form={profileForm}
              onSubmit={onProfileSubmit}
              isPending={profileMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <ProductForm 
                form={productForm}
                onSubmit={onProductSubmit}
                categories={categories}
                isPending={productMutation.isPending}
                isEditing={!!editingProduct}
                onCancel={() => {
                  setEditingProduct(null);
                  productForm.reset();
                }}
              />
              <ProductList 
                products={products}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrdersList orders={orders} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}