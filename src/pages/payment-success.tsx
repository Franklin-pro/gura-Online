import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function PaymentSuccess() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [amountPaid, setAmountPaid] = useState(null);
  const [searchParams] = useSearchParams();

  const [showShippingForm, setShowShippingForm] = useState(true);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  const sessionId = searchParams.get("session_id");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const validateAddress = () => {
    const fields = Object.entries(shippingAddress);
    for (const [key, value] of fields) {
      if (!value.trim()) {
        toast.error(`Please enter ${key}`);
        return false;
      }
    }
    return true;
  };

const handleCheckoutSuccess = async () => {
  if (!validateAddress()) return;

  setIsProcessing(true);
  setError(null); // Reset any previous errors

  try {
    // 1. Send payment confirmation to backend with shipping address
    const response = await axios.post(
      "https://gura-online-bn.onrender.com/api/v1/payments/checkout-success",
      {
        sessionId,
        shippingAddress: {
          name: shippingAddress.name.trim(),
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          zipCode: shippingAddress.zipCode.trim(),
          country: shippingAddress.country.trim(),
          phone: shippingAddress.phone.trim()
        }
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 2. Handle successful response
    if (response.data.success) {
      setTransactionId(response.data.transactionId);
      setAmountPaid(response.data.amountPaid);
      toast.success("Payment successful! Your order has been placed.");

      // 3. Clear the user's cart
      try {
        await axios.delete("https://gura-online-bn.onrender.com/api/v1/carts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        toast.success("Your cart has been cleared");
      } catch (cartError) {
        console.error("Error clearing cart:", cartError);
        toast.warning("Order placed but couldn't clear your cart");
      }
      setShowShippingForm(false);
    } else {
      throw new Error(response.data.message || "Payment verification failed");
    }
  } catch (err) {
    console.error("Payment processing error:", err);
    let errorMessage = "Payment verification failed. Please check your orders.";
    
    if (err.response) {
      // Server responded with error status
      errorMessage = err.response.data.message || errorMessage;
    } else if (err.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your connection.";
    }

    setError(errorMessage);
    toast.error(errorMessage);
    
    // If session is invalid, hide the shipping form
    if (err.response?.status === 404 || err.response?.status === 400) {
      setShowShippingForm(false);
    }
  } finally {
    setIsProcessing(false);
  }
};

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found. Please check your order history.");
      setShowShippingForm(false);
    }
  }, [sessionId]);

  if (isProcessing) {
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Verifying your payment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 space-y-4">
        <h2 className="text-xl font-semibold text-red-500">Error</h2>
        <p className="text-gray-600">{error}</p>
        <div className="mt-4 space-x-4">
          <Button asChild variant="outline">
            <Link to="/profile/orders">Check Orders</Link>
          </Button>
          <Button asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (showShippingForm && sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full p-8 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            Shipping Information
          </h2>
          {[
            { label: "Full Name", name: "name" },
            { label: "Phone Number", name: "phone" },
            { label: "Address", name: "address" },
            { label: "City", name: "city" },
            { label: "State", name: "state" },
            { label: "Zip Code", name: "zipCode" },
            { label: "Country", name: "country" }
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              value={shippingAddress[field.name]}
              onChange={handleInputChange}
              placeholder={field.label}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          ))}
          <Button className="w-full mt-4" onClick={handleCheckoutSuccess}>
            Confirm and Place Order
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment Successful!
        </h1>
        <div className="space-y-2 text-gray-600">
          <p className="text-sm">
            Transaction Number: {transactionId || "Not available"}
          </p>
          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between py-2">
              <span>Amount Paid:</span>
              <span className="font-semibold">
                ${amountPaid?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>Credit Card</span>
            </div>
          </div>
          <p className="text-sm">
            Thank you for your purchase! Your order is being processed.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/profile">View Order Details</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
