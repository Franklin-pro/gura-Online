import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MessageSquare, RefreshCcw, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

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

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  description?: string;
  category?: string;
  isFeatured?: boolean;
  discount?: number;
  rating?: number;
}

interface OrderProduct {
  _id: string | null;
  productId: string | null;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  isFeatured: boolean;
  discount: number;
  rating: number;
  totalPrice: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  stripeSessionId?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}


export default function Profile() {
  const [userData, setUserData] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          const parsedUserData: UserData = JSON.parse(userInfo);
          setUserData(parsedUserData.user);
          await fetchOrders(parsedUserData.user._id);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchOrders = async (userId: string) => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(`https://gura-online-bn.onrender.com/api/v1/orders/all`, {
        params: {
          status: selectedTab === 'all' ? undefined : selectedTab,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setOrders(response.data.data.map((order: Order) => ({
  ...order,
  status: order.status || 'pending' // Fallback if status is missing
})));
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await axios.put(`https://gura-online-bn.onrender.com/api/v1/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Order cancelled successfully");
      fetchOrders(userData?._id || '');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  useEffect(() => {
    if (userData?._id) {
      fetchOrders(userData._id);
    }
  }, [userData, selectedTab]);

  const getUserInitials = (name?: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  const totalAmounts = orders.reduce((total, order) => total + order.totalAmount, 0);

  const getOrderCountByStatus = (status: string): number => {
    return orders.filter(order => order.status === status).length;
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
                  {getUserInitials(userData.name)}
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
              <Button variant="outline" asChild>
                <Link to="/profile/edit">Edit Profile</Link>
              </Button>
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
            <p className="text-xs text-gray-500 mt-1">
              {getOrderCountByStatus('pending')} orders
            </p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative inline-block">
              <Package className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              {getOrderCountByStatus('processing') > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getOrderCountByStatus('processing')}
                </span>
              )}
            </div>
            <p className="text-sm font-medium">In Transit</p>
            <p className="text-xs text-gray-500 mt-1">
              {getOrderCountByStatus('processing')} order{getOrderCountByStatus('processing') !== 1 ? 's' : ''}
            </p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-sm font-medium">Pending Feedback</p>
            <p className="text-xs text-gray-500 mt-1">
              {getOrderCountByStatus('delivered')} orders
            </p>
          </Card>
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <RefreshCcw className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-sm font-medium">Return & Refund</p>
            <p className="text-xs text-gray-500 mt-1">
              {getOrderCountByStatus('cancelled')} orders
            </p>
          </Card>
        </div>

        {/* Orders List */}
        <Card className="p-6">
          <Tabs value={selectedTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 mb-6 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending Payment</TabsTrigger>
              <TabsTrigger value="processing">In Transit</TabsTrigger>
              <TabsTrigger value="delivered">Feedback</TabsTrigger>
            </TabsList>

            {ordersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="all" className="space-y-4">
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <OrderItem 
                        key={order._id}
                        order={order}
                        onCancel={handleCancelOrder}
                      />
                    ))
                  ) : (
                    <EmptyState status="all" />
                  )}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  {orders.filter(o => o.status === 'pending').length > 0 ? (
                    orders
                      .filter(o => o.status === 'pending')
                      .map(order => (
                        <OrderItem 
                          key={order._id}
                          order={order}
                          onCancel={handleCancelOrder}
                        />
                      ))
                  ) : (
                    <EmptyState status="pending" />
                  )}
                </TabsContent>

                <TabsContent value="processing" className="space-y-4">
                  {orders.filter(o => o.status === 'processing').length > 0 ? (
                    orders
                      .filter(o => o.status === 'processing')
                      .map(order => (
                        <OrderItem 
                          key={order._id}
                          order={order}
                          onCancel={handleCancelOrder}
                        />
                      ))
                  ) : (
                    <EmptyState status="processing" />
                  )}
                </TabsContent>

                <TabsContent value="delivered" className="space-y-4">
                  {orders.filter(o => o.status === 'delivered').length > 0 ? (
                    orders
                      .filter(o => o.status === 'delivered')
                      .map(order => (
                        <OrderItem 
                          key={order._id}
                          order={order}
                          onCancel={handleCancelOrder}
                        />
                      ))
                  ) : (
                    <EmptyState status="delivered" />
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </Card>
      </div>
      <Footer/>
    </div>
  );
}

function OrderItem({ order, onCancel }: {
  order: Order;
  onCancel: (orderId: string) => void;
}) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

const getProductImage = (product: OrderProduct) => {
  return product.image || '/placeholder-product.jpg';
};

const getProductName = (product: OrderProduct) => {
  return product.name || 'Unknown Product';
};


  return (
    <>
     <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <span className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {getStatusText(order.status)}
        </span>
      </div>
      
      {order.products.map((product, index) => (
        <div key={index} className="flex gap-4 mb-4 last:mb-0">
          <img 
            src={getProductImage(product)} 
            alt={getProductName(product)}
            className="w-24 h-24 object-cover rounded border"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {getProductName(product)}
            </h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-500 text-sm">Quantity: {product.quantity}</span>
              <span className="font-semibold text-red-600">
                ${(product.price * product.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <div className="text-sm text-gray-500">
          Ordered on {new Date(order.createdAt).toLocaleDateString()}
        </div>
        <div className="font-semibold">
          Total: ${order.totalAmount.toFixed(2)}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/orders/${order._id}`)}
        >
          Order Details
        </Button>
        {order.status === 'processing' && (
          <Button variant="link" className="text-red-500" size="sm">
            Track Order
          </Button>
        )}
        {['pending', 'processing'].includes(order.status) && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onCancel(order._id)}
          >
            Cancel Order
          </Button>
        )}

        {order.status === 'delivered' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/feedback/${order._id}`)}
          >
            Leave Feedback
          </Button>
        )}
      </div>
    </div>
    
    </>
   
    
  );
}

function EmptyState({ status }: { status: string }) {
  const getEmptyStateContent = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />,
          text: "No pending payment orders"
        };
      case 'processing':
        return {
          icon: <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />,
          text: "No orders in transit"
        };
      case 'delivered':
        return {
          icon: <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />,
          text: "No orders pending feedback"
        };
      default:
        return {
          icon: <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />,
          text: "No orders found"
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="text-center py-8">
      {content.icon}
      <p className="text-gray-500">{content.text}</p>
      <Button className="mt-4" asChild>
        <Link to="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}