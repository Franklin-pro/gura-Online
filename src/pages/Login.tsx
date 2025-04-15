
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideApple, Globe, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useLogin from "@/hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login, loading } = useLogin();

// Login.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  const success = await login(email, password);
  if (!success) {
      navigate("/admin");
  }
};
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="container grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-lg max-w-5xl">
          <div className="p-8 md:p-12 flex flex-col">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-2xl font-semibold mb-8 text-center">Welcome back!</h1>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Enter your credentials to access your account
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-address">Email address</Label>
                  <Input 
                    id="email-address" 
                    type="email" 
                    placeholder="email@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => 
                        setRememberMe(checked === true)
                      }
                    />
                    <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-red-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={loading}
                >
               {loading ? "Loading..." : "Sign In"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                  >
                    <Globe size={18} />
                    <span>Google</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex items-center justify-center gap-2"
                  >
                    <LucideApple size={18} />
                    <span>Apple</span>
                  </Button>
                </div>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/signup" className="text-red-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          <div className="hidden md:block bg-gray-100" style={{ 
            backgroundImage: "url('https://cdn11.bigcommerce.com/s-bxamz43bkh/images/stencil/1280x1280/products/11532/13179/EP300RD__31303.1676670607.jpg?c=1')", 
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
