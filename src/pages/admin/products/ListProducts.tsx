"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Product, exploreProducts } from "@/data/products";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/hooks/useProductStore";
import { Pencil, Star, Trash } from "lucide-react";

export default function AdminProducts() {
  const [currentPage, setCurrentPage] = useState(1);
  const { deleteProduct, toggleFeaturedProduct, fetchAllProducts, products } =
    useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Products</h1>
        <p className="text-sm text-muted-foreground">Dashboard &gt; Products</p>
      </div>

      <div className="rounded-md border">
        {/* search */}
        <div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border rounded-md"
              />
              <Button variant="outline" size="sm">
                Search
              </Button>
            </div>
            <Button variant="outline" size="sm">
              Add Product
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((pro) => (
              <TableRow key={pro._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={pro.image}
                    alt={pro.name}
                  />
                  {pro.name}
                  </div>
                </TableCell>
                <TableCell>${pro.price}</TableCell>
                <div className="flex items-center p-3 gap-2">
                  <button
                  onClick={() => toggleFeaturedProduct(pro._id)}
                  className={`p-1 rounded-full ${
                    pro.isFeatured
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-600 text-gray-300"
                  } hover:bg-yellow-500 transition-colors duration-200`}
                >
                  <Star className="h-5 w-5" />
                </button>
                </div>
                <TableCell>{pro.category}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button onClick={() => deleteProduct(pro._id)} variant="destructive" size="sm">
                    <Trash className='h-5 w-5'/>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
