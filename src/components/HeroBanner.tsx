import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  createdAt: string;
}

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest products
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch(
          "https://gura-online-bn.onrender.com/api/v1/products"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Only take first 3 products
        setBanners(data.data.slice(0, 3));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    );
  };

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  if (loading) {
    return (
      <div className="min-h-[300px] md:min-h-[400px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] md:min-h-[400px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="min-h-[300px] md:min-h-[400px] flex items-center justify-center">
        No products found
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gray-100">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {banners.map((product, index) => (
          <div
            key={product._id}
            className={`min-w-full relative bg-black text-white`}
          >
            <div className="container mx-auto flex flex-col md:flex-row items-center px-4 py-8 min-h-[300px] md:min-h-[400px]">
              <div className="md:w-1/2 space-y-4 z-10">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {product.name}
                </h2>
                <p className="text-lg opacity-90">
                  {product.description || "Premium quality product"}
                </p>
                <p className="text-xl font-semibold">${product.price}</p>
                <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                  Shop Now
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center items-center">
                <img
                  src={product?.image || "https://via.placeholder.com/500"}
                  alt={product.name}
                  className="max-h-[300px] object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === activeIndex ? "bg-red-600 w-6" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation buttons - only show if there are multiple banners */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  );
}
