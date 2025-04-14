
import { Button } from "@/components/ui/button";

export default function NewArrivals() {
  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-4 h-8 bg-red-600 rounded-sm"></div>
        <h2 className="text-2xl font-bold">New Arrival</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="relative overflow-hidden rounded-lg bg-black text-white h-[400px] group">
          <img 
            src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=1168&q=80" 
            alt="PlayStation 5" 
            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <h3 className="text-xl font-bold mb-1">PlayStation 5</h3>
            <p className="text-sm opacity-90 mb-4">Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback.</p>
            <Button variant="outline" className="border-white text-white hover:bg-white/20 w-fit">
              Shop Now
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-lg bg-gray-800 text-white h-[190px] group">
            <img 
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1168&q=80" 
              alt="Women's Collections" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-lg font-bold">Women's Collections</h3>
              <p className="text-xs opacity-90 mb-2">Featured woman fashion at its best</p>
              <Button variant="link" className="text-white p-0 h-auto w-fit">
                Shop Now &rarr;
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg bg-gray-200 text-black h-[190px] group">
            <img 
              src="https://images.unsplash.com/photo-1608042314453-ae338d80c427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
              alt="Speakers" 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-lg font-bold">Speakers</h3>
              <p className="text-xs opacity-90 mb-2">Amazon wireless speakers</p>
              <Button variant="link" className="text-black p-0 h-auto w-fit">
                Shop Now &rarr;
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg bg-gray-100 text-black h-[190px] group">
            <img 
              src="https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
              alt="Perfume" 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-lg font-bold">Perfume</h3>
              <p className="text-xs opacity-90 mb-2">GUCCI INTENSE OUD EDP</p>
              <Button variant="link" className="text-black p-0 h-auto w-fit">
                Shop Now &rarr;
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-lg bg-stone-300 text-black h-[190px] group">
            <img 
              src="https://images.unsplash.com/photo-1611930022073-84f34f54d2a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80" 
              alt="Furnitures" 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-lg font-bold">Furnitures</h3>
              <p className="text-xs opacity-90 mb-2">Modern and comfortable</p>
              <Button variant="link" className="text-black p-0 h-auto w-fit">
                Shop Now &rarr;
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
