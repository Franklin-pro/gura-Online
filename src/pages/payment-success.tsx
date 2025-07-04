import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

export default function PaymentSuccess() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [amountPaid, setAmountPaid] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        const response = await axios.post(
          "/api/v1/payments/checkout-success",
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setTransactionId(response.data.transactionId);
        setAmountPaid(response.data.amountPaid);
        toast.success("Payment successful!");

        // Clear cart after successful payment
        try {
          await axios.delete("/api/v1/carts", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          toast.success("Cart cleared");
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
          toast.warning("Payment succeeded but cart couldn't be cleared");
        }
      } catch (err) {
        console.error("Payment processing error:", err);
        setError(
          err.response?.data?.message ||
            "Payment verification failed. Please check your orders."
        );
        toast.error(
          err.response?.data?.message ||
            "Payment verification failed. Please check your orders."
        );
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setError("No session ID found. Please check your order history.");
      setIsProcessing(false);
      toast.error("No session ID found. Please check your order history.");
    }
  }, [searchParams]);

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