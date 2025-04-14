
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ProductProps {
  id: number;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviews: number;
}

const flashSaleProducts: ProductProps[] = [
  {
    id: 1,
    name: "Game Wireless Controller",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    currentPrice: 49.99,
    originalPrice: 79.99,
    discount: 37,
    rating: 4.8,
    reviews: 142
  },
  {
    id: 2,
    name: "RGB Gaming Keyboard",
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    currentPrice: 89.99,
    originalPrice: 129.99,
    discount: 30,
    rating: 4.7,
    reviews: 98
  },
  {
    id: 3,
    name: "27\" Gaming Monitor",
    image: "https://images.unsplash.com/photo-1616865582581-55212d8b7b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1333&q=80",
    currentPrice: 199.99,
    originalPrice: 299.99,
    discount: 33,
    rating: 4.9,
    reviews: 76
  },
  {
    id: 4,
    name: "Modern Dining Chair",
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80",
    currentPrice: 59.99,
    originalPrice: 89.99,
    discount: 33,
    rating: 4.5,
    reviews: 54
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    currentPrice: 39.99,
    originalPrice: 69.99,
    discount: 43,
    rating: 4.6,
    reviews: 112
  }
];

export default function FlashSales() {
  const [countdown, setCountdown] = useState({
    hours: 3,
    minutes: 23,
    seconds: 19,
    milliseconds: 56
  });
  
  const isMobile = useIsMobile();
  const [visibleProducts, setVisibleProducts] = useState<ProductProps[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const productsToShow = isMobile ? 2 : 4;
  
  useEffect(() => {
    const updateVisibleProducts = () => {
      setVisibleProducts(
        flashSaleProducts.slice(startIndex, startIndex + productsToShow)
      );
    };
    
    updateVisibleProducts();
  }, [startIndex, isMobile, productsToShow]);
  
  const nextSlide = () => {
    setStartIndex((prev) => 
      prev + productsToShow >= flashSaleProducts.length ? 0 : prev + 1
    );
  };
  
  const prevSlide = () => {
    setStartIndex((prev) => 
      prev === 0 ? Math.max(0, flashSaleProducts.length - productsToShow) : prev - 1
    );
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let newMilliseconds = prev.milliseconds - 1;
        let newSeconds = prev.seconds;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newMilliseconds < 0) {
          newMilliseconds = 99;
          newSeconds -= 1;
        }
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        
        if (newHours < 0) {
          newHours = 23;
        }
        
        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
          milliseconds: newMilliseconds
        };
      });
    }, 10);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-8 bg-red-600 rounded-sm"></div>
          <h2 className="text-2xl font-bold">Flash Sales</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="bg-gray-900 text-white rounded-md px-2 py-1 flex items-center justify-center text-sm md:text-base">
              {String(countdown.hours).padStart(2, '0')}
            </div>
            <div className="bg-gray-900 text-white rounded-md px-2 py-1 flex items-center justify-center text-sm md:text-base">
              {String(countdown.minutes).padStart(2, '0')}
            </div>
            <div className="bg-gray-900 text-white rounded-md px-2 py-1 flex items-center justify-center text-sm md:text-base">
              {String(countdown.seconds).padStart(2, '0')}
            </div>
            <div className="bg-gray-900 text-white rounded-md px-2 py-1 flex items-center justify-center text-sm md:text-base">
              {String(countdown.milliseconds).padStart(2, '0')}
            </div>
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
          </div>
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
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                -{product.discount}%
              </div>
              
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold">${product.currentPrice.toFixed(2)}</span>
                <span className="text-gray-500 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
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
              
              <Button 
                variant="default" 
                size="sm" 
                className="w-full bg-red-600 hover:bg-red-700 mt-2"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
          View All Products
        </Button>
      </div>
    </section>
  );
}
