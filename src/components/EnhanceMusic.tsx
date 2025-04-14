
import { Button } from "@/components/ui/button";
import { Bluetooth, Volume2, Music, BatteryFull } from "lucide-react";

export default function EnhanceMusic() {
  return (
    <section className="py-8 container mx-auto px-4">
      <div className="relative bg-black text-white rounded-lg overflow-hidden">
        <div className="absolute top-4 left-4">
          <span className="text-xs font-medium">Category</span>
        </div>
        
        <div className="pt-10 px-6 pb-6 md:px-10 md:py-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-4 z-10 mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold">Enhance Your Music Experience</h2>
            <div className="flex flex-wrap gap-4 my-6">
              <div className="bg-white/10 p-2 rounded-full flex items-center justify-center">
                <Bluetooth className="h-5 w-5" />
              </div>
              <div className="bg-white/10 p-2 rounded-full flex items-center justify-center">
                <BatteryFull className="h-5 w-5" />
              </div>
              <div className="bg-white/10 p-2 rounded-full flex items-center justify-center">
                <Volume2 className="h-5 w-5" />
              </div>
              <div className="bg-white/10 p-2 rounded-full flex items-center justify-center">
                <Music className="h-5 w-5" />
              </div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Buy Now
            </Button>
          </div>
          
          <div className="md:w-1/2 flex justify-center items-center">
            <img 
              src="https://images.unsplash.com/photo-1564424224827-cd24b8915874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80" 
              alt="JBL Speaker" 
              className="max-h-[200px] md:max-h-[250px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
