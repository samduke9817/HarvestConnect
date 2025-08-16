import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { 
  Sprout, 
  Search, 
  ShoppingCart, 
  Menu, 
  User, 
  Package, 
  BarChart3,
  LogOut,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart"],
    enabled: isAuthenticated,
  });

  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const navigationItems = [
    { href: "/", label: "Home", show: true },
    { href: "/products", label: "Products", show: true },
    { href: "/farmer-dashboard", label: "Dashboard", show: user?.role === 'farmer' },
    { href: "/admin-dashboard", label: "Admin", show: user?.role === 'admin' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sprout className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Kenya Harvest Hub</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Farm to Table</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => 
              item.show && (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`text-gray-700 hover:text-primary transition-colors ${
                    location === item.href ? 'text-primary font-medium' : ''
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input 
                type="text" 
                placeholder="Search fresh produce..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Shopping Cart */}
            {isAuthenticated && (
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative" data-testid="cart-button">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-secondary">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="user-menu">
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user?.firstName && user?.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user?.email
                        }
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {user?.role === 'farmer' && (
                    <DropdownMenuItem asChild>
                      <Link href="/farmer-dashboard" className="flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Farmer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin-dashboard" className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="logout-button">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="outline" onClick={() => window.location.href = '/api/login'} data-testid="signin-button">
                  Sign In
                </Button>
                <Button onClick={() => window.location.href = '/api/login'} data-testid="join-farmer-button">
                  Join as Farmer
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" data-testid="mobile-menu-button">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Sprout className="text-white h-5 w-5" />
                    </div>
                    <span className="font-bold text-gray-900">Kenya Harvest Hub</span>
                  </div>
                  
                  <nav className="flex-1">
                    <ul className="space-y-3">
                      {navigationItems.map((item) => 
                        item.show && (
                          <li key={item.href}>
                            <Link 
                              href={item.href}
                              className={`block py-2 text-gray-700 hover:text-primary transition-colors ${
                                location === item.href ? 'text-primary font-medium' : ''
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item.label}
                            </Link>
                          </li>
                        )
                      )}
                    </ul>
                  </nav>
                  
                  {!isAuthenticated && (
                    <div className="border-t pt-3 space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => window.location.href = '/api/login'}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full" 
                        onClick={() => window.location.href = '/api/login'}
                      >
                        Join as Farmer
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <Input 
            type="text" 
            placeholder="Search fresh produce..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="mobile-search-input"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </form>
      </div>
    </header>
  );
}
