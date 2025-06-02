"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { useProductStore } from "@/hooks/useProductStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

export default function CreateProduct() {
  const [keepSelling, setKeepSelling] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    isFeatured: false,
  });
  interface FormErrors {
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    image?: string;
  }

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!newProduct.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (newProduct.name.length > 100) {
      newErrors.name = "Name must be less than 100 characters";
    }

    if (!newProduct.description.trim()) {
      newErrors.description = "Description is required";
    } else if (newProduct.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!newProduct.price) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(Number(newProduct.price)) ||
      Number(newProduct.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!newProduct.category) {
      newErrors.category = "Category is required";
    }

    if (!newProduct.image) {
      newErrors.image = "Product image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
      });
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        isFeatured: false,
      });
      setErrors({});
      // Show success toast/message
    } catch (error) {
      console.error("Error creating product:", error);
      // Show error toast/message
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewProduct({ ...newProduct, image: reader.result });
        } else {
          console.error(
            "Image is not a string (base64), something went wrong."
          );
        }
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create a new product</h1>
        <p className="text-sm text-muted-foreground">
          Dashboard &gt; Products &gt; Create
        </p>
      </div>

      {/* Basic Details */}
      <div className="space-y-4 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Basic details</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            id="name"
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            id="description"
            rows={5}
            placeholder="Write something"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Images</h2>
        <div
          className="flex items-center cursor-pointer justify-center border border-dashed p-6 rounded-lg text-center text-muted-foreground"
          onClick={() => document.getElementById("image")?.click()}
        >
          <div className="space-y-2">
            <p>Click to upload or drag and drop</p>
            <p className="text-xs">(SVG, JPG, PNG, or GIF maximum 900x400)</p>
          </div>
        </div>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
        {newProduct.image && (
          <div className="mt-4">
            <span>Image uploaded</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Product Price</Label>
        <Input
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
          step="0.01"
          type="number"
        />
        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <select
          id="category"
          name="category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white"
          type="submit"
        >
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </div>
  );
}
