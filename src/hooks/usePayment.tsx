import { useState } from "react";
import axios, { AxiosError } from "axios";

type PaymentMethod = "stripe" | "mobile" | "cash";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CardDetails {
  name: string;
  number: string;
  exp_month: string;
  exp_year: string;
  cvc: string;
}

interface StripePaymentData {
  products: Product[];
  couponCode?: string;
}

interface MobilePaymentData {
  amount: number;
  mobileNumber: string;
}

interface CashPaymentData {
  amount: number;
}

interface PaymentData {
  paymentMethod: PaymentMethod;
  // For Stripe checkout
  products?: Product[];
  couponCode?: string;
  // For individual payments
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  routingNumber?: string;
  mobileNumber?: string;
  amount?: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  id?: string; // Stripe session ID
  totalAmount?: number;
  [key: string]: any;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * Retrieves and validates the authentication token
   * @throws {Error} If no token is found
   */
  const getAuthToken = (): string => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please login.');
    }
    console.log('Using token for payment:', token ? 'Token found' : 'No token');
    return token;
  };

  /**
   * Processes a payment based on the payment method
   * @param paymentData The payment data including method and details
   * @returns Promise with the payment result
   */
  const processPayment = async (paymentData: PaymentData): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Common headers for all requests
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      let endpoint: string;
      let requestData: StripePaymentData | MobilePaymentData | CashPaymentData;

      switch (paymentData.paymentMethod) {
        case "stripe": {
          // Add auth header for Stripe
          headers['Authorization'] = `Bearer ${getAuthToken()}`;
          endpoint = "https://gura-online-bn.onrender.com/api/v1/payments/create-checkout-session";
          
          // Validate products array
          if (!paymentData.products || !Array.isArray(paymentData.products) || paymentData.products.length === 0) {
            throw new Error('Products array is required for Stripe payments');
          }

          // Validate each product
          for (const product of paymentData.products) {
            if (!product._id || !product.name || !product.price || product.quantity <= 0) {
              throw new Error('Invalid product data. Each product must have _id, name, price, and quantity > 0');
            }
          }

          requestData = {
            products: paymentData.products,
            couponCode: paymentData.couponCode || undefined
          };
          
          console.log('Stripe checkout data:', requestData);
          break;
        }

        case "mobile": {
          endpoint = "https://gura-online-bn.onrender.com/api/v1/payments/mobile";
          
          if (!paymentData.mobileNumber || !paymentData.amount) {
            throw new Error('Mobile number and amount are required');
          }

          requestData = {
            amount: paymentData.amount,
            mobileNumber: paymentData.mobileNumber
          };
          break;
        }

        case "cash": {
          endpoint = "https://gura-online-bn.onrender.com/api/v1/payments/cash";
          
          if (!paymentData.amount) {
            throw new Error('Amount is required for cash payments');
          }
          
          requestData = {
            amount: paymentData.amount
          };
          break;
        }

        default:
          throw new Error("Invalid payment method");
      }

      console.log('Sending payment request to:', endpoint);
      console.log('Request data:', requestData);
      console.log('Headers:', headers);

      const response = await axios.post<ApiResponse>(endpoint, requestData, { headers });

      console.log('Payment response:', response.status, response.data);

      if (response.status >= 400) {
        throw new Error(response.data.message || "Payment failed");
      }

      setIsSuccess(true);
      return response.data;
    } catch (err: unknown) {
      let errorMessage = "Payment processing failed";
      
      if (axios.isAxiosError(err)) {
        // Handle Axios errors
        const axiosError = err as AxiosError<{ message?: string; error?: string }>;
        console.error('Axios error details:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message
        });
        
        errorMessage = axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      axiosError.message || 
                      "Payment request failed";
                      
        // Handle specific error cases
        if (axiosError.response?.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (axiosError.response?.status === 400) {
          errorMessage = axiosError.response.data?.error || "Invalid payment data";
        }
      } else if (err instanceof Error) {
        // Handle generic errors
        errorMessage = err.message;
      }

      console.error('Payment error:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Helper function to create Stripe checkout session from cart items
   */
  const createStripeCheckout = async (cartItems: Product[], couponCode?: string): Promise<ApiResponse> => {
    return processPayment({
      paymentMethod: 'stripe',
      products: cartItems,
      couponCode
    });
  };

  return { 
    processPayment,
    createStripeCheckout,
    isLoading, 
    error, 
    isSuccess,
    reset: () => {
      setError(null);
      setIsSuccess(false);
    }
  };
};