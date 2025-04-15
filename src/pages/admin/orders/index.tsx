import { Button } from "@/components/ui/button"
import OrdersTable from "./OrderList"
import { Plus } from "lucide-react"

export default function Orders() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <OrdersTable />
    </div>
  )
}