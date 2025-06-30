import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useShop, Product } from "@/context/ShopContext";
import { toast } from "@/components/ui/sonner";
import axios from "axios";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToFavorites, favorites } = useShop();
  const [isTokenReady, setIsTokenReady] = useState(false);
  
  const isInFavorites = favorites.some(item => item.id === product.id);

  // Check token availability on component mount
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsTokenReady(!!token);
    };
    
    checkToken();
    
    // Listen for storage changes (in case token is set in another tab)
    window.addEventListener('storage', checkToken);
    
    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log('Getting auth token:', token ? 'Found' : 'Not found');
    
    if (!token) {
      console.error('No token in localStorage');
      toast.error('Please login to continue');
      throw new Error('No authentication token found');
    }
    
    // Log token details (remove in production)
    console.log('Token length:', token.length);
    console.log('Token starts with:', token.substring(0, 10) + '...');
    
    return token;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Add to cart clicked');
      const token = getAuthToken();
      console.log('Token retrieved successfully');
      
      const requestData = {
        productId: product._id,
        quantity: 1,
      };
      
      console.log('Making request with data:', requestData);
      console.log('Request headers will include token');
      
      const response = await axios.post(
        "https://gura-online-bn.onrender.com/api/v1/carts",
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
if(response.status === 201) {
      toast.success('added to cart')
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
}

      if (response.status >= 400) {
        throw new Error(response.data.message || "Failed to add to cart");
      }

      addToCart(product);
      toast.success("Added to cart");
    } catch (error: any) {
      console.error("Add to cart error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // More specific error handling
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        // Optionally redirect to login
        // window.location.href = '/login';
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Please check your permissions.");
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to add to cart");
      }
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Toggle favorite clicked');
      const token = getAuthToken();
      
      const response = await axios.post(
        "https://gura-online-bn.onrender.com/api/v1/favorites",
        { productId: product._id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Favorite response:', response.status, response.data);

      addToFavorites(product);
      const action = isInFavorites ? "Removed from" : "Added to";
      toast.success(`${action} favorites`);
    } catch (error: any) {
      console.error("Favorite error:", error);
      console.error("Favorite error response:", error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to update favorites");
      }
    }
  };

  if (!product || !product._id) return null;

  return (
    <Card className="relative overflow-hidden group border border-gray-200">
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        <button 
          className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors"
          onClick={handleToggleFavorite}
          aria-label={isInFavorites ? "Remove from favorites" : "Add to favorites"}
          disabled={!isTokenReady}
        >
          <Heart className={`h-4 w-4 ${isInFavorites ? "fill-red-600 text-red-600" : ""}`} />
        </button>
      </div>
      
      <Link to={`/product/${product._id}`} className="block">
        <div className="bg-gray-50 p-4 flex items-center justify-center h-40 md:h-48">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        
        <div className="p-4 space-y-2">
          <h3 className="font-medium text-sm truncate">{product.name}</h3>
          
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-bold">${product.price.toFixed(2)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex text-yellow-400">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "h-3 w-3 fill-current",
                    i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
            disabled={!isTokenReady}
          >
            <ShoppingCart className="h-4 w-4" /> 
            {isTokenReady ? 'Add to Cart' : 'Login Required'}
          </button>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;