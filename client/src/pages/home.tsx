import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/ui/navigation";
import ProductCard from "@/components/ui/product-card";
import CategoryFilter from "@/components/ui/category-filter";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ["/api/farmers"],
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-neutral-warm">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'there'}! 👋
          </h1>
          <p className="text-gray-600">
            Discover fresh produce from local farmers or manage your farming business.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{products.length}</div>
              <p className="text-xs text-muted-foreground">Fresh from local farms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{farmers.length}</div>
              <p className="text-xs text-muted-foreground">Verified suppliers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{categories.length}</div>
              <p className="text-xs text-muted-foreground">Product varieties</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-earth-brown">{orders.length}</div>
              <p className="text-xs text-muted-foreground">Total orders placed</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <Button className="flex items-center gap-2" data-testid="browse-products-button">
                <Package className="h-4 w-4" />
                Browse Products
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button variant="outline" className="flex items-center gap-2" data-testid="view-cart-button">
                <ShoppingCart className="h-4 w-4" />
                View Cart
              </Button>
            </Link>

            {user?.role === 'farmer' && (
              <Link href="/farmer-dashboard">
                <Button variant="outline" className="flex items-center gap-2" data-testid="farmer-dashboard-button">
                  <TrendingUp className="h-4 w-4" />
                  Farmer Dashboard
                </Button>
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link href="/admin-dashboard">
                <Button variant="outline" className="flex items-center gap-2" data-testid="admin-dashboard-button">
                  <Users className="h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Categories */}
        <CategoryFilter categories={categories} />

        {/* Featured Products */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Fresh Today</h2>
              <p className="text-gray-600">Handpicked by our farming community</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" data-testid="view-all-products">
                View All →
              </Button>
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
                <p className="text-gray-600 mb-4">Be the first to add fresh produce to the marketplace!</p>
                {user?.role === 'farmer' && (
                  <Link href="/farmer-dashboard">
                    <Button>Add Your First Product</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </section>

        {/* Call to Action */}
        {user?.role === 'consumer' && (
          <Card className="bg-gradient-to-r from-primary to-green-600 text-white">
            <CardContent className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">Ready to start shopping?</h3>
              <p className="text-green-50 mb-6">
                Discover fresh produce from verified local farmers and support sustainable agriculture.
              </p>
              <Link href="/products">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Start Shopping Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {user?.role === 'farmer' && !user?.farmer && (
          <Card className="bg-gradient-to-r from-green-600 to-primary text-white">
            <CardContent className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4">Complete your farmer profile</h3>
              <p className="text-green-50 mb-6">
                Set up your farm details to start selling your fresh produce to customers across Kenya.
              </p>
              <Link href="/farmer-dashboard">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Complete Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
