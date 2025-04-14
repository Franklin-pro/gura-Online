
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "./ProductCard";
import { exploreProducts } from "@/data/products";
import { Link } from "react-router-dom";

export default function ExploreProducts() {
  const isMobile = useIsMobile();
  const [visibleProducts, setVisibleProducts] = useState(exploreProducts.slice(0, 8));
  const [startIndex, setStartIndex] = useState(0);
  const productsPerRow = isMobile ? 2 : 4;
  const rowsToShow = 2;
  const productsToShow = productsPerRow * rowsToShow;
  
  useEffect(() => {
    const updateVisibleProducts = () => {
      setVisibleProducts(
        exploreProducts.slice(startIndex, startIndex + productsToShow)
      );
    };
    
    updateVisibleProducts();
  }, [startIndex, isMobile, productsToShow]);
  
  const nextSlide = () => {
    setStartIndex((prev) => 
      prev + productsToShow >= exploreProducts.length ? 0 : prev + productsPerRow
    );
  };
  
  const prevSlide = () => {
    setStartIndex((prev) => 
      prev === 0 ? Math.max(0, exploreProducts.length - productsToShow) : prev - productsPerRow
    );
  };
  
  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-8 bg-red-600 rounded-sm"></div>
          <h2 className="text-2xl font-bold">Explore Our Products</h2>
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
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="default" className="bg-red-600 hover:bg-red-700" asChild>
          <Link to="/shop">View All Products</Link>
        </Button>
      </div>
    </section>
  );
}
