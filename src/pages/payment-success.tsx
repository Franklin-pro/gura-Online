import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function PaymentSuccess() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [amountPaid, setAmountPaid] = useState(null);
  const [searchParams] = useSearchParams();

  const [showShippingForm, setShowShippingForm] = useState(true);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [userCountry, setUserCountry] = useState(null);
  const [phone, setPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  const sessionId = searchParams.get("session_id");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const country = countries.find(c => c.name === value);
      setSelectedCountry(country);
    }
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const formatPhoneNumber = (value, countryCode) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (countryCode === 'US' || countryCode === 'CA') {
      if (phoneNumber.length <= 3) return phoneNumber;
      if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (countryCode === 'RW') {
      if (phoneNumber.length <= 3) return phoneNumber;
      if (phoneNumber.length <= 6) return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 9)}`;
    }
    return phoneNumber;
  };

  const handlePhoneChange = (e) => {
    if (!selectedCountry) return;
    const value = e.target.value.replace(/[^\d\s()-]/g, '');
    const formattedPhone = formatPhoneNumber(value, selectedCountry.code);
    setPhone(formattedPhone);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setShippingAddress(prev => ({ ...prev, country: country.name }));
  };

  const validateAddress = () => {
    const requiredFields = ['name', 'address', 'city', 'country'];
    for (const field of requiredFields) {
      if (!shippingAddress[field].trim()) {
        toast.error(`Please enter ${field}`);
        return false;
      }
    }
    if (!phone.trim()) {
      toast.error('Please enter phone number');
      return false;
    }
    // Zipcode is optional for some countries
    const needsZipCode = ['US', 'CA', 'GB', 'DE', 'FR'].includes(selectedCountry?.code);
    if (needsZipCode && !shippingAddress.zipCode.trim()) {
      toast.error('Please enter zip code');
      return false;
    }
    return true;
  };

const handleCheckoutSuccess = async () => {
  if (!validateAddress()) return;

  setIsProcessing(true);
  setError(null); // Reset any previous errors

  try {
    // 1. Send payment confirmation to backend with shipping address
    const response = await axios.post(
      "https://gura-online-bn.onrender.com/api/v1/payments/checkout-success",
      {
        sessionId,
        shippingAddress: {
          name: shippingAddress.name.trim(),
          address: shippingAddress.address.trim(),
          city: shippingAddress.city.trim(),
          state: shippingAddress.state.trim(),
          zipCode: shippingAddress.zipCode.trim(),
          country: shippingAddress.country.trim(),
          phone: selectedCountry ? `${selectedCountry.phoneCode}${phone.replace(/[^\d]/g, '')}` : phone
        }
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      }
    );

    // 2. Handle successful response
    if (response.data.success) {
      setTransactionId(response.data.transactionId);
      setAmountPaid(response.data.amountPaid);
      toast.success("Payment successful! Your order has been placed.");

      // 3. Clear the user's cart
      try {
        await axios.delete("https://gura-online-bn.onrender.com/api/v1/carts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        toast.success("Your cart has been cleared");
      } catch (cartError) {
        console.error("Error clearing cart:", cartError);
        toast.warning("Order placed but couldn't clear your cart");
      }
      setShowShippingForm(false);
    } else {
      throw new Error(response.data.message || "Payment verification failed");
    }
  } catch (err) {
    console.error("Payment processing error:", err);
    let errorMessage = "Payment verification failed. Please check your orders.";
    
    if (err.response) {
      // Server responded with error status
      errorMessage = err.response.data.message || errorMessage;
    } else if (err.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your connection.";
    }

    setError(errorMessage);
    toast.error(errorMessage);
    
    // If session is invalid, hide the shipping form
    if (err.response?.status === 404 || err.response?.status === 400) {
      setShowShippingForm(false);
    }
  } finally {
    setIsProcessing(false);
  }
};

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found. Please check your order history.");
      setShowShippingForm(false);
    }

    // Fetch countries and detect user's country
    const fetchCountriesAndDetectLocation = async () => {
      try {
        // Fetch countries from API
        const countriesRes = await axios.get('https://gura-online-bn.onrender.com/api/v1/countries');
        if (countriesRes.data.success) {
          setCountries(countriesRes.data.data);
        }

        // Detect user's country by IP
        const ipRes = await axios.get('https://ipapi.co/json/');
        const detectedCountry = countriesRes.data.data.find(c => c.code === ipRes.data.country_code);
        
        if (detectedCountry) {
          setUserCountry(detectedCountry);
          setSelectedCountry(detectedCountry);
          setShippingAddress(prev => ({
            ...prev,
            country: detectedCountry.name,
            city: ipRes.data.city || '',
            state: ipRes.data.region || '',
            zipCode: ipRes.data.postal || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchCountriesAndDetectLocation();
  }, [sessionId]);

  if (isProcessing) {
    return (
      <div className="text-center mt-20 text-lg font-medium">
        Verifying your payment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 space-y-4">
        <h2 className="text-xl font-semibold text-red-500">Error</h2>
        <p className="text-gray-600">{error}</p>
        <div className="mt-4 space-x-4">
          <Button asChild variant="outline">
            <Link to="/profile/orders">Check Orders</Link>
          </Button>
          <Button asChild>
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (showShippingForm && sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full p-8 space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Shipping Information
            </h2>
            {userCountry && (
              <p className="text-sm text-gray-600">
                📍 Detected location: {userCountry.flag} {userCountry.name}
              </p>
            )}
          </div>
          <input
            name="name"
            value={shippingAddress.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          
          {/* Phone Input with Country Selector */}
          <div className="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center px-3 py-2 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 rounded-l-md min-w-[90px]"
              >
                <span className="mr-1">{selectedCountry?.flag}</span>
                <span className="text-sm">{selectedCountry?.phoneCode}</span>
                <ChevronDown size={14} className="ml-1" />
              </button>
              {showCountryDropdown && (
                <div className="absolute top-full left-0 z-20 w-72 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <span className="mr-2">{country.flag}</span>
                      <span className="text-sm mr-2">{country.phoneCode}</span>
                      <span className="text-sm truncate">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              placeholder="788 123 456"
              value={phone}
              onChange={handlePhoneChange}
              className="border-0 rounded-l-none flex-1 px-3 py-2 text-sm focus:ring-0"
            />
          </div>

          <input
            name="address"
            value={shippingAddress.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          
          <input
            name="city"
            value={shippingAddress.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          
          <input
            name="state"
            value={shippingAddress.state}
            onChange={handleInputChange}
            placeholder="State/Province"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          
          {/* Conditional Zip Code */}
          {['US', 'CA', 'GB', 'DE', 'FR'].includes(selectedCountry?.code) && (
            <input
              name="zipCode"
              value={shippingAddress.zipCode}
              onChange={handleInputChange}
              placeholder="Zip Code"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          )}
          
          <select
            name="country"
            value={shippingAddress.country}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          <Button className="w-full mt-4" onClick={handleCheckoutSuccess}>
            Confirm and Place Order
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment Successful!
        </h1>
        <div className="space-y-2 text-gray-600">
          <p className="text-sm">
            Transaction Number: {transactionId || "Not available"}
          </p>
          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between py-2">
              <span>Amount Paid:</span>
              <span className="font-semibold">
                ${amountPaid?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span>Credit Card</span>
            </div>
          </div>
          <p className="text-sm">
            Thank you for your purchase! Your order is being processed.
          </p>
        </div>
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/profile">View Order Details</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
