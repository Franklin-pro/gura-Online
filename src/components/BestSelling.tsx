
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ProductProps {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
}

const bestSellingProducts: ProductProps[] = [
  {
    id: 1,
    name: "Women's Pink Jacket",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1136&q=80",
    price: 69.99,
    rating: 4.9,
    reviews: 120
  },
  {
    id: 2,
    name: "Luxury Travel Bag",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=876&q=80",
    price: 89.99,
    rating: 4.8,
    reviews: 87
  },
  {
    id: 3,
    name: "RGB CPU Cooler",
    image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
    price: 59.99,
    rating: 4.7,
    reviews: 94
  },
  {
    id: 4,
    name: "Wooden Side Table",
    image: "https://images.unsplash.com/photo-1565374395542-0ce18882c857?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    price: 119.99,
    rating: 4.6,
    reviews: 56
  }
];

export default function BestSelling() {
  const isMobile = useIsMobile();
  const [visibleProducts, setVisibleProducts] = useState<ProductProps[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const productsToShow = isMobile ? 2 : 4;
  
  useEffect(() => {
    const updateVisibleProducts = () => {
      setVisibleProducts(
        bestSellingProducts.slice(startIndex, startIndex + productsToShow)
      );
    };
    
    updateVisibleProducts();
  }, [startIndex, isMobile, productsToShow]);
  
  const nextSlide = () => {
    setStartIndex((prev) => 
      prev + productsToShow >= bestSellingProducts.length ? 0 : prev + 1
    );
  };
  
  const prevSlide = () => {
    setStartIndex((prev) => 
      prev === 0 ? Math.max(0, bestSellingProducts.length - productsToShow) : prev - 1
    );
  };
  
  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-8 bg-red-600 rounded-sm"></div>
          <h2 className="text-2xl font-bold">Best Selling Products</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={prevSlide}
            className="p-1 rounded-full border hover:bg-gray-100"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1 rounded-full border hover:bg-gray-100"
            aria-label="Next products"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Button variant="default" className="bg-red-600 hover:bg-red-700 ml-2 hidden md:flex">
            View All
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {visibleProducts.map((product) => (
          <Card key={product.id} className="relative overflow-hidden group border border-gray-200">
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
              <button className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-red-600 transition-colors">
                <Heart className="h-4 w-4" />
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 flex items-center justify-center h-48">
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
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-4 md:hidden">
        <Button variant="default" className="bg-red-600 hover:bg-red-700">
          View All
        </Button>
      </div>
    </section>
  );
}
