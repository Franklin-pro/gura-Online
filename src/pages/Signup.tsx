import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideApple, Globe, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useRegister from "@/hooks/useRegister";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading } = useRegister();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register({ name, email, password });
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-10">
        <div className="container grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-lg max-w-5xl">
          <div className="p-8 md:p-12 flex flex-col">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-2xl font-semibold mb-8 text-center">
                Get Started Now
              </h1>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

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

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setAgreeToTerms(checked === true)
                    }
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link to="/terms" className="text-red-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-red-600 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={!agreeToTerms || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
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
                Have an account?{" "}
                <Link to="/login" className="text-red-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
          <div
            className="hidden md:block bg-gray-100"
            style={{
              backgroundImage:
                "url('https://cdn11.bigcommerce.com/s-bxamz43bkh/images/stencil/1280x1280/products/11532/13179/EP300RD__31303.1676670607.jpg?c=1')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
