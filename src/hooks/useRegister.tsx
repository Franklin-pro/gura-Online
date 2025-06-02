import { useToast,toast } from "./use-toast";

import { useState } from "react";

const useRegister = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

    interface Data {
        name: string;
        email: string;
        password: string;
    }

 
// useRegister.ts
const register = async (data: Data) => {
    setIsLoading(true);
    try {
      const success = handleInputError(data.name, data.email, data.password);
      if (!success) return false;
  
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      const resData = await res.json();
      if (resData.error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: resData.error,
        });
        return false;
      }
  
      toast({
        title: "Success",
        description: "You have successfully registered.",
      });
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An unexpected error occurred.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
export default useRegister;

function handleInputError(username: string, email: string, password: string): boolean {
    if (!username || !email || !password) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please fill in all fields.",
      });
      return false;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please enter a valid email address.",
      });
      return false;
    }
  
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Password must be at least 6 characters.",
      });
      return false;
    }

    return true;
  }
  