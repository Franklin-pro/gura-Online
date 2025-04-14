
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Up to 10% off IPhone 16 Pro",
    description: "Get the latest iPhone 16 Pro and enjoy up to 10% off on all products",
    image: "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_inline.jpg.large.jpg",
    bgColor: "bg-black",
    textColor: "text-white"
  },
  {
    id: 2,
    title: "Headphones",
    description: "Experience the future of audio with our latest headphones",
    image: "https://cdn.thewirecutter.com/wp-content/media/2023/07/bluetoothheadphones-2048px-0876.jpg",
    bgColor: "bg-rose-100",
    textColor: "text-black"
  },
  {
    id: 3,
    title: "cmaera Sony Alpha 7 IV",
    description: "Capture stunning moments with our latest camera",
    image: "https://i.ebayimg.com/images/g/mXAAAOSwA9ZlQKSl/s-l1200.jpg",
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
