'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { UploadCloud } from "lucide-react"
import { useState } from "react"

export default function CreateProduct() {
  const [keepSelling, setKeepSelling] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create a new product</h1>
        <p className="text-sm text-muted-foreground">Dashboard &gt; Products &gt; Create</p>
      </div>

      {/* Basic Details */}
      <div className="space-y-4 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Basic details</h2>
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" placeholder="Enter product name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={5} placeholder="Write something" />
        </div>
      </div>

     {/* Images */}
<div className="space-y-4 rounded-lg border p-6">
  <h2 className="text-lg font-semibold">Images</h2>
  <div
    className="flex items-center cursor-pointer justify-center border border-dashed p-6 rounded-lg text-center text-muted-foreground"
    onClick={() => document.getElementById("product-image")?.click()}
  >
    <div className="space-y-2">
      <p>Click to upload or drag and drop</p>
      <p className="text-xs">(SVG, JPG, PNG, or GIF maximum 900x400)</p>
    </div>
  </div>
  <input type="file" id="product-image" className="hidden" />
</div>


      {/* Pricing */}
      <div className="space-y-4 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Old Price</Label>
            <Input type="number" defaultValue={0} />
          </div>
          <div className="space-y-2">
            <Label>New Price</Label>
            <Input type="number" defaultValue={0} />
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Switch checked={keepSelling} onCheckedChange={setKeepSelling} />
          <Label>Keep selling when stock is empty</Label>
        </div>
      </div>

      {/* Category & Metadata */}
      <div className="space-y-4 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Barcode</Label>
            <Input defaultValue="924567898626" />
          </div>
          <div className="space-y-2">
            <Label>SKU</Label>
            <Input defaultValue="INV-8745" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button type="submit">Create</Button>
      </div>
    </div>
  )
}
