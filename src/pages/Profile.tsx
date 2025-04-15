
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, MessageSquare, RefreshCcw, Menu } from "lucide-react"
import { Link } from "react-router-dom"

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>FN</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Frank Ndanyuzwe</h2>
                <p className="text-gray-500">frank.ndanyuzwe@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline">Edit Profile</Button>
              <div className="text-red-500">
                Coupons(4)
              </div>
            </div>
          </div>
        </Card>

        {/* Order Status */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Package className="h-6 w-6 mx-auto mb-2" />
            <p>Pending Payment</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="relative inline-block">
              <Package className="h-6 w-6 mx-auto mb-2" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                1
              </span>
            </div>
            <p>In Transit</p>
          </Card>
          <Card className="p-4 text-center">
            <MessageSquare className="h-6 w-6 mx-auto mb-2" />
            <p>Pending Feedback</p>
          </Card>
          <Card className="p-4 text-center">
            <RefreshCcw className="h-6 w-6 mx-auto mb-2" />
            <p>Return & Refund</p>
          </Card>
        </div>

        {/* Orders List */}
        <Card className="p-6">
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending Payment</TabsTrigger>
              <TabsTrigger value="transit">In Transit</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <OrderItem 
                image="/lovable-uploads/052296cd-ec5c-42ac-85f8-eda305013134.png"
                name="Smooth Depilatory Cream Body Painless Hair Removal"
                orderNo="7001644438"
                status="In Transport"
                price="5,466 RWF"
                quantity={1}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

function OrderItem({ image, name, orderNo, status, price, quantity }: {
  image: string
  name: string
  orderNo: string
  status: string
  price: string
  quantity: number
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <span>Order No: {orderNo}</span>
        <span className="text-gray-500">{status}</span>
      </div>
      <div className="flex gap-4">
        <img src={image} alt={name} className="w-24 h-24 object-cover rounded" />
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500">Quantity: {quantity}</span>
            <span className="font-semibold">{price}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline">Check The Order Detail</Button>
        <Button variant="link" className="text-red-500">Track</Button>
      </div>
    </div>
  )
}
