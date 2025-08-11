import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, ShoppingCart, Heart, Menu, X, User, Settings, Package, LogOut, User2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Avatar, AvatarFallback
} from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import useLogin from "@/hooks/useLogin";
import axios from "axios";
import { toast } from "react-hot-toast";

const categories = [
  "Home", "Shop", "Women's Fashion", "Men's Fashion", "Electronics", "t-shirts", "Sports", "Toys & Games",
];

export default function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const { logout } = useLogin();

  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get("https://gura-online-bn.onrender.com/api/v1/carts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const total = res.data.data.reduce((sum: number, item) => sum + item.quantity, 0);
      setCartQuantity(total);
    } catch {
      toast.error("Failed to load your cart");
    }
  };

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
    setCartQuantity(0);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      {/* Top Bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl flex-shrink-0">
          <span className="text-black">Tech</span>
          <span className="text-red-600">Sparkle</span>
        </Link>

        {/* Search - Desktop */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex relative flex-1 max-w-xl"
        >
          <Input
            placeholder="Search products..."
            className="pr-10 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8 hover:ring-2 hover:ring-offset-2 hover:ring-gray-200">
                  <AvatarFallback>
                    <User2 />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="hidden md:block text-sm font-medium hover:text-red-600">
                Login
              </Link>
              <Link to="/signup" className="hidden md:block text-sm font-medium hover:text-red-600">
                Sign Up
              </Link>
            </>
          )}

          <Link to="/favorites" className="hidden md:flex items-center justify-center h-9 w-9 hover:text-black">
            <Heart className="h-5 w-5" />
          </Link>

          <Link to="/cart" className="relative flex items-center justify-center h-9 w-9 hover:text-black">
            <ShoppingCart className="h-5 w-5" />
            {cartQuantity > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1rem] px-[2px] text-xs flex items-center justify-center bg-red-600 text-white rounded-full">
                {cartQuantity}
              </span>
            )}
          </Link>

          <button
            className="md:hidden h-9 w-9 flex items-center justify-center hover:text-black"
            onClick={() => setShowMobileMenu((prev) => !prev)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Categories */}
      <nav
        className={cn(
          "bg-white border-t md:border-t-0 overflow-hidden transition-[max-height] duration-300",
          showMobileMenu ? "max-h-screen" : "max-h-0 md:max-h-screen"
        )}
      >
        <div className="container mx-auto px-4 py-2 flex md:flex-row flex-col flex-wrap gap-2">
          {categories.map((category, idx) => (
            <Link
              key={idx}
              to={idx === 0 ? "/" : idx === 1 ? "/shop" : `/category/${category}`}
              className={cn(
                "py-2 px-3 text-sm font-medium hover:text-red-600 transition-colors",
                idx === 1 ? "text-red-600" : "text-gray-800"
              )}
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Search + Links */}
      <div
        className={cn(
          "bg-white border-t md:hidden overflow-hidden transition-[max-height] duration-300",
          showMobileMenu ? "max-h-screen" : "max-h-0"
        )}
      >
        <div className="px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Input
              placeholder="Search products..."
              className="pr-10 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-gray-400" />
            </button>
          </form>

          <div className="flex flex-col space-y-2">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                  <User className="h-5 w-5" /> Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                  <Package className="h-5 w-5" /> My Orders
                </Link>
                <Link to="/settings" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                  <Settings className="h-5 w-5" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md text-red-600"
                >
                  <LogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                  <User className="h-5 w-5" /> Login
                </Link>
                <Link to="/signup" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
                  <User className="h-5 w-5" /> Sign Up
                </Link>
              </>
            )}
            <Link to="/favorites" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
              <Heart className="h-5 w-5" /> Favorites
            </Link>
            <Link to="/cart" className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md">
              <ShoppingCart className="h-5 w-5" /> Cart ({cartQuantity})
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
