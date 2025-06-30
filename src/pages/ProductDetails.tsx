import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, Loader, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/sonner";
import { useProductStore } from "@/hooks/useProductStore";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isTokenReady, setIsTokenReady] = useState(false);

    useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsTokenReady(!!token);
    };
    
    checkToken();
    
    // Listen for storage changes (in case token is set in another tab)
    window.addEventListener('storage', checkToken);
    
    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  useEffect(() => {
 const fetchProduct = async () => {
    const data = await useProductStore.getState().fetchSingleProduct(id);
    if (data) {
      setProduct(data);
    }
    setLoading(false);
  };

  if (id) {
    fetchProduct();
  }
  }, [id]);

const handleAddToCart = () => {
  if (!isTokenReady) {
    toast.error("You need to be logged in to add items to the cart");
    return;
  }

  useProductStore.getState().addCart(product._id, quantity);
};


  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) return <div className="text-lg spinner text-red-500 flex items-center gap-3"> 
            <Loader className="w-10 h-10  border-gray-300 border-t-primary rounded-full animate-spin"/>
          <p className="font-bold">product Details...</p>
          </div>;
  if (!product) return <div className="text-center py-10">Product not found.</div>;

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-2xl object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-5 h-5"
              />
            ))}
            <span className="text-sm text-gray-500">({product.rating})</span>
          </div>
          <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={decreaseQty}>
              <Minus />
            </Button>
            <span className="text-lg">{quantity}</span>
            <Button variant="outline" onClick={increaseQty}>
              <Plus />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleAddToCart}  disabled={!isTokenReady}>
              <ShoppingCart className="mr-2" /> {isTokenReady ? 'Add to Cart' : 'Login Required'}
            </Button>
            <Button variant="ghost">
              <Heart />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
