import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Star } from "lucide-react";

interface FarmerStatsProps {
  productsCount: number;
  ordersCount: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews?: number;
}

export function FarmerStats({
  productsCount,
  ordersCount,
  totalRevenue,
  averageRating,
  totalReviews = 0,
}: FarmerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{productsCount}</div>
          <p className="text-xs text-muted-foreground">Active listings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary">{ordersCount}</div>
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
          <p className="text-xs text-muted-foreground">{totalReviews} reviews</p>
        </CardContent>
      </Card>
    </div>
  );
}