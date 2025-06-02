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
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Failed to fetch products:", errorData.message);
                
                toast({
                    variant: "destructive",
                    title: "Error fetching products",
                    description: errorData.message || "Failed to fetch products",
                });
                return [];
            }
            
            const data = await response.json();
            
            // Check if the response contains products or an error message
            if (Array.isArray(data) && data.length > 0) {
                toast({
                    title: "Success",
                    description: "Products fetched successfully.",
                });
                return data;
            } else if (data.message) {
                // Server returned a message but no products
                console.log("API response:", data.message);
                
                toast({
                    title: "No products available",
                    description: data.message,
                });
                return [];
            } else {
                // Empty array was returned
                toast({
                    title: "No products available",
                    description: "No featured products found at this time.",
                });
                return [];
            }
        } catch (error) {
            console.log("Error fetching products:", error.message);
            
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