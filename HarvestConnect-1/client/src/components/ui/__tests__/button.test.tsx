import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../button";

describe("Button", () => {
  it("renders button text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("applies disabled state when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies variant classes correctly", () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    expect(container.querySelector("button")).toHaveClass("variant-outline");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});