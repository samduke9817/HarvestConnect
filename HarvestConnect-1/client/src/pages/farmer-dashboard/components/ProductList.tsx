import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react";
import ProductCard from "@/components/ui/product-card";

interface ProductListProps {
  products: any[];
  onEditProduct: (product: any) => void;
  onDeleteProduct: (productId: number) => void;
}

export function ProductList({ products, onEditProduct, onDeleteProduct }: ProductListProps) {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Products ({products.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">
                        KSh {product.price} per {product.unit}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </Badge>
                        {product.isOrganic && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Organic
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                 
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditProduct(product)}
                      data-testid={`edit-product-${product.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteProduct(product.id)}
                      data-testid={`delete-product-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600">Add your first product to start selling.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}