
import { useState } from "react";
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

const Index = () => {
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {showCheckout ? (
          <Checkout onBack={() => setShowCheckout(false)} />
        ) : (
          <>
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
