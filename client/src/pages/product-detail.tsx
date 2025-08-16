import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/ui/navigation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  MapPin, 
  Truck, 
  Shield, 
  Leaf,
  Calendar,
  Package,
  Plus,
  Minus,
  ThumbsUp
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", id],
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/reviews", { productId: parseInt(id!) }],
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/cart", {
        productId: parseInt(id!),
        quantity,
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to cart",
        description: `${quantity} ${product?.unit} of ${product?.name} added to your cart.`,
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
          window.location.href = "/api/login";
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

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/reviews", {
        productId: parseInt(id!),
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setShowReviewForm(false);
      setReviewData({ rating: 5, comment: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to submit a review.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-warm">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-warm">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
              <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/products")}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"];

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : parseFloat(product.rating || "0");

  return (
    <div className="min-h-screen bg-neutral-warm">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/products")}
          className="mb-6"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-main-image"
              />
            </div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                    data-testid={`product-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900" data-testid="product-name">
                  {product.name}
                </h1>
                <Button variant="ghost" size="icon" data-testid="wishlist-button">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
                
                {product.isOrganic && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </Badge>
                )}
              </div>

              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-primary" data-testid="product-price">
                  KSh {product.price}
                </span>
                <span className="text-gray-500">per {product.unit}</span>
              </div>

              <p className="text-gray-600 leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </div>

            {/* Farmer Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Farmer Details</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      Location information
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Package className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium">Stock</p>
                  <p className="text-sm text-gray-600">{product.stock} {product.unit} available</p>
                </div>
              </div>
              
              {product.harvestDate && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium">Harvested</p>
                    <p className="text-sm text-gray-600">
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <Truck className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium">Delivery</p>
                  <p className="text-sm text-gray-600">1-2 days</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium">Quality</p>
                  <p className="text-sm text-gray-600">Guaranteed fresh</p>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                    min="1"
                    max={product.stock}
                    data-testid="quantity-input"
                  />
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    data-testid="increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-500">
                    {product.unit}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending || product.stock < 1}
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {addToCartMutation.isPending 
                  ? "Adding to Cart..." 
                  : product.stock < 1 
                    ? "Out of Stock" 
                    : `Add to Cart - KSh ${(parseFloat(product.price) * quantity).toFixed(2)}`
                }
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customer Reviews</CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setShowReviewForm(!showReviewForm)}
                data-testid="write-review-button"
              >
                Write a Review
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showReviewForm && (
              <div className="border-b pb-6 mb-6">
                <h3 className="font-medium mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <Select 
                      value={reviewData.rating.toString()} 
                      onValueChange={(value) => setReviewData({ ...reviewData, rating: parseInt(value) })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <Textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      data-testid="review-comment-input"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => submitReviewMutation.mutate()}
                      disabled={submitReviewMutation.isPending}
                      data-testid="submit-review-button"
                    >
                      {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="flex text-yellow-400 text-sm">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'fill-current' : ''}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful
                      </Button>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">Be the first to review this product!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
