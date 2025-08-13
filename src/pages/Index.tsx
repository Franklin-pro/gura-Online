import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FlashSales from "@/components/FlashSales";
import CategoryBrowser from "@/components/CategoryBrowser";
import BestSelling from "@/components/BestSelling";
import EnhanceMusic from "@/components/EnhanceMusic";
import ExploreProducts from "@/components/ExploreProducts";
import NewArrivals from "@/components/NewArrivals";
import FeaturesBanner from "@/components/FeaturesBanner";
import Footer from "@/components/Footer";
import Checkout from "@/components/Checkout";
import SplashScreen from "../components/SplashScreen";

const Index = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Splash screen timer (e.g., 2 seconds)
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimeout);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://gura-online-bn.onrender.com/api/v1/products');
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        } else {
          console.error('Failed to fetch products:', result.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : showCheckout ? (
          <Checkout onBack={() => setShowCheckout(false)} />
        ) : (
          <>
            <Header />
            <HeroBanner />
            <FlashSales />
            <CategoryBrowser />
            <BestSelling />
            <EnhanceMusic />
            <ExploreProducts />
            <NewArrivals />
            <FeaturesBanner />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
