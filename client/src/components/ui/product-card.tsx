import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  MapPin, 
  Leaf
} from "lucide-react";

interface ProductCardProps {
  product: any;
  showFarmerInfo?: boolean;
}

export default function ProductCard({ product, showFarmerInfo = true }: ProductCardProps) {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: `${product.name} added to your cart.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to add items to cart.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate();
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API
  };

  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";

  const rating = parseFloat(product.rating || "0");

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow" data-testid={`product-card-${product.id}`}>
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <img 
            src={productImage}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {product.isOrganic && (
              <Badge className="bg-green-600 text-white">
                <Leaf className="h-3 w-3 mr-1" />
                Organic
              </Badge>
            )}
            
            {product.stock > 0 && product.stock <= 10 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Low Stock
              </Badge>
            )}
            
            {new Date(product.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
              <Badge className="bg-primary text-white">
                Fresh Today
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100"
            onClick={handleWishlistToggle}
            data-testid={`wishlist-${product.id}`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
          
          {/* Out of Stock Overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 truncate" data-testid={`product-name-${product.id}`}>
                {product.name}
              </h4>
              <p className="text-sm text-gray-500">Per {product.unit}</p>
            </div>
            <div className="text-right ml-2">
              <p className="text-lg font-bold text-primary" data-testid={`product-price-${product.id}`}>
                KSh {parseFloat(product.price).toFixed(0)}
              </p>
            </div>
          </div>
        </Link>
        
        {/* Farmer Info */}
        {showFarmerInfo && (
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                Farmer Info
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">Location</span>
              </div>
            </div>
          </div>
        )}

        {/* Rating and Stock */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex text-yellow-400 text-sm">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {rating.toFixed(1)} ({product.totalReviews || 0})
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {product.stock} {product.unit} left
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full"
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || product.stock <= 0}
          data-testid={`add-to-cart-${product.id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {addToCartMutation.isPending 
            ? "Adding..." 
            : product.stock <= 0 
              ? "Out of Stock" 
              : "Add to Cart"
          }
        </Button>
      </CardContent>
    </Card>
  );
}
