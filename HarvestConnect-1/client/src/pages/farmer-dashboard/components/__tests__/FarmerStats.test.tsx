import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FarmerStats } from "../FarmerStats";

describe("FarmerStats", () => {
  const defaultProps = {
    productsCount: 10,
    ordersCount: 5,
    totalRevenue: 1500,
    averageRating: 4.5,
    totalReviews: 12,
  };

  it("renders all stat cards", () => {
    const { container } = render(<FarmerStats {...defaultProps} />);
    expect(container.textContent).toContain("Total Products");
    expect(container.textContent).toContain("Total Orders");
    expect(container.textContent).toContain("Total Revenue");
    expect(container.textContent).toContain("Rating");
  });

  it("displays correct products count", () => {
    const { container } = render(<FarmerStats {...defaultProps} productsCount={25} />);
    expect(container.textContent).toContain("25");
  });

  it("displays correct orders count", () => {
    const { container } = render(<FarmerStats {...defaultProps} ordersCount={100} />);
    expect(container.textContent).toContain("100");
  });

  it("displays formatted revenue", () => {
    const { container } = render(<FarmerStats {...defaultProps} totalRevenue={2500.75} />);
    expect(container.textContent).toContain("KSh 2,501");
  });

  it("displays correct rating", () => {
    const { container } = render(<FarmerStats {...defaultProps} averageRating={4.8} />);
    expect(container.textContent).toContain("4.8");
  });

  it("displays review count", () => {
    const { container } = render(<FarmerStats {...defaultProps} totalReviews={50} />);
    expect(container.textContent).toContain("50 reviews");
  });
});