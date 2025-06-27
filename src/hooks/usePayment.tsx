import { useState } from "react";
import axios from "axios";

type PaymentMethod = "stripe" | "mobile" | "cash";

interface PaymentData {
  paymentMethod: PaymentMethod;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  routingNumber?: string;
  mobileNumber?: string;
  amount: number;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const processPayment = async (paymentData: PaymentData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Adjust the endpoint based on your API
      let endpoint = "";
      switch (paymentData.paymentMethod) {
        case "stripe":
          endpoint = "https://gura-online-bn.onrender.com/api/payments/stripe";
          break;
        case "mobile":
          endpoint = "https://gura-online-bn.onrender.com/api/payments/mobile";
          break;
        case "cash":
          endpoint = "https://gura-online-bn.onrender.com/api/payments/cash";
          break;
      }

      const response = await axios.post(endpoint, paymentData);
     if(response.status === 400) {
        setError(response.data.message);
       console.log("payment failed");
     }
      setIsSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Payment processing failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { processPayment, isLoading, error, isSuccess };
};