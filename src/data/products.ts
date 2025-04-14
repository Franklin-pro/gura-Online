
export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  description?: string;
}

export const exploreProducts = [
  {
    id: 1,
    name: "Bose Portable Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    price: 129.99,
    rating: 4.9,
    reviews: 143,
    description: "Premium sound quality in a portable design. This speaker delivers deep, immersive sound that fills any space. With 12 hours of battery life, it's perfect for your adventures."
  },
  {
    id: 2,
    name: "DSLR Professional Camera",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1164&q=80",
    price: 699.99,
    rating: 4.8,
    reviews: 87,
    description: "Capture stunning photos and videos with this professional DSLR camera. Features a 24.1MP sensor, 4K video recording, and advanced autofocus system for exceptional image quality."
  },
  {
    id: 3,
    name: "Gaming Laptop 15.6\"",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=1168&q=80",
    price: 999.99,
    rating: 4.7,
    reviews: 68,
    description: "High-performance gaming laptop with the latest processor and graphics card. Featuring a 144Hz display, RGB keyboard, and exceptional cooling system for marathon gaming sessions."
  },
  {
    id: 4,
    name: "Premium Skin Care Set",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80",
    price: 89.99,
    rating: 4.5,
    reviews: 92,
    description: "Complete skincare regimen including cleanser, toner, serum, and moisturizer. Made with natural ingredients to nourish and rejuvenate your skin for a healthy, radiant glow."
  },
  {
    id: 5,
    name: "Kids Electric Car",
    image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    price: 199.99,
    rating: 4.6,
    reviews: 65,
    description: "Let your child experience the thrill of driving with this realistic electric car. Features working headlights, music player, and a comfortable seat with safety belt."
  },
  {
    id: 6,
    name: "Pro Soccer Cleats",
    image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    price: 99.99,
    rating: 4.8,
    reviews: 126,
    description: "Professional-grade soccer cleats designed for speed and control. Lightweight construction with advanced grip pattern for optimal performance on the field."
  },
  {
    id: 7,
    name: "Xbox Wireless Controller",
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80",
    price: 59.99,
    rating: 4.9,
    reviews: 213,
    description: "Elevate your gaming experience with this ergonomic wireless controller. Features textured grips, responsive triggers, and up to 40 hours of battery life."
  },
  {
    id: 8,
    name: "Men's Winter Jacket",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1136&q=80",
    price: 129.99,
    rating: 4.7,
    reviews: 78,
    description: "Stay warm and stylish with this premium winter jacket. Features water-resistant outer shell, thermal insulation, and multiple pockets for functionality."
  }
];
