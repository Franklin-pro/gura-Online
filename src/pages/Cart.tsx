import { useState, useEffect } from "react";
import { Trash2, ChevronRight, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/sonner";
import Checkout from "@/components/Checkout";
import axios from "axios";
import {loadStripe} from "@stripe/stripe-js";

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const stripePromise = loadStripe("pk_test_51PWDtVACBJNi3q8ryB7BJr0zXmsCZnyoHgnaOnAVtJ4qYRpTAS0kUZtFLmlDZajE8BJpwCnu53WS1UpUlJhIuATs00MWAIo7bP");

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

      const fetchCartItems = async () => {
      try {
        const response = await axios.get("https://gura-online-bn.onrender.com/api/v1/carts",{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCartItems(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch cart items");
        toast.error("Failed to load your cart");
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
    
    fetchCartItems();
  }, []);
  
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
const handleCheckout = async () => {
  const stripe = await stripePromise;

  try {
    const response = await axios.post("https://gura-online-bn.onrender.com/api/v1/payments/create-checkout-session", {
      products: cartItems,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const sessionId = response.data.id; // ✅ Correct

    if (stripe) {
      const result = await stripe.redirectToCheckout({ sessionId }); // ✅ Correct

      if (result.error) {
        toast.error(result.error.message || "Stripe redirect failed");
      }
    } else {
      toast.error("Stripe failed to load.");
    }
  } catch (err) {
    toast.error("Checkout failed. Please try again.");
    console.error("Checkout error:", err);
  }
};


const handleRemove = async (id: string) => { // Make sure id is string type
  try {
    const response = await axios.delete(`https://gura-online-bn.onrender.com/api/v1/carts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });

    // Use _id for comparison since that's what MongoDB uses
    setCartItems(cartItems.filter(item => item._id !== id));
    toast.success(response.data.message);
    
    // Optional: Refresh cart data
    fetchCartItems();
    setLoading(true);
    
  } catch (err) {
    toast.error("Failed to remove item");
    console.error("Delete error:", err);
  }
};
  
  const handleClear = async () => {
    try {
      await axios.delete("/api/v1/carts",{
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
  
  if (showCheckout) {
    return <Checkout onBack={() => setShowCheckout(false)} />;
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
          <div className="text-center text-red-500 font-bold py-16">
            <p><Loader className="w-10 h-10  border-gray-300 border-t-primary rounded-full animate-spin"/>Loading your cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
          <div className="text-center py-16">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Browse our products and find something you like!</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                <div className="h-24 w-24 bg-gray-50 flex items-center justify-center rounded-md flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="max-h-full max-w-full object-contain" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-red-600 font-bold">${item.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                
                <button 
                  onClick={() => handleRemove(item.id)} 
                  className="text-gray-500 hover:text-red-600 h-8 w-8"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="text-red-600 border-red-600" 
              onClick={handleClear}
            >
              Clear Cart
            </Button>
          </div>
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full bg-red-600 hover:bg-red-700 mb-4"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}

            >
              Proceed to Checkout
            </Button>
            
            <Link to="/" className="flex items-center justify-center text-sm text-gray-600 hover:text-red-600">
              <ChevronRight className="h-4 w-4 rotate-180" /> Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;