import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";


interface Product {
    _id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    category: string;
    isFeatured: boolean;
  }
  
  interface ProductStore {
    products: Product[];
    loading: boolean;
    error?: string;
    setProducts: (products: Product[]) => void;
    createProduct: (productData: Omit<Product, '_id'>) => Promise<void>;
    fetchAllProducts: () => Promise<void>;
    fetchProductsByCategory: (category: string) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    toggleFeaturedProduct: (productId: string) => Promise<void>;
    fetchFeaturedProducts: () => Promise<void>;
  }

export const useProductStore = create<ProductStore>((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/api/v1/products/", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Product created successfully");
		} catch (error) {
			toast.error(error.response.message || "Failed to create product");
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/api/v1/products/");
			set({ products: response.data.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/api/v1/products/category/${category}`);
			set({ products: response.data.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/api/v1/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/api/v1/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/api/v1/products/featured");
			set({ products: response.data.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));