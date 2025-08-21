import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, Loader, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/sonner";
import { useProductStore } from "@/hooks/useProductStore";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsTokenReady(!!token);
    };
    
    checkToken();
    window.addEventListener('storage', checkToken);
    
    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await useProductStore.getState().fetchSingleProduct(id);
        if (data) {
          setProduct(data);
          // Check if user has already rated this product
          // if (isTokenReady) {
          //   checkUserRating(data._id);
          // }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, isTokenReady]);

  // const checkUserRating = async (productId) => {
  //   try {
  //     const response = await axios.get(`/api/v1/products/${productId}/user-rating`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     });
  //     if (response.data.rating) {
  //       setUserRating(response.data.rating);
  //     }
  //   } catch (error) {
  //     console.error('Error checking user rating:', error);
  //   }
  // };

  const handleAddToCart = () => {
    if (!isTokenReady) {
      toast.error("You need to be logged in to add items to the cart");
      return;
    }
    useProductStore.getState().addCart(product._id, quantity);
    toast.success("Product added to cart");
  };

const handleAddRate = async (rating: number) => {
  if (!isTokenReady) {
    toast.error("You need to be logged in to rate products");
    return;
  }

  if (isRating) return;
  
  setIsRating(true);
  try {
    const response = await axios.post(
      `https://gura-online-bn.onrender.com/api/v1/products/${product._id}/rate`,
      { rating },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    
    if (response.data.success) {
      toast.success(response.data.message);
      setProduct(prev => ({
        ...prev,
        rating: response.data.data.newAverageRating,
        ratingCount: response.data.data.newRatingCount,
        reviews: response.data.data.reviews || prev.reviews
      }));
      setUserRating(rating);
    }
  } catch (error) {
    console.error("Error adding rating:", error);
    toast.error(error.response?.data?.message || "Failed to add rating");
  } finally {
    setIsRating(false);
  }
};

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (loading) return (
<div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image placeholder */}
        <div className="w-full h-[400px] bg-gray-200 rounded-2xl animate-pulse"></div>

        {/* Product details placeholder */}
        <div>
          {/* Product name placeholder */}
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>

          {/* Rating placeholder */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Price placeholder */}
          <div className="h-6 w-1/4 bg-gray-200 rounded mb-4 animate-pulse"></div>

          {/* Description placeholder */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Quantity controls placeholder */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Buttons placeholder */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
  );

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
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  fill={
                    (userRating > 0 && i < userRating) || 
                    (userRating === 0 && i < Math.floor(product.rating)) ? 
                    "currentColor" : "none"
                  }
                  stroke="currentColor"
                  className="w-5 h-5"
                  onClick={() => handleAddRate(i + 1)}
                  style={{ 
                    cursor: isTokenReady && !isRating ? 'pointer' : 'default',
                    opacity: isRating ? 0.7 : 1
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.rating?.toFixed(1) || '0.0'} • {product.ratingCount || 0} ratings)
            </span>
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
            <Button 
              onClick={handleAddToCart}  
              disabled={!isTokenReady}
              className="flex items-center"
            >
              <ShoppingCart className="mr-2" /> 
              {isTokenReady ? 'Add to Cart' : 'Login Required'}
            </Button>
            <Button variant="ghost" aria-label="Add to wishlist">
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