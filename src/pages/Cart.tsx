
import { useState } from "react";
import { Trash2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { toast } from "@/components/ui/sonner";
import Checkout from "@/components/Checkout";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useShop();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const handleRemove = (id: number) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };
  
  const handleClear = () => {
    clearCart();
    toast.success("Cart cleared");
  };
  
  if (showCheckout) {
    return <Checkout onBack={() => setShowCheckout(false)} />;
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
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
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
              onClick={() => setShowCheckout(true)}
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
