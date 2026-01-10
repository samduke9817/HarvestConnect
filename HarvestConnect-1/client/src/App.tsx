import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";

const Landing = lazy(() => import("@/pages/landing"));
const Home = lazy(() => import("@/pages/home"));
const Products = lazy(() => import("@/pages/products"));
const ProductDetail = lazy(() => import("@/pages/product-detail"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const Cart = lazy(() => import("@/pages/cart"));
const Checkout = lazy(() => import("@/pages/checkout"));
const FarmerDashboard = lazy(() => import("@/pages/farmer-dashboard"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
  </div>
);
