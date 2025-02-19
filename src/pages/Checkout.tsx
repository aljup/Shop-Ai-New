import { useCart } from "@/store/cart";
import { useForm } from "react-hook-form";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
};

const Checkout = () => {
  const { items } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const form = useForm<CheckoutForm>();

  const onSubmit = (data: CheckoutForm) => {
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-8">الدفع</h1>

        <div className="mb-8 p-6 bg-card rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4">ملخص الطلب</h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>الإجمالي</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input placeholder="ادخل اسمك الكامل" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="ادخل رقم هاتفك" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ادخل بريدك الإلكتروني" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">إتمام الشراء</Button>
          </form>
        </Form>

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تم استلام طلبك بنجاح</DialogTitle>
            </DialogHeader>
            <p className="text-center text-muted-foreground">
              شكراً لك على طلبك. سنقوم بالتواصل معك قريباً على رقم هاتفك لتأكيد الطلب.
            </p>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Checkout;