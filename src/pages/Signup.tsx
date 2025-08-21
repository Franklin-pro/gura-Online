import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideApple, Globe, Mail, Eye, EyeOff, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useRegister from "@/hooks/useRegister";

interface Country {
  code: string;
  name: string;
  phoneCode: string;
  flag: string;
}

const getPhoneLength = (countryCode: string): number => {
  const phoneLengths: Record<string, number> = {
    'US': 10, 'CA': 10, 'RW': 9, 'GB': 10, 'AU': 9,
    'DE': 11, 'FR': 10, 'IN': 10, 'JP': 11, 'CN': 11
  };
  return phoneLengths[countryCode] || 10;
};

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword,setShowPassword] = useState(false)
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const { register, isLoading } = useRegister();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch countries from API
    fetch('https://gura-online-bn.onrender.com/api/v1/countries')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCountries(data.data);
          setSelectedCountry(data.data[0]);
          
          // Detect country by IP
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(ipData => {
              const country = data.data.find((c: Country) => c.code === ipData.country_code);
              if (country) setSelectedCountry(country);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) return;
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const fullPhone = `${selectedCountry.phoneCode}${cleanPhone}`;
    const success = await register({ name, email, phone: fullPhone, password });
    if (success) {
      navigate("/login");
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formatPhoneNumber = (value: string, countryCode: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const maxLength = getPhoneLength(countryCode);
    const truncated = phoneNumber.slice(0, maxLength);
    
    if (countryCode === 'US' || countryCode === 'CA') {
      if (truncated.length <= 3) return truncated;
      if (truncated.length <= 6) return `(${truncated.slice(0, 3)}) ${truncated.slice(3)}`;
      return `(${truncated.slice(0, 3)}) ${truncated.slice(3, 6)}-${truncated.slice(6)}`;
    } else if (countryCode === 'RW') {
      if (truncated.length <= 3) return truncated;
      if (truncated.length <= 6) return `${truncated.slice(0, 3)} ${truncated.slice(3)}`;
      return `${truncated.slice(0, 3)} ${truncated.slice(3, 6)} ${truncated.slice(6)}`;
    } else {
      if (truncated.length <= 3) return truncated;
      if (truncated.length <= 6) return `${truncated.slice(0, 3)} ${truncated.slice(3)}`;
      return `${truncated.slice(0, 3)} ${truncated.slice(3, 6)} ${truncated.slice(6)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCountry) return;
 const value = e.target.value.replace(/[^\d\s()-]/g, '');
    const formattedPhone = formatPhoneNumber(value, selectedCountry.code);
    setPhone(formattedPhone);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
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
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <div className="relative">
                    <div className="flex items-center  transition-all duration-200">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-l-lg border-r border-gray-300 min-w-[100px] justify-center"
                        >
                          <span className="text-lg mr-2">{selectedCountry?.flag}</span>
                          <span className="text-sm font-medium text-gray-700">{selectedCountry?.phoneCode}</span>
                          <ChevronDown size={16} className="ml-2 text-gray-500" />
                        </button>
                        {showCountryDropdown && (
                          <div className="absolute top-full left-0 z-20 w-80 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto mt-1">
                            <div className="p-2">
                              {countries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => handleCountrySelect(country)}
                                  className="w-full flex items-center px-3 py-2.5 text-left hover:bg-gray-50 rounded-md transition-colors duration-150 group"
                                >
                                  <span className="text-lg mr-3">{country.flag}</span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-gray-900 truncate">{country.name}</span>
                                      <span className="text-sm text-gray-500 font-mono ml-2">{country.phoneCode}</span>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 relative">
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="78 123 456"
                          value={phone}
                          onChange={handlePhoneChange}
                          className="border rounded-none rounded-r-lg focus:ring-0 focus:border-transparent px-4 py-6 text-base"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleShowPassword}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
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
