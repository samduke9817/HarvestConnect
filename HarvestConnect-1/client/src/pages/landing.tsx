import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Sprout, Search, ShoppingCart, Smartphone, Truck, Heart, Star, Shield, Leaf, HandHeart } from "lucide-react";

export default function Landing() {
  const categories = [
    { name: "Fruits", icon: "🍎", count: "120+ items", color: "bg-yellow-100 hover:bg-yellow-200" },
    { name: "Vegetables", icon: "🥕", count: "85+ items", color: "bg-green-100 hover:bg-green-200" },
    { name: "Grains", icon: "🌾", count: "45+ items", color: "bg-yellow-100 hover:bg-yellow-200" },
    { name: "Dairy", icon: "🧀", count: "30+ items", color: "bg-blue-100 hover:bg-blue-200" },
    { name: "Herbs", icon: "🌿", count: "25+ items", color: "bg-green-100 hover:bg-green-200" },
    { name: "Livestock", icon: "🥚", count: "15+ items", color: "bg-orange-100 hover:bg-orange-200" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      price: "KSh 120",
      originalPrice: "KSh 150",
      unit: "Per kg",
      farmer: "John Mwangi",
      location: "Kiambu County",
      rating: 4.8,
      reviews: 24,
      stock: "12 kg left",
      badge: "Fresh Today",
      badgeColor: "bg-primary",
    },
    {
      id: 2,
      name: "Fresh Spinach",
      price: "KSh 50",
      unit: "Per bunch",
      farmer: "Mary Wanjiku",
      location: "Nakuru County",
      rating: 4.2,
      reviews: 18,
      stock: "8 bunches left",
      badge: "Organic",
      badgeColor: "bg-green-600",
    },
    {
      id: 3,
      name: "Sweet Bananas",
      price: "KSh 200",
      unit: "Per dozen",
      farmer: "Samuel Kiprop",
      location: "Meru County",
      rating: 5.0,
      reviews: 31,
      stock: "15 dozens left",
      badge: "Premium",
      badgeColor: "bg-yellow-600",
    },
    {
      id: 4,
      name: "Hass Avocados",
      price: "KSh 80",
      unit: "Per piece",
      farmer: "Grace Muthoni",
      location: "Murang'a County",
      rating: 4.6,
      reviews: 12,
      stock: "25 pieces left",
      badge: "Export Quality",
      badgeColor: "bg-primary",
    },
  ];

  const featuredFarmers = [
    {
      name: "John Mwangi",
      location: "Kiambu County",
      experience: "15+ years experience",
      description: "I specialize in organic vegetables and have been farming for over 15 years. My passion is growing healthy food for families across Kenya.",
      rating: 4.9,
      reviews: "120+ reviews",
    },
    {
      name: "Mary Wanjiku",
      location: "Nakuru County",
      experience: "Organic Certified",
      description: "I focus on sustainable farming practices and grow the freshest leafy greens. Every harvest is done with care for both quality and environment.",
      rating: 4.6,
      reviews: "85+ reviews",
    },
    {
      name: "Samuel Kiprop",
      location: "Meru County",
      experience: "Fruit Specialist",
      description: "My family has been growing premium fruits for three generations. We take pride in delivering the sweetest, most nutritious fruits in Kenya.",
      rating: 5.0,
      reviews: "200+ reviews",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-warm">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Sprout className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Kenya Harvest Hub</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Farm to Table</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input 
                  type="text" 
                  placeholder="Search fresh produce..." 
                  className="pl-10"
                  data-testid="search-input"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative" onClick={() => window.location.href = '/cart'} data-testid="cart-button">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-secondary">3</Badge>
              </Button>
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="outline" onClick={() => window.location.href = '/api/login'} data-testid="signin-button">
                  Sign In
                </Button>
                <Button onClick={() => window.location.href = '/api/login'} data-testid="join-farmer-button">
                  Join as Farmer
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search fresh produce..." 
              className="pl-10"
              data-testid="mobile-search-input"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Fresh from <span className="text-yellow-300">Kenyan Farms</span> to Your Table
              </h2>
              <p className="text-lg lg:text-xl mb-8 text-green-50">
                Connect directly with local farmers. Get the freshest produce while supporting sustainable agriculture and fair prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary-dark text-white"
                  onClick={() => window.location.href = '/products'}
                  data-testid="start-shopping-button"
                >
                  Start Shopping
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white bg-white text-primary hover:bg-primary hover:text-white"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="become-supplier-button"
                >
                  Become a Supplier
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Fresh vegetables at Kenyan farmers market" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Shop by Category</h3>
            <Button variant="ghost" onClick={() => window.location.href = '/products'} data-testid="view-all-categories">
              View All <span className="ml-1">→</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link key={index} href="/products">
                <div className="text-center group cursor-pointer" data-testid={`category-${category.name.toLowerCase()}`}>
                  <div className={`${category.color} rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center transition-colors`}>
                    <span className="text-2xl">{category.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{category.name}</p>
                  <p className="text-xs text-gray-500">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Fresh Today</h3>
              <p className="text-gray-600 mt-1">Handpicked by our farming community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow" data-testid={`product-card-${product.id}`}>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-3 left-3 ${product.badgeColor} text-white`}>
                    {product.badge}
                  </Badge>
                  <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-white bg-opacity-90 hover:bg-opacity-100">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{product.price}</p>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-500 line-through">{product.originalPrice}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{product.farmer}</p>
                      <p className="text-xs text-gray-500">{product.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 text-sm">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">{product.rating} ({product.reviews})</span>
                    </div>
                    <span className="text-xs text-gray-500">{product.stock}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => window.location.href = '/api/login'}
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/products'} data-testid="load-more-products">
              Load More Products
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How Kenya Harvest Hub Works</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connecting farmers and consumers in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary bg-opacity-10 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Browse & Select</h4>
              <p className="text-gray-600">
                Discover fresh produce from verified local farmers. Filter by location, category, and rating to find exactly what you need.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary bg-opacity-10 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Order & Pay</h4>
              <p className="text-gray-600">
                Place your order and pay securely using M-Pesa or other preferred payment methods. Track your order in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 bg-opacity-10 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Fresh Delivery</h4>
              <p className="text-gray-600">
                Receive fresh produce delivered directly from the farm to your doorstep. Support local farmers while getting the best quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Spotlight */}
      <section className="py-16 bg-earth-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Farmers</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get to know the hardworking farmers behind your fresh produce
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFarmers.map((farmer, index) => (
              <Card key={index} className="overflow-hidden" data-testid={`farmer-card-${index}`}>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" 
                    alt={`Farmer ${farmer.name}`}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute bottom-4 left-4 bg-primary text-white">
                    {farmer.experience}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 mr-3"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{farmer.name}</h4>
                      <p className="text-sm text-gray-500">{farmer.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{farmer.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex text-yellow-400 text-sm mb-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(farmer.rating) ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{farmer.rating} rating • {farmer.reviews}</p>
                    </div>
                    <Button variant="ghost" className="text-primary hover:text-primary-dark">
                      View Profile →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Kenya Harvest Hub?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary bg-opacity-10 rounded-lg p-3 mr-4">
                    <HandHeart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Fair Prices for Farmers</h4>
                    <p className="text-gray-600">Direct connection eliminates middlemen, ensuring farmers get fair compensation for their hard work.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-600 bg-opacity-10 rounded-lg p-3 mr-4">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Fresh & Sustainable</h4>
                    <p className="text-gray-600">Farm-to-table freshness with sustainable farming practices that protect our environment.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-secondary bg-opacity-10 rounded-lg p-3 mr-4">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quality Guaranteed</h4>
                    <p className="text-gray-600">Every farmer is verified and products are quality-checked before reaching your table.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-600 bg-opacity-10 rounded-lg p-3 mr-4">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Easy M-Pesa Payments</h4>
                    <p className="text-gray-600">Seamless mobile payments through M-Pesa and other popular payment methods in Kenya.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-gray-600">Verified Farmers</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-secondary mb-2">2,000+</div>
                <p className="text-gray-600">Happy Customers</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
                <p className="text-gray-600">Orders Delivered</p>
              </Card>
              <Card className="text-center p-6">
                <div className="text-3xl font-bold text-earth-brown mb-2">25+</div>
                <p className="text-gray-600">Counties Served</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Sprout className="text-white h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Kenya Harvest Hub</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting Kenyan farmers directly with consumers for fresh, fair-trade produce.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Browse Products</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find Farmers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Become a Supplier</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Order Tracking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns & Refunds</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Contact & Payment */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-400">
                <p>+254 700 123 456</p>
                <p>info@kenyaharvesthub.co.ke</p>
                <p>Nairobi, Kenya</p>
              </div>
              <div className="mt-4">
                <h5 className="font-medium mb-2">We Accept</h5>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-600 text-white">M-PESA</Badge>
                  <span className="text-gray-400">Visa • Mastercard</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Kenya Harvest Hub. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
