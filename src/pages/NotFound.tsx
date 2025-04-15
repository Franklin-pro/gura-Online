
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span>404 Error</span>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center py-20">
        <h1 className="text-[80px] font-bold mb-6">404 Not Found</h1>
        <p className="text-gray-600 mb-8 text-center">
          Your visited page not found. You may go home page.
        </p>
        <Button
          asChild
          className="bg-red-500 hover:bg-red-600 text-white px-8"
        >
          <Link to="/">Back to home page</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;