// Updated ProductCard with Review Rendering Fix

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

  const isInFavorites = favorites.some((item) => item.id === product.id);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsTokenReady(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  // Calculate average rating from reviews
  const calculateAverageRating = () => {
    if (!product.reviews || product.reviews.length === 0) {
      return 0;
    }

    const sum = product.reviews.reduce((total, review) => total + review.rating, 0);
    return sum / product.reviews.length;
  };

  const averageRating = calculateAverageRating();
  const reviewCount = product.reviews?.length || 0;

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      throw new Error("No authentication token found");
    }
    return token;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = getAuthToken();
      const response = await axios.post(
        "https://gura-online-bn.onrender.com/api/v1/carts",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success("Added to cart");
        addToCart(product);
      }
    } catch (error: any) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = getAuthToken();
      await axios.post(
        "https://gura-online-bn.onrender.com/api/v1/favorites",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addToFavorites(product);
      toast.success(isInFavorites ? "Removed from favorites" : "Added to favorites");
    } catch (error: any) {
      console.error("Favorite error:", error);
      toast.error(error.response?.data?.message || "Failed to update favorites");
    }
  };

  if (!product || !product._id) return null;

  return (
    <Card className="relative overflow-hidden group border border-gray-200">
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        <button
          onClick={handleToggleFavorite}
          className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors"
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
            {product.discount > 0 && (
              <span className="text-xs line-through text-gray-500">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center text-sm">
            <div className="flex text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3 fill-current",
                      i < Math.floor(averageRating) ? "text-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {averageRating.toFixed(1)} {reviewCount > 0 && `(${reviewCount} reviews)`}
            </span>
          </div>

          {/* Render individual reviews if you want */}
          {/* <div className="text-xs text-gray-600">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div key={review._id} className="mt-1">
                  {review.user.name || "Anonymous"}: {review.rating} ★
                </div>
              ))
            ) : (
              <div>No reviews yet</div>
            )}
          </div> */}

          <button
            onClick={handleAddToCart}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
            disabled={!isTokenReady}
          >
            <ShoppingCart className="h-4 w-4" />
            {isTokenReady ? "Add to Cart" : "Login Required"}
          </button>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;