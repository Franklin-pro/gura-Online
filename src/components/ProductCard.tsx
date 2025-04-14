
import { Card } from "@/components/ui/card";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useShop, Product } from "@/context/ShopContext";
import { toast } from "@/components/ui/sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, addToFavorites, favorites } = useShop();
  
  const isInFavorites = favorites.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart");
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToFavorites(product);
    toast.success("Added to favorites");
  };

  return (
    <Card className="relative overflow-hidden group border border-gray-200">
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
        <button 
          className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors"
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isInFavorites ? "fill-red-600 text-red-600" : ""}`} />
        </button>
      </div>
      
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-gray-50 p-4 flex items-center justify-center h-40 md:h-48">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
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
            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-1 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;
