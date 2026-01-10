import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface FarmerProfileFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isPending?: boolean;
}

export function FarmerProfileForm({ form, onSubmit, isPending = false }: FarmerProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Farmer Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="farmName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Name *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="farm-name-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="county-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subCounty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub County</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="sub-county-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="experience-input"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={4}
                      placeholder="Tell customers about your farm, farming practices, and what makes your products special..."
                      data-testid="description-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isPending}
              data-testid="save-profile-button"
            >
              {isPending ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}