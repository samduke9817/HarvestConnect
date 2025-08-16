import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import ProductCard from "@/components/ui/product-card";
import CategoryFilter from "@/components/ui/category-filter";
import { Search, Filter, Package } from "lucide-react";

export default function Products() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState("newest");

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products", { 
      search: searchQuery || undefined, 
      categoryId: selectedCategory 
    }],
  });

  const sortedProducts = [...products].sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? undefined : categoryId);
  };

  return (
    <div className="min-h-screen bg-neutral-warm">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Fresh Produce</h1>
          <p className="text-gray-600">
            Discover fresh, local produce from verified farmers across Kenya
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for products, farmers, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="product-search-input"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger data-testid="sort-select">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Toggle for Mobile */}
            <Button variant="outline" className="lg:hidden" data-testid="filter-toggle">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Categories */}
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedCategory 
                  ? `${categories.find((c: any) => c.id === selectedCategory)?.name} Products`
                  : "All Products"
                }
              </h2>
              <p className="text-sm text-gray-600">
                {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {selectedCategory && (
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(undefined)}
                data-testid="clear-category-filter"
              >
                Clear Filter
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }, (_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedCategory 
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "No products are currently available. Check back soon!"
                  }
                </p>
                {(searchQuery || selectedCategory) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory(undefined);
                    }}
                    data-testid="clear-all-filters"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Load More */}
        {sortedProducts.length > 0 && sortedProducts.length % 12 === 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg" data-testid="load-more-button">
              Load More Products
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
