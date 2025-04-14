
import { 
  Laptop, Smartphone, Tv, Camera, Headphones, Watch, 
  Shirt, ShoppingBag, Home, Gift, ChevronLeft, ChevronRight 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Phones", icon: <Smartphone className="h-6 w-6" /> },
  { name: "Computers", icon: <Laptop className="h-6 w-6" /> },
  { name: "SmartWatch", icon: <Watch className="h-6 w-6" /> },
  { name: "Camera", icon: <Camera className="h-6 w-6" /> },
  { name: "Headphones", icon: <Headphones className="h-6 w-6" /> },
  { name: "Gaming", icon: <Tv className="h-6 w-6" /> },
  { name: "Fashion", icon: <Shirt className="h-6 w-6" /> },
  { name: "Home", icon: <Home className="h-6 w-6" /> },
  { name: "Gifts", icon: <Gift className="h-6 w-6" /> },
  { name: "Accessories", icon: <ShoppingBag className="h-6 w-6" /> }
];

export default function CategoryBrowser() {
  const isMobile = useIsMobile();
  const [visibleCategories, setVisibleCategories] = useState<typeof categories>([]);
  const [startIndex, setStartIndex] = useState(0);
  const categoriesToShow = isMobile ? 5 : 6;
  
  useEffect(() => {
    const updateVisibleCategories = () => {
      setVisibleCategories(
        categories.slice(startIndex, startIndex + categoriesToShow)
      );
    };
    
    updateVisibleCategories();
  }, [startIndex, isMobile, categoriesToShow]);
  
  const nextSlide = () => {
    setStartIndex((prev) => 
      prev + categoriesToShow >= categories.length ? 0 : prev + 1
    );
  };
  
  const prevSlide = () => {
    setStartIndex((prev) => 
      prev === 0 ? Math.max(0, categories.length - categoriesToShow) : prev - 1
    );
  };
  
  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-8 bg-red-600 rounded-sm"></div>
          <h2 className="text-2xl font-bold">Browse By Category</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={prevSlide}
            className="p-1 rounded-full border hover:bg-gray-100"
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1 rounded-full border hover:bg-gray-100"
            aria-label="Next categories"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-5 md:grid-cols-6 gap-4">
        {visibleCategories.map((category, index) => (
          <Link 
            key={index} 
            to={`/category/${category.name}`}
            className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-md hover:border-red-600 transition-colors text-center"
          >
            <div className="bg-gray-100 p-4 rounded-full">
              {category.icon}
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
