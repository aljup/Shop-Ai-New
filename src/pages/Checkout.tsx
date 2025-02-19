
import { useCart } from "@/store/cart";
import { useForm } from "react-hook-form";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

type CheckoutForm = {
  name: string;
  email: string;
  phone: string;
};

const paymentMethods = [
  { id: 'paypal', name: 'PayPal', icon: '💳' },
  { id: 'stcpay', name: 'STC Pay', icon: '📱' },
  { id: 'urpay', name: 'UrPay', icon: '💰' },
  { id: 'mada', name: 'مدى', icon: '🏦' },
];

const Checkout = () => {
  const { items } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const form = useForm<CheckoutForm>();

  const onSubmit = (data: CheckoutForm) => {
    setShowForm(false);
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">الدفع</h1>

          <div className="grid gap-6 px-4 md:grid-cols-[1fr,380px]">
            <div className="space-y-8">
              <div className="bg-card rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-6">اختر وسيلة الدفع</h2>
                <div className="grid grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedPayment === method.id
                          ? 'ring-2 ring-primary'
                          : 'hover:border-primary'
                      }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <span className="font-medium">{method.name}</span>
                        {selectedPayment === method.id && (
                          <Check className="h-4 w-4 ml-auto text-primary" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Button 
                className="w-full"
                disabled={!selectedPayment}
                onClick={() => setShowForm(true)}
              >
                <CreditCard className="w-4 h-4 ml-2" />
                متابعة الدفع
              </Button>
            </div>

            <Card className="border-2 shadow-lg bg-gradient-to-br from-background to-muted/20">
              <CardHeader>
                <CardTitle className="text-xl text-center">ملخص الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-background/50">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">
                        {item.quantity}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex justify-between text-sm text-muted-foreground mb-3">
                    <span>الشحن</span>
                    <span className="text-primary">مجاني</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>الإجمالي</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>معلومات الشخصية</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <DialogFooter>
                  <Button type="submit">إتمام الشراء</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

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
