
import { Facebook, Twitter, Instagram, Linkedin, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Exclusive</h2>
            <p className="mb-4">Subscribe</p>
            <p className="mb-4">Get 10% off your first order</p>
            <div className="flex items-center border border-gray-500 rounded-md overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent px-4 py-2 w-full text-sm focus:outline-none"
              />
              <button className="bg-transparent px-3 py-2 border-l border-gray-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.912 12H4L2.023 4.135C2.01 4.09 2 4.045 2 4C2 3.448 2.448 3 3 3H5.185C5.604 3 5.96 3.286 6.04 3.698L9.912 12ZM12.573 20.644L13.042 22.922C13.1 23.215 13.373 23.428 13.674 23.428C13.81 23.428 13.943 23.389 14.06 23.317L18.293 20.629C18.525 20.478 18.646 20.199 18.594 19.93L16.575 12.012H9.701L12.573 20.644ZM16.332 3.982L18.604 11.012H22C22.552 11.012 23 11.459 23 12.012C23 12.235 22.931 12.448 22.809 12.624L22.03 13.802L11.802 0.748C12.242 0.26 12.998 0.189 13.524 0.587L16.332 3.982Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Support</h2>
            <p className="mb-3 flex items-start">
              <MapPin className="h-5 w-5 mr-2 mt-0.5" />
              <span>616 Kigali,Rwanda,kicukiro.</span>
            </p>
            <p className="mb-3">franklindeveloper@gmail.com</p>
            <p className="mb-3">+250 790019543</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Account</h2>
            <ul className="space-y-3">
              <li>My Account</li>
              <li>Login / Register</li>
              <li>Cart</li>
              <li>Wishlist</li>
              <li>Shop</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Quick Link</h2>
            <ul className="space-y-3">
              <li>Privacy Policy</li>
              <li>Terms Of Use</li>
              <li>FAQ</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} gura online. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Facebook className="h-6 w-6" />
            <Twitter className="h-6 w-6" />
            <Instagram className="h-6 w-6" />
            <Linkedin className="h-6 w-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
