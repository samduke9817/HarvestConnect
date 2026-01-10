import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

interface OrdersListProps {
  orders: any[];
}

export function OrdersList({ orders }: OrdersListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">KSh {parseFloat(order.totalAmount).toFixed(2)}</p>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        order.status === 'confirmed' ? 'outline' : 'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Orders will appear here when customers purchase your products.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}