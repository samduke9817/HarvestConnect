import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { ProductList } from "../ProductList";

const mockProducts = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: "50",
    unit: "kg",
    stock: 100,
    isOrganic: true,
  },
  {
    id: 2,
    name: "Organic Lettuce",
    price: "30",
    unit: "bunch",
    stock: 0,
    isOrganic: false,
  },
];

describe("ProductList", () => {
  it("renders product list when products exist", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <ProductList 
        products={mockProducts} 
        onEditProduct={onEdit} 
        onDeleteProduct={onDelete} 
      />
    );
    
    expect(screen.getByText("Your Products (2)")).toBeInTheDocument();
    expect(screen.getByText("Fresh Tomatoes")).toBeInTheDocument();
    expect(screen.getByText("Organic Lettuce")).toBeInTheDocument();
  });

  it("displays empty state when no products", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <ProductList 
        products={[]} 
        onEditProduct={onEdit} 
        onDeleteProduct={onDelete} 
      />
    );
    
    expect(screen.getByText("Your Products (0)")).toBeInTheDocument();
    expect(screen.getByText("No products yet")).toBeInTheDocument();
  });

  it("calls onEditProduct when edit button clicked", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <ProductList 
        products={mockProducts} 
        onEditProduct={onEdit} 
        onDeleteProduct={onDelete} 
      />
    );
    
    const editButtons = screen.getAllByRole("button");
    fireEvent.click(editButtons[0]);
    
    expect(onEdit).toHaveBeenCalledWith(mockProducts[0]);
  });

  it("displays organic badge for organic products", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <ProductList 
        products={mockProducts} 
        onEditProduct={onEdit} 
        onDeleteProduct={onDelete} 
      />
    );
    
    expect(screen.getByText("Organic")).toBeInTheDocument();
  });

  it("displays out of stock badge for out of stock products", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    
    render(
      <ProductList 
        products={mockProducts} 
        onEditProduct={onEdit} 
        onDeleteProduct={onDelete} 
      />
    );
    
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });
});