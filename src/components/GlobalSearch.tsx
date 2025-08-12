import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const GlobalSearch = () => {
  const queryParam = useQuery().get("q") || "";
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!queryParam.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://gura-online-bn.onrender.com/api/v1/products/search?query=${encodeURIComponent(queryParam)}`
        );
        if (!res.ok) {
          setSearchResults([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setSearchResults(data.data || []);
      } catch (error) {
        console.error("Failed to fetch search results", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [queryParam]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="text-gray-500">/</span>
          <span className="font-medium">Search Results for "{queryParam}"</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Search Results for "{queryParam}"
          </h1>
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
            {/* Add filter controls here if you want */}
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
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="border rounded-md p-4 animate-pulse"
              >
                <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              No products found matching your search.
            </h3>
            <p className="text-gray-500">Try a different search term.</p>
            <Link
              to="/"
              className="text-blue-500 hover:underline mt-4 inline-block"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GlobalSearch;
