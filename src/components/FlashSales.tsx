import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Star, Loader } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import useGetProducts from "@/hooks/useGetProduct";
import ProductCard from "./ProductCard";

interface ProductProps {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  discount: number;
  rating: number;
  reviews: {
    user: any;
    rating: number;
    _id: string;
    createdAt: string;
  }[]; // ✅ Should be an array of review objects, not a number
}


export default function FlashSales() {
  const [countdown, setCountdown] = useState({
    hours: 3,
    minutes: 23,
    seconds: 19,
    milliseconds: 56
  });
  
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const [visibleProducts, setVisibleProducts] = useState<ProductProps[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const productsToShow = isMobile ? 2 : 4;
  const { getProducts } = useGetProducts();
  
  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };
    
    fetchProducts();
  }, []);
  
  // Update visible products when products change or startIndex changes
  useEffect(() => {
    if (products.length > 0) {
      setVisibleProducts(
        products.slice(startIndex, startIndex + productsToShow)
      );
    }
  }, [startIndex, isMobile, productsToShow, products]);
  
  const nextSlide = () => {
    setStartIndex((prev) => 
      prev + productsToShow >= products.length ? 0 : prev + 1
    );
  };
  
  const prevSlide = () => {
    setStartIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - productsToShow) : prev - 1
    );
  };
  
  // Countdown timer
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
  
  // Display loading state while fetching products
  if (loading) {
    return (
      <section className="py-10 container mx-auto px-4">
        <div className="flex justify-center text-red-500 items-center h-64">
          <p className="text-lg spinner flex items-center gap-3"> 
            <Loader className="w-10 h-10  border-gray-300 border-t-primary rounded-full animate-spin"/>
          <p className="font-bold">Loading flash sale products...</p>
          </p>
        </div>
      </section>
    );
  }
  
  // If no products returned from API
  if (products.length === 0) {
    return (
      <section className="py-10 container mx-auto px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">No flash sale products available at the moment.</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-8 bg-red-600 rounded-sm"></div>
          <h2 className="text-2xl font-bold">Featured Products</h2>
          
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
              disabled={products.length <= productsToShow}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1 rounded-full border hover:bg-gray-100"
              aria-label="Next products"
              disabled={products.length <= productsToShow}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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
