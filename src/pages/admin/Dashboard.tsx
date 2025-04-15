import { Card } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, ArrowUp, ArrowDown } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">$45,231.89</h3>
              <p className="text-sm flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                +20.1% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">2,345</h3>
              <p className="text-sm flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                +15% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h3 className="text-2xl font-bold">12,234</h3>
              <p className="text-sm flex items-center text-red-600">
                <ArrowDown className="h-4 w-4 mr-1" />
                -2% from last month
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <ShoppingBag className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">1,234</h3>
              <p className="text-sm flex items-center text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                +4% from last month
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {/* Sample orders */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Order #1234</p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
              <p className="text-green-600 font-medium">$234.00</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Order #1233</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <p className="text-green-600 font-medium">$522.00</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Customers</h3>
          <div className="space-y-4">
            {/* Sample customers */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>
              <p className="text-sm text-gray-500">Joined 2 days ago</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-sm text-gray-500">jane@example.com</p>
              </div>
              <p className="text-sm text-gray-500">Joined 5 days ago</p>
            </div>
          </div>
        </Card>
      </div>
      <div>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Products</h3>
          <div className="space-y-4">
            {/* Sample products */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Product A</p>
                <p className="text-sm text-gray-500">Category A</p>
              </div>
              <p className="text-green-600 font-medium">$19.99</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Product B</p>
                <p className="text-sm text-gray-500">Category B</p>
              </div>
              <p className="text-green-600 font-medium">$29.99</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}