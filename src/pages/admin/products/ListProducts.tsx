'use client'

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Product, exploreProducts } from "@/data/products"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function AdminProducts() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(exploreProducts.length / itemsPerPage)
  const paginatedProducts = exploreProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

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
                    <input type="text" placeholder="Search..." className="px-4 py-2 border rounded-md" />
                    <Button variant="outline" size="sm">Search</Button>
                </div>
                <Button variant="outline" size="sm">Add Product</Button>
            </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((pro: Product) => (
              <TableRow key={pro.id}>
                <TableCell>{pro.name}</TableCell>
                <TableCell>${pro.price}</TableCell>
                <TableCell>{pro.rating}</TableCell>
                <TableCell>{pro.reviews}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center space-x-2">
        <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
    </div>
  )
}
