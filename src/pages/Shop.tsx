
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { exploreProducts } from "@/data/products";
import { Filter, Grid2X2, Grid3X3, LayoutList, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const Shop = () => {
  const [products, setProducts] = useState(exploreProducts);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  
  // Simulating loading state
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProducts(exploreProducts);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
          <span className="text-gray-500">/</span>
          <span className="font-medium">Shop</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-bold">All Products</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center border rounded-md p-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-sm ${viewMode === 'compact' ? 'bg-gray-100' : ''}`}
                aria-label="Compact grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-sm ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                aria-label="List view"
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>
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
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter & Sort Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select className="w-full mt-1 border rounded-md p-2 text-sm">
                  <option>All Categories</option>
                  <option>Phones</option>
                  <option>Computers</option>
                  <option>SmartWatch</option>
                  <option>Camera</option>
                  <option>Headphones</option>
                  <option>Gaming</option>
                </select>
              </div>
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
          <div className={`grid ${
            viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4' : 
            viewMode === 'compact' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : 
            'grid-cols-1'
          } gap-4 md:gap-6`}>
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="border rounded-md p-4">
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-8 w-full mt-4" />
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
              <div className={`grid ${
                viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4' : 
                viewMode === 'compact' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : 
                'grid-cols-1'
              } gap-4 md:gap-6`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;
