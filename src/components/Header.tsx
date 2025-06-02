import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  User,
  Settings,
  Package,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useShop } from "@/context/ShopContext";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLogin from "@/hooks/useLogin";


// Categories
const categories = [
  "Home",
  "Shop",
  "Women's Fashion",
  "Men's Fashion",
  "Electronics",
  "Home & Living",
  "Sports",
  "Toys & Games",
];

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {logout,loading} = useLogin()

  const isMobile = useIsMobile();
  const { getCartQuantity } = useShop();
  const cartQuantity = getCartQuantity();
  const navigate = useNavigate();

  // Simulate checking login status (e.g., token in localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/category/${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          <span className="text-black">Tech</span>
          <span className="text-red-600">Sparkle</span>
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
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 hover:ring-2 hover:ring-offset-2 hover:ring-gray-200 transition-all">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                    <Package className="h-4 w-4" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
                Login
              </Link>
              <Link to="/signup" className="hidden md:flex items-center text-sm font-medium text-gray-700 hover:text-red-600">
                Sign Up
              </Link>
            </>
          )}
          <Link to="/favorites" className="hidden md:flex items-center justify-center h-9 w-9 text-gray-700 hover:text-black">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative flex items-center justify-center h-9 w-9 text-gray-700 hover:text-black">
            <ShoppingCart className="h-5 w-5" />
            {cartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-600 text-white rounded-full">
                {cartQuantity}
              </span>
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

      {/* Categories */}
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

      {/* Mobile Search + Links */}
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
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link to="/orders" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                <Package className="h-5 w-5" />
                <span>My Orders</span>
              </Link>
              <Link to="/settings" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md text-red-600 w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                <User className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                <User className="h-5 w-5" />
                <span>Sign Up</span>
              </Link>
            </>
          )}
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
