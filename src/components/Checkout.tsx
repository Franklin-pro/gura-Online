
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentForm from "./PaymentForm";
import { useShop } from "@/context/ShopContext";

interface CheckoutProps {
  onBack?: () => void;
}

const Checkout = ({ onBack }: CheckoutProps) => {
  const [activeStep, setActiveStep] = useState("shipping");
  const { cartItems, clearCart } = useShop();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentComplete = (paymentMethod: "stripe" | "mobile" | "cash") => {
    console.log(`Payment completed using ${paymentMethod}`);
    clearCart();
    // Here you would typically redirect to a success page or show a success message
    alert("Payment successful! Thank you for your order.");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {onBack && (
        <Button 
          variant="ghost" 
          className="mb-4 pl-1"
          onClick={onBack}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
      )}
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checkout area */}
        <div className="lg:col-span-2">
          <div className="mb-8 flex">
            <button
              className={`flex-1 py-3 font-medium border-b-2 ${
                activeStep === "shipping" ? "border-red-600 text-red-600" : "border-gray-300"
              }`}
              onClick={() => setActiveStep("shipping")}
            >
              Shipping
            </button>
            <button
              className={`flex-1 py-3 font-medium border-b-2 ${
                activeStep === "payment" ? "border-red-600 text-red-600" : "border-gray-300"
              }`}
              onClick={() => setActiveStep("payment")}
            >
              Payment
            </button>
          </div>

          {activeStep === "shipping" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      id="address"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        id="city"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        id="state"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium mb-1">ZIP Code</label>
                      <input
                        type="text"
                        id="zip"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => setActiveStep("payment")}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {activeStep === "payment" && (
            <PaymentForm 
              total={totalPrice} 
              onComplete={handlePaymentComplete} 
            />
          )}
        </div>

        {/* Order Summary sidebar */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="space-y-4 mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="h-16 w-16 bg-white rounded flex items-center justify-center relative">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-gray-200 rounded-full text-xs flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-sm text-red-600 font-bold">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
