import { useState, useEffect } from "react";

function encodeSVG(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const TINY_PLACEHOLDERS: Record<number, string> = {
  1: encodeSVG('<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#22c55e"/></svg>'),
  2: encodeSVG('<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#f97316"/></svg>'),
  3: encodeSVG('<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#facc15"/></svg>'),
  4: encodeSVG('<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#ef4444"/></svg>'),
  5: encodeSVG('<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#8b5cf6"/></svg>'),
};

const DEFAULT_PLACEHOLDER = encodeSVG('<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="#e5e7eb"/></svg>');

export function getPlaceholder(categoryId: number): string {
  return TINY_PLACEHOLDERS[categoryId] || DEFAULT_PLACEHOLDER;
}

interface ProductImageProps {
  src: string;
  alt: string;
  categoryId?: number;
  className?: string;
  loading?: "lazy" | "eager";
}

export function ProductImage({ 
  src, 
  alt, 
  categoryId, 
  className = "",
  loading = "lazy"
}: ProductImageProps) {
  const [imageSrc, setImageSrc] = useState(() => 
    categoryId ? getPlaceholder(categoryId) : DEFAULT_PLACEHOLDER
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  if (error) {
    return (
      <div className={"bg-gray-200 flex items-center justify-center " + className}>
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={"transition-opacity duration-300 " + (isLoaded ? 'opacity-100' : 'opacity-50') + " " + className}
      loading={loading}
    />
  );
}