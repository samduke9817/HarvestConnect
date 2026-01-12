import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/ui/navigation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ArrowLeft, 
  ShoppingCart, 
  MapPin, 
  Phone, 
  CreditCard,
  Smartphone,
  CheckCircle,
  Clock,
  Shield,
  Truck
} from "lucide-react";

const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, "Please provide a detailed delivery address"),
  deliveryPhone: z.string().min(10, "Please provide a valid phone number").regex(/^(\+254|0)[17]\d{8}$/, "Please provide a valid Kenyan phone number"),
  deliveryInstructions: z.string().optional(),
  paymentMethod: z.enum(["mpesa", "card"], {
    required_error: "Please select a payment method",
  }),
  mpesaPhone: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);

  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ["/api/cart"],
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryAddress: "",
      deliveryPhone: "",
      deliveryInstructions: "",
      paymentMethod: "mpesa",
      mpesaPhone: "",
    },
  });

  const watchPaymentMethod = form.watch("paymentMethod");

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoadingCart && cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      navigate("/cart");
    }
  }, [cartItems, isLoadingCart, navigate, toast]);

  // Create Order Mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      setOrderCreated(order);
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to place an order.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Order failed",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    },
  });

  // Process Payment Mutation
  const processPaymentMutation = useMutation({
    mutationFn: async ({ orderId, amount, phoneNumber }: { orderId: number; amount: number; phoneNumber: string }) => {
      const response = await apiRequest("POST", "/api/payments/mpesa", {
        orderId,
        amount,
        phoneNumber,
      });
      return response.json();
    },
    onSuccess: (paymentResult) => {
      setIsProcessingPayment(false);
      if (paymentResult.success) {
        toast({
          title: "Payment initiated",
          description: "Please check your phone for M-Pesa prompt and complete the payment.",
        });
        // Poll for payment status or redirect to success page
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        toast({
          title: "Payment failed",
          description: paymentResult.message || "Payment processing failed.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      setIsProcessingPayment(false);
      toast({
        title: "Payment error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Calculate total
      const subtotal = cartItems.reduce((total: number, item: any) => {
        return total + (parseFloat(item.product?.price || "0") * item.quantity);
      }, 0);
      const deliveryFee = subtotal > 1000 ? 0 : 100;
      const totalAmount = subtotal + deliveryFee;

      // Create order
      const orderData = {
        totalAmount: totalAmount.toString(),
        deliveryAddress: data.deliveryAddress,
        deliveryPhone: data.deliveryPhone,
        deliveryInstructions: data.deliveryInstructions,
        paymentMethod: data.paymentMethod,
      };

      const order = await createOrderMutation.mutateAsync(orderData);

      // Process payment based on method
      if (data.paymentMethod === "mpesa") {
        const phoneNumber = data.mpesaPhone || data.deliveryPhone;
        await processPaymentMutation.mutateAsync({
          orderId: order.id,
          amount: totalAmount,
          phoneNumber,
        });
      } else {
        // For card payments, would integrate with card processor
        toast({
          title: "Card payment",
          description: "Card payment integration coming soon. Please use M-Pesa.",
          variant: "destructive",
        });
        setIsProcessingPayment(false);
      }
    } catch (error) {
      setIsProcessingPayment(false);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total: number, item: any) => {
    return total + (parseFloat(item.product?.price || "0") * item.quantity);
  }, 0);
  const deliveryFee = subtotal > 1000 ? 0 : 100;
  const total = subtotal + deliveryFee;

  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-neutral-warm">
        <Navigation />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (orderCreated && isProcessingPayment) {
    return (
      <div className="min-h-screen bg-neutral-warm">
        <Navigation />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-16 w-16 text-primary mx-auto mb-4 animate-pulse" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h1>
              <p className="text-gray-600 mb-6">
                Please check your phone for the M-Pesa payment prompt and complete the transaction.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">
                    M-Pesa prompt sent to your phone
                  </span>
                </div>
              </div>
              <Button onClick={() => navigate("/")} variant="outline">
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-warm">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/cart")}
            className="mb-4"
            data-testid="back-to-cart"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            Complete your order and get fresh produce delivered to your door
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Delivery Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={3}
                              placeholder="Please provide a detailed address including building name, street, area, and landmarks"
                              data-testid="delivery-address-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="+254 7XX XXX XXX or 07XX XXX XXX"
                              data-testid="delivery-phone-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="deliveryInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={2}
                              placeholder="Any special delivery instructions..."
                              data-testid="delivery-instructions-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Truck className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-blue-900">Delivery Information</p>
                          <p className="text-blue-700">
                            • Standard delivery: 1-2 business days<br/>
                            • Free delivery on orders over KSh 1,000<br/>
                            • Delivery available within Nairobi and surrounding areas
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-3"
                            >
                              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-primary transition-colors">
                                <RadioGroupItem value="mpesa" id="mpesa" data-testid="payment-mpesa" />
                                <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <Smartphone className="h-5 w-5 text-green-600 mr-3" />
                                      <div>
                                        <p className="font-medium">M-Pesa</p>
                                        <p className="text-sm text-gray-500">Pay with your mobile phone</p>
                                      </div>
                                    </div>
                                    <Badge className="bg-green-600">Recommended</Badge>
                                  </div>
                                </Label>
                              </div>

                              <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-50">
                                <RadioGroupItem value="card" id="card" disabled data-testid="payment-card" />
                                <Label htmlFor="card" className="flex-1 cursor-not-allowed">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                                      <div>
                                        <p className="font-medium">Credit/Debit Card</p>
                                        <p className="text-sm text-gray-500">Coming soon</p>
                                      </div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchPaymentMethod === "mpesa" && (
                      <FormField
                        control={form.control}
                        name="mpesaPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>M-Pesa Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="Leave blank to use delivery phone number"
                                data-testid="mpesa-phone-input"
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-gray-500">
                              If different from delivery phone number
                            </p>
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Shield className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-green-900">Secure Payment</p>
                          <p className="text-green-700">
                            Your payment information is protected with bank-level security. We never store your payment details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isProcessingPayment || createOrderMutation.isPending}
                  data-testid="place-order-button"
                >
                  {isProcessingPayment || createOrderMutation.isPending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Place Order - KSh {total.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item: any) => {
                    const product = item.product;
                    const itemTotal = parseFloat(product?.price || "0") * item.quantity;
                    
                    return (
                      <div key={item.id} className="flex items-center space-x-3" data-testid={`order-item-${item.id}`}>
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                          <img
                            src={product?.images?.[0] || "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"}
                            alt={product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product?.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × KSh {product?.price}
                          </p>
                        </div>
                        <p className="font-medium text-sm">
                          KSh {itemTotal.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span data-testid="checkout-subtotal">KSh {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span data-testid="checkout-delivery-fee">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        `KSh ${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {subtotal < 1000 && deliveryFee > 0 && (
                    <p className="text-xs text-gray-500">
                      Add KSh {(1000 - subtotal).toFixed(2)} more for free delivery
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary" data-testid="checkout-total">
                    KSh {total.toFixed(2)}
                  </span>
                </div>

                {/* Security Badges */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Shield className="h-3 w-3 mr-1" />
                      Secure
                    </div>
                    <div className="flex items-center">
                      <Smartphone className="h-3 w-3 mr-1" />
                      M-Pesa
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
