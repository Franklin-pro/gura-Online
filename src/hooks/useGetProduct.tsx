import { useToast } from "./use-toast";

const useGetProducts = () => {
    const { toast } = useToast();
    
const getProducts = async () => {
  try {
    const response = await fetch("/api/v1/products/featured", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Error fetching products",
        description: data.message || "Failed to fetch products",
      });
      return [];
    }

    if (Array.isArray(data.data) && data.data.length > 0) {
      toast({
        title: "Success",
        description: "Products fetched successfully.",
      });

      // Normalize _id to id
      return data.data.map((product) => ({
        ...product,
        id: product._id,
      }));
    } else {
      toast({
        title: "No products available",
        description: data.message || "No featured products found at this time.",
      });
      return [];
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
    return [];
  }
};

    
    return { getProducts };
};

export default useGetProducts;