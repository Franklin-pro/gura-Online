import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "./ProductCard";
import { useProductStore } from "@/hooks/useProductStore";
import { Link } from "react-router-dom";

export default function ExploreProducts() {
  const isMobile = useIsMobile();
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = useProductStore((state) => state.fetchAllProducts);
  const allProducts = useProductStore((state) => state.products);

  const [startIndex, setStartIndex] = useState(0);
  const productsPerRow = isMobile ? 2 : 4;
  const rowsToShow = 2;
  const productsToShow = productsPerRow * rowsToShow;

  // Fetch all products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchAllProducts(); // Make sure this returns a promise in your store
      setLoading(false);
    };

    loadProducts();
  }, [fetchAllProducts]);

  // Update visible products when dependencies change
  useEffect(() => {
    setVisibleProducts(
      allProducts.slice(startIndex, startIndex + productsToShow)
    );
  }, [startIndex, allProducts, productsToShow]);

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + productsToShow >= allProducts.length ? 0 : prev + productsPerRow
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(0, allProducts.length - productsToShow) : prev - productsPerRow
    );
  };

  if (loading) {
    return (
      <div className="flex items-center text-red-500 justify-center h-64">
        <Loader className="w-10 h-10 text-primary text-red-500 animate-spin" />
        <span className="ml-3 text-lg font-bold">Loading products...</span>
      </div>
    );
  }

  if (visibleProducts.length === 0) {
    return (
      <section className="py-10 container mx-auto px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">No products available at the moment.</p>
        </div>
      </section>
    );
  }

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
          <ProductCard key={product._id} product={product} />
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
