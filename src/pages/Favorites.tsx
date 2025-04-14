
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useShop } from "@/context/ShopContext";
import { toast } from "@/components/ui/sonner";
import ProductCard from "@/components/ProductCard";

const Favorites = () => {
  const { favorites, removeFromFavorites } = useShop();
  
  const handleRemove = (id: number) => {
    removeFromFavorites(id);
    toast.success("Item removed from favorites");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-4">No favorites yet</h2>
            <p className="text-gray-500 mb-6">Browse our products and add some to your favorites!</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link to="/">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map(product => (
              <div key={product.id} className="relative">
                <button 
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-2 left-2 z-20 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
