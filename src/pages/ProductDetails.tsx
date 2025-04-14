
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// Sample product data - in a real app, this would come from an API
import { exploreProducts } from "@/data/products";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, addToFavorites, favorites } = useShop();
  const [quantity, setQuantity] = useState(1);
  
  const product = exploreProducts.find(p => p.id === parseInt(id || "0"));
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Button className="mt-4 bg-red-600 hover:bg-red-700" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const isInFavorites = favorites.some(item => item.id === product.id);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
  };
  
  const handleAddToFavorites = () => {
    addToFavorites(product);
    toast.success("Added to favorites");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-50 p-6 rounded-lg flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-h-96 object-contain"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "h-4 w-4 fill-current",
                      i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>
            
            <div className="text-2xl font-bold text-red-600">
              ${product.price.toFixed(2)}
            </div>
            
            <p className="text-gray-600">
              {product.description || "This premium product offers exceptional quality and performance. Designed with the user in mind, it combines innovative technology with elegant design to provide an unmatched experience."}
            </p>
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={decreaseQuantity} 
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  onClick={increaseQuantity} 
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                className={`flex-1 ${isInFavorites ? "text-red-600 border-red-600" : ""}`}
                onClick={handleAddToFavorites}
              >
                <Heart className={`mr-2 h-5 w-5 ${isInFavorites ? "fill-red-600" : ""}`} /> 
                {isInFavorites ? "Added to Favorites" : "Add to Favorites"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
