
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { exploreProducts } from "@/data/products";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// This is a mock function to simulate fetching products by category
// In a real application, this would connect to an API
const getProductsByCategory = (category: string) => {
  // For demo purposes, we'll just return all products
  // In a real application, you would filter by category from an API
  return exploreProducts;
};

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState(exploreProducts);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const fetchedProducts = getProductsByCategory(categoryName || "");
      setProducts(fetchedProducts);
      setLoading(false);
    }, 500);
  }, [categoryName]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-500">/</span>
          <span className="font-medium">{categoryName || "Category"}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{categoryName || "Category"}</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter Options
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Price Range</label>
                <select className="w-full mt-1 border rounded-md p-2 text-sm">
                  <option>All Prices</option>
                  <option>Under $50</option>
                  <option>$50 - $100</option>
                  <option>$100 - $200</option>
                  <option>Over $200</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Rating</label>
                <select className="w-full mt-1 border rounded-md p-2 text-sm">
                  <option>All Ratings</option>
                  <option>4★ & up</option>
                  <option>3★ & up</option>
                  <option>2★ & up</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Sort By</label>
                <select className="w-full mt-1 border rounded-md p-2 text-sm">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((skeleton) => (
              <div key={skeleton} className="border rounded-md p-4">
                <div className="h-40 bg-gray-200 rounded-md animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
