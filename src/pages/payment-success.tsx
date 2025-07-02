import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import axios from "axios";
import { CheckCircle } from "lucide-react"
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { toast } from "@/components/ui/sonner";

export default function PaymentSuccess() {

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [amountPaid, setAmountPaid] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<[]>([]);

  const handleClear = async () => {
    try {
      await axios.delete("https://gura-online-bn.onrender.com/api/v1/carts",{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (err) {
      toast.error("Failed to clear cart");
    }
  };

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId:string) => {
      setIsProcessing(true);
      try {
        const response = await axios.post("/api/v1/payments/checkout-success", { sessionId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSuccess(true);
        setTransactionId(response.data.transactionId);
        setAmountPaid(response.data.amountPaid);
        setCartItems(response.data.cartItems || []);
        toast.success("Payment successful!");
      } catch (err) {
        setError("Payment failed. Please try again.");
        toast.error("Payment failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Payment Successful!</h1>
        <div className="space-y-2 text-gray-600">
          <p className="text-sm">Transaction Number: 14953829359</p>
          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between py-2">
              <span>Amount Paid:</span>
              <span className="font-semibold">$250</span>
            </div>
            <div className="flex justify-between">
              <span>Bank:</span>
              <span>Mellat Bank</span>
            </div>
            
          </div>
          <p className="text-sm">Thank you for your purchase! Your order is being processed.</p>
        </div>
        <Button asChild className="w-full bg-red-500 hover:bg-red-600">
          <Link to="/profile">View Orders</Link>
        </Button>
        <Button asChild  className="w-full bg-gray-500 hover:bg-gray-300">
          <Link to="/">Continue Shopping</Link></Button>
      </Card>
    </div>
  )
}