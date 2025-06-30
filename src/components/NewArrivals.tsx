import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useProductStore } from "@/hooks/useProductStore";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewArrivals() {
  const fetchAllProducts = useProductStore((state) => state.fetchAllProducts);
  const allProducts = useProductStore((state) => state.products);

  const [loading, setLoading] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchAllProducts(); // Make sure this returns a promise
      setLoading(false);
    };

    loadProducts();
  }, [fetchAllProducts]);

  useEffect(() => {
    setNewArrivals(allProducts.slice(0, 5));
  }, [allProducts]);

  if (loading) {
    return (
      <div className="flex justify-center text-red-500 items-center h-64">
        <Loader className="w-10 h-10 animate-spin text-red-500 text-primary" />
        <span className="ml-3 text-lg font-bold">Loading new arrivals...</span>
      </div>
    );
  }

  if (newArrivals.length === 0) {
    return (
      <section className="py-10 container mx-auto px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">No new arrivals available at the moment.</p>
        </div>
      </section>
    );
  }

  // For demonstration, I'll map the products into your current layout (but you should ideally make this layout dynamic)
  const [featuredProduct, ...otherProducts] = newArrivals;

  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-4 h-8 bg-red-600 rounded-sm"></div>
        <h2 className="text-2xl font-bold">New Arrival</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div className="relative overflow-hidden rounded-lg bg-black text-white h-[400px] group">
          <img
            src={featuredProduct.image || "https://via.placeholder.com/400"}
            alt={featuredProduct.name}
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h3 className="text-xl font-bold mb-1">{featuredProduct.name}</h3>
            <p className="text-sm opacity-90 mb-4">{featuredProduct.description}</p>
            <Link to={`/product/${featuredProduct._id}`} className="border-white text-red-500 p-2 rounded-md bg-white hover:bg-white/20 w-fit">
              Shop Now
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherProducts.map((product) => (
            <div
              key={product._id}
              className="relative overflow-hidden rounded-lg bg-gray-100 text-black h-[190px] group"
            >
              <img
                src={product.image || "https://via.placeholder.com/400"}
                alt={product.name}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex bg-black/20 space-y-1 flex-col justify-end p-4">
               <div className="bg-black/35 rounded-lg p-2">
                 <h3 className="text-lg font-bold text-white">{product.name}</h3>
                <p className="text-xs opacity-90 mb-2 text-white">{product.description}</p>
               </div>
                <Link  to={`/product/${product._id}`} className="text-white rounded-md bg-red-500 p-1 h-auto w-fit">
                  Shop Now &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
