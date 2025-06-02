import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { usePayment } from "@/hooks/usePayment";
import InputMask from "react-input-mask";

type PaymentMethod = "stripe" | "mobile" | "cash";

interface PaymentFormProps {
  total: number;
  onComplete: (paymentMethod: PaymentMethod) => void;
}

export default function PaymentForm({ total, onComplete }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
  const { processPayment, isLoading, error } = usePayment();

  const form = useForm({
    defaultValues: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
      mobileNumber: "",
      paymentMethod: "stripe",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const amountToPay = paymentMethod === "cash" ? total * 0.4 : total;

      const paymentData = {
        ...data,
        paymentMethod,
        amount: amountToPay,
      };

      await processPayment(paymentData);
      onComplete(paymentMethod);
    } catch (err) {
      console.error("Payment error:", err.message);
    }
  });

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <RadioGroup
                    onValueChange={(value: PaymentMethod) => {
                      setPaymentMethod(value);
                      field.onChange(value);
                    }}
                    defaultValue="stripe"
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <FormLabel
                        htmlFor="stripe"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-500" />
                          <span>Pay with Card</span>
                        </div>
                      </FormLabel>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <FormLabel
                        htmlFor="mobile"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-5 w-5 text-green-500" />
                          <span>Mobile Money</span>
                        </div>
                      </FormLabel>
                    </div>

                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="cash" id="cash" />
                      <FormLabel
                        htmlFor="cash"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Banknote className="h-5 w-5 text-yellow-500" />
                          <span>Cash on Delivery</span>
                        </div>
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormItem>
              )}
            />

            {paymentMethod === "stripe" && (
              <div className="space-y-4 border p-4 rounded-md">
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <InputMask
                        mask="9999 9999 9999 9999"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {(inputProps) => (
                          <Input {...inputProps} placeholder="Card Number" />
                        )}
                      </InputMask>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {paymentMethod === "mobile" && (
              <div className="space-y-4 border p-4 rounded-md">
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <InputMask
                        mask="+999 999 999 9999"
                        value={field.value}
                        onChange={field.onChange}
                      >
                        {(inputProps) => (
                          <Input {...inputProps} placeholder="Mobile Number" />
                        )}
                      </InputMask>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {paymentMethod === "cash" && (
              <div className="border p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  You will pay when your order is delivered. Please make sure to
                  have the exact amount ready.
                </p>
              </div>
            )}

            <div className="pt-4">
              <p className="text-lg font-semibold mb-2">Order Summary</p>
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between py-2 font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete Order"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
