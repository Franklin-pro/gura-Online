
import { Truck, Clock, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support"
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days"
  }
];

export default function FeaturesBanner() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-black text-white p-4 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
