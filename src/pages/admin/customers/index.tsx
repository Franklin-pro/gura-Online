import { Button } from "@/components/ui/button"
import CustomersTable from "./CustomersTable"
import { Plus } from "lucide-react"

export default function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex gap-2">
          <Button variant="outline">Import</Button>
          <Button variant="outline">Export</Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      <CustomersTable />
    </div>
  )
}