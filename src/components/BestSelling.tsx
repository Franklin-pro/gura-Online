import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, ChevronRight, Star, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProductStore } from "@/hooks/useProductStore";
import { cn } from "@/lib/utils";

export default function BestSelling() {
  const isMobile = useIsMobile();
  const fetchAllProducts = useProductStore((state) => state.fetchAllProducts);
  const allProducts = useProductStore((state) => state.products);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startIndex, setStartIndex] = useState(0);
  const productsToShow = isMobile ? 2 : 4;

  // ✅ Fetch and filter products on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchAllProducts(); // Make sure your store returns a promise
      setLoading(false);
    };

    loadProducts();
  }, [fetchAllProducts]);

  // ✅ Filter products when fetched
  useEffect(() => {
    const filtered = allProducts.filter(
      (product) => product.price >= 120 && product.price <= 300
    );
    setFilteredProducts(filtered);
    setVisibleProducts(filtered.slice(startIndex, startIndex + productsToShow));
  }, [allProducts, startIndex, productsToShow]);

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + productsToShow >= filteredProducts.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, filteredProducts.length - productsToShow) : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center text-red-500 items-center h-64">
        <Loader className="w-10 h-10 animate-spin text-red-500 text-primary" />
        <span className="ml-3 text-lg font-bold">Loading best-selling products...</span>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <section className="py-10 container mx-auto px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">No products available in this price range.</p>
        </div>
      </section>
    );
  }

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

          <Card key={product._id} className="relative overflow-hidden group border border-gray-200">
            <span className="p-4 bg-red-500 text-center text-white">discount {product.discount}</span>
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
