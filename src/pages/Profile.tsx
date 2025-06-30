import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, MessageSquare, RefreshCcw, Menu, User, User2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface UserData {
  success: boolean;
  message: string;
  user: User;
  token: string;
}

export default function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUserData: UserData = JSON.parse(userInfo);
        setUserData(parsedUserData.user);
      } else {
        // If no user data, redirect to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      // If error parsing, redirect to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Helper function to get user initials
const getUserInitials = (name?: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .filter(word => word.length > 0) // Filter out empty strings
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2); // Limit to 2 characters max
};
  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-4">No user data found</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
             <Avatar className="h-16 w-16 hover:ring-2 hover:ring-offset-2 ring-gray-200 transition-all">
                  <AvatarFallback>
                    <User2/>
                  </AvatarFallback>
                </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-gray-500">{userData.email}</p>
                <p className="text-sm text-gray-400">
                  Member since {formatDate(userData.createdAt)}
                </p>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1 capitalize">
                  {userData.role}
                </span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Package className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <p className="text-sm font-medium">Pending Payment</p>
            <p className="text-xs text-gray-500 mt-1">0 orders</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative inline-block">
              <Package className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                1
              </span>
            </div>
            <p className="text-sm font-medium">In Transit</p>
            <p className="text-xs text-gray-500 mt-1">1 order</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-sm font-medium">Pending Feedback</p>
            <p className="text-xs text-gray-500 mt-1">0 orders</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <RefreshCcw className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-sm font-medium">Return & Refund</p>
            <p className="text-xs text-gray-500 mt-1">0 orders</p>
          </Card>
        </div>

        {/* Orders List */}
        <Card className="p-6">
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-4 mb-6 w-full">
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
              {/* You can add more orders here or fetch them from API */}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No pending payment orders</p>
              </div>
            </TabsContent>

            <TabsContent value="transit" className="space-y-4">
              <OrderItem 
                image="/lovable-uploads/052296cd-ec5c-42ac-85f8-eda305013134.png"
                name="Smooth Depilatory Cream Body Painless Hair Removal"
                orderNo="7001644438"
                status="In Transport"
                price="5,466 RWF"
                quantity={1}
              />
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No orders pending feedback</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <Footer/>
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
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <span className="font-medium">Order No: {orderNo}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'In Transport' 
            ? 'bg-blue-100 text-blue-800' 
            : status === 'Delivered'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {status}
        </span>
      </div>
      <div className="flex gap-4">
        <img 
          src={image} 
          alt='produc'
          className="w-24 h-24 object-cover rounded border"
        />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500 text-sm">Quantity: {quantity}</span>
            <span className="font-semibold text-red-600">{price}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <Button variant="outline" size="sm">
          Check Order Details
        </Button>
        <Button variant="link" className="text-red-500 p-0" size="sm">
          Track Order
        </Button>
      </div>
    </div>
  )
}