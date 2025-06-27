
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('https://gura-online-bn.onrender.com/api/v1/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      if(err.status === 404){
setError('email does not exist check again');
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="container grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-lg max-w-5xl">
          <div className="p-8 md:p-12 flex flex-col">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-2xl font-semibold mb-4 text-center">Forget something?</h1>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Enter your email below to receive password reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email-address" className="font-medium">Email*</Label>
                  <Input 
                    id="email-address" 
                    type="email" 
                    placeholder="e.g. email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {message && <p className="text-sm text-green-500">{message}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>


                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 h-12 text-base"
                  onClick={() => window.open("https://accounts.google.com", "_blank")}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
                    <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
                    <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.001 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
                    <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
                  </svg>
                  <span>Sign in with Google</span>
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                Didn't receive instructions?{" "}
                <Link to="#" className="text-red-600 hover:underline">
                  Try different method
                </Link>
              </p>

              <p className="mt-4 text-center text-sm text-gray-500">
                Remember your password?{" "}
                <Link to="/login" className="text-red-600 hover:underline">
                  Back to login
                </Link>
              </p>
            </div>
          </div>
          <div className="hidden md:block bg-gray-100" style={{ 
            backgroundImage: "url('/lovable-uploads/84f724ab-1b88-4372-9010-ae6345172b5d.png')", 
            backgroundSize: "cover", 
            backgroundPosition: "center" 
          }}>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
