
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useShop } from "@/context/ShopContext";

const categories = [
  "Home",
  "Shop",
  "Women's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Living",
  "Sports",
  "Toys & Games"
];

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { getCartQuantity } = useShop();
  const cartQuantity = getCartQuantity();
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/${searchQuery}`);
      setSearchQuery("");
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      {/* Top header with logo, search, and actions */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl">
          <span className="text-black">Gura</span>
          <span className="text-red-600">Online</span>
        </Link>

        {/* Search bar - hidden on mobile */}
        <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 mx-16 max-w-xl">
          <Input 
            placeholder="Search products..." 
            className="pr-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
            Login
          </Link>
          <Link to="/signup" className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
            Sign Up
          </Link>
          <Link to="/favorites" className="hidden md:flex items-center justify-center h-9 w-9 text-gray-700 hover:text-black">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative flex items-center justify-center h-9 w-9 text-gray-700 hover:text-black">
            <ShoppingCart className="h-5 w-5" />
            {cartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-600 text-white rounded-full">{cartQuantity}</span>
            )}
          </Link>
          <button 
            className="md:hidden flex items-center justify-center h-9 w-9 text-gray-700 hover:text-black"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Categories navigation */}
      <nav className={cn(
        "bg-white border-t md:border-t-0 transition-all duration-300 overflow-hidden",
        showMobileMenu ? "max-h-screen" : "max-h-0 md:max-h-screen"
      )}>
        <div className="container mx-auto px-4 py-2 flex md:flex-row flex-col">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={index === 0 ? "/" : index === 1 ? "/shop" : `/category/${category}`}
              className={cn(
                "py-2 px-3 text-sm font-medium hover:text-red-600 transition-colors",
                index === 1 ? "text-red-600" : "text-gray-800"
              )}
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile search and links - only shown on mobile */}
      <div className={cn(
        "px-4 py-3 bg-white border-t transition-all duration-300 overflow-hidden md:hidden",
        showMobileMenu ? "max-h-screen" : "max-h-0"
      )}>
        <form onSubmit={handleSearch} className="relative mb-3">
          <Input 
            placeholder="Search products..." 
            className="pr-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </button>
        </form>
        <div className="flex flex-col space-y-2">
          <Link to="/login" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
            <User className="h-5 w-5" />
            <span>Login</span>
          </Link>
          <Link to="/signup" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
            <User className="h-5 w-5" />
            <span>Sign Up</span>
          </Link>
          <Link to="/favorites" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
            <Heart className="h-5 w-5" />
            <span>Favorites</span>
          </Link>
          <Link to="/cart" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
