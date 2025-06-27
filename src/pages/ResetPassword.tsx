import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.put(`https://gura-online-bn.onrender.com/api/v1/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      
      // Show success toast
      toast({
        title: "Success",
        description: "Your password has been reset successfully",
        variant: "default",
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      
      // Show error toast
      toast({
        title: "Error",
        description: err.response?.data?.message || 'Failed to reset password',
        variant: "destructive",
      });
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
              <h1 className="text-2xl font-semibold mb-4 text-center">Reset your password</h1>
              <p className="text-sm text-gray-500 mb-6 text-center">
                Enter your new password below to update your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-medium">New Password*</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your new password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-medium">Confirm New Password*</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-12"
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="text-green-600 text-sm text-center">
                    {message}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
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
                  onClick={() => navigate('/login')}
                >
                  <span>Back to Login</span>
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-gray-500">
                Having trouble?{" "}
                <Link to="/contact" className="text-red-600 hover:underline">
                  Contact support
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