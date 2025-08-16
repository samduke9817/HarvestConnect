import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/ui/navigation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Package,
  Heart
} from "lucide-react";

export default function Cart() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to update cart items.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update cart item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to remove cart items.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to clear your cart.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (id: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantityMutation.mutate({ id, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (id: number) => {
    removeItemMutation.mutate(id);
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to remove all items from your cart?")) {
      clearCartMutation.mutate();
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total: number, item: any) => {
    return total + (parseFloat(item.product?.price || "0") * item.quantity);
  }, 0);

  const deliveryFee = subtotal > 1000 ? 0 : 100; // Free delivery over KSh 1000
  const total = subtotal + deliveryFee;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-warm">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-warm">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">
                Discover fresh produce from local farmers and add them to your cart.
              </p>
              <Link href="/products">
                <Button size="lg" data-testid="browse-products-button">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Cart Items</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearCart}
                    disabled={clearCartMutation.isPending}
                    data-testid="clear-cart-button"
                  >
                    Clear All
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item: any) => {
                    const product = item.product;
                    const itemTotal = parseFloat(product?.price || "0") * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg" data-testid={`cart-item-${item.id}`}>
                        {/* Product Image */}
                        <Link href={`/products/${product?.id}`}>
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            <img
                              src={product?.images?.[0] || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"}
                              alt={product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${product?.id}`}>
                            <h3 className="font-medium text-gray-900 truncate hover:text-primary">
                              {product?.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500">
                            KSh {product?.price} per {product?.unit}
                          </p>
                          
                          {product?.isOrganic && (
                            <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                              Organic
                            </Badge>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                            disabled={updateQuantityMutation.isPending || item.quantity <= 1}
                            data-testid={`decrease-quantity-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center font-medium" data-testid={`quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                            disabled={updateQuantityMutation.isPending}
                            data-testid={`increase-quantity-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            KSh {itemTotal.toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={removeItemMutation.isPending}
                          data-testid={`remove-item-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Continue Shopping */}
              <div className="flex justify-between">
                <Link href="/products">
                  <Button variant="outline" data-testid="continue-shopping-button">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium" data-testid="subtotal-amount">
                      KSh {subtotal.toFixed(2)}
                    </span>
                  </div>

                  {/* Delivery Fee */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium" data-testid="delivery-fee">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `KSh ${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {subtotal < 1000 && deliveryFee > 0 && (
                    <p className="text-sm text-gray-500">
                      Add KSh {(1000 - subtotal).toFixed(2)} more for free delivery
                    </p>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-primary" data-testid="total-amount">
                      KSh {total.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/checkout")}
                    data-testid="checkout-button"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>

                  {/* Security Notice */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Secure checkout with M-Pesa and other payment methods
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
