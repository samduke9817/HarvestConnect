import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface ProductFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  categories: any[];
  isPending?: boolean;
  isEditing?: boolean;
  onCancel?: () => void;
}

export function ProductForm({ 
  form, 
  onSubmit, 
  categories, 
  isPending = false, 
  isEditing = false,
  onCancel 
}: ProductFormProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="product-name-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                    <FormControl>
                      <SelectTrigger data-testid="category-select">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (KSh) *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="price-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <FormControl>
                      <Input placeholder="kg, piece, bunch" {...field} data-testid="unit-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      data-testid="stock-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3}
                      placeholder="Describe your product..."
                      data-testid="product-description-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isPending}
                data-testid="save-product-button"
              >
                {isPending 
                  ? "Saving..." 
                  : isEditing 
                    ? "Update Product" 
                    : "Add Product"
                }
              </Button>
             
              {isEditing && onCancel && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}