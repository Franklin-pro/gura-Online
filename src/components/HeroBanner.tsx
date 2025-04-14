
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Up to 10% off Voucher",
    description: "Shop the latest electronics and get amazing discounts",
    image: "/public/lovable-uploads/2c843146-6ea5-4591-8f1b-640040194f69.png",
    bgColor: "bg-black",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "New Summer Collection",
    description: "Refresh your wardrobe with our latest styles",
    image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    bgColor: "bg-rose-100",
    textColor: "text-black"
  },
  {
    id: 3,
    title: "Smart Home Devices",
    description: "Transform your living space with cutting-edge technology",
    image: "https://images.unsplash.com/photo-1558002038-1055e2db8410?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    bgColor: "bg-blue-900",
    textColor: "text-white"
  }
];

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };
  
  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative overflow-hidden bg-gray-100">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`min-w-full relative ${banner.bgColor} ${banner.textColor}`}
          >
            <div className="container mx-auto flex flex-col md:flex-row items-center px-4 py-8 min-h-[300px] md:min-h-[400px]">
              <div className="md:w-1/2 space-y-4 z-10">
                <h2 className="text-3xl md:text-4xl font-bold">{banner.title}</h2>
                <p className="text-lg opacity-90">{banner.description}</p>
                <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                  Shop Now
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center items-center">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="max-h-[300px] object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Dots indicator */}
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
      
      {/* Navigation buttons */}
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
    </div>
  );
}
