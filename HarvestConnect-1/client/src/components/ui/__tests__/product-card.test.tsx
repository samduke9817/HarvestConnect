import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductCard from "../product-card";

const mockProduct = {
  id: 1,
  name: "Fresh Spinach",
  description: "Organic spinach from local farm",
  price: "50",
  unit: "kg",
  stock: 100,
  rating: "4.5",
  totalReviews: 12,
  categoryId: 1,
  isOrganic: true,
  images: [],
  createdAt: new Date().toISOString(),
};

describe("ProductCard", () => {
  it("renders product name", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByTestId("product-name-1")).toHaveTextContent("Fresh Spinach");
  });

  it("renders product price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByTestId("product-price-1")).toHaveTextContent("KSh 50");
  });

  it("displays organic badge when product is organic", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/organic/i)).toBeInTheDocument();
  });

  it("displays out of stock overlay when stock is 0", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("disables add to cart button when out of stock", () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    const addToCartButton = screen.getByTestId("add-to-cart-1");
    expect(addToCartButton).toBeDisabled();
  });

  it("shows correct rating", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/4.5/i)).toBeInTheDocument();
  });

  it("displays farmer info by default", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/farmer info/i)).toBeInTheDocument();
  });

  it("hides farmer info when showFarmerInfo is false", () => {
    render(<ProductCard product={mockProduct} showFarmerInfo={false} />);
    expect(screen.queryByText(/farmer info/i)).not.toBeInTheDocument();
  });
});