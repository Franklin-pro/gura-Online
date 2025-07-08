import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  CreditCard, 
  User, 
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Eye,
  Download
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from "axios";
import { toast } from "@/components/ui/sonner";

interface User {
  _id: string;
  name: string;
  email: string;
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
  user: User;
  products: OrderProduct[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street?: string;
    city?: string;
    state?: string;
    address?: string;
    country?: string;
  };
  stripeSessionId?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  location?: string;
}

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  console.log("Order ID:", orderId);
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [showTracking, setShowTracking] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://gura-online-bn.onrender.com/api/v1/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
      navigate('/profile'); // Redirect back to profile if order not found
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingInfo = async () => {
    if (!order?.trackingNumber) {
      // Generate mock tracking events for demonstration
      generateMockTrackingEvents();
      return;
    }

    try {
      setTrackingLoading(true);
      // In a real app, you'd call a tracking API here
      const response = await axios.get(`https://gura-online-bn.onrender.com/api/v1/orders/${orderId}/tracking`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setTrackingEvents(response.data.trackingEvents);
    } catch (error) {
      console.error('Error fetching tracking info:', error);
      // Fallback to mock tracking events
      generateMockTrackingEvents();
    } finally {
      setTrackingLoading(false);
    }
  };

  const generateMockTrackingEvents = () => {
    const mockEvents: TrackingEvent[] = [];
    
    if (order?.paymentStatus === 'paid') {
      mockEvents.push({
        id: '1',
        status: 'confirmed',
        description: 'Order confirmed and payment received',
        timestamp: order.createdAt,
        location: 'Online'
      });

      const processingDate = new Date(order.createdAt);
      processingDate.setHours(processingDate.getHours() + 2);
      
      mockEvents.push({
        id: '2',
        status: 'processing',
        description: 'Order is being prepared for shipment',
        timestamp: processingDate.toISOString(),
        location: 'Warehouse'
      });

      const shippedDate = new Date(order.createdAt);
      shippedDate.setDate(shippedDate.getDate() + 1);
      
      mockEvents.push({
        id: '3',
        status: 'shipped',
        description: 'Package has been shipped',
        timestamp: shippedDate.toISOString(),
        location: 'Distribution Center'
      });

      const inTransitDate = new Date(order.createdAt);
      inTransitDate.setDate(inTransitDate.getDate() + 2);
      
      mockEvents.push({
        id: '4',
        status: 'in_transit',
        description: 'Package is on the way to your address',
        timestamp: inTransitDate.toISOString(),
        location: 'Local Facility'
      });
    }

    setTrackingEvents(mockEvents);
  };

  const handleTrackOrder = () => {
    setShowTracking(!showTracking);
    if (!showTracking && trackingEvents.length === 0) {
      fetchTrackingInfo();
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await axios.put(`https://gura-online-bn.onrender.com/api/v1/orders/${order._id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success("Order cancelled successfully");
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Payment';
      case 'paid':
        return 'Paid';
      case 'failed':
        return 'Payment Failed';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  const getTrackingIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'in_transit':
        return <MapPin className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p>Loading order details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Order not found</p>
              <Button onClick={() => navigate('/profile')}>
                Back to Profile
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-gray-600">Order #{order._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          <Badge className={getStatusColor(order.paymentStatus)}>
            {getStatusText(order.paymentStatus)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.products.map((product, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">
                            Quantity: {product.quantity}
                          </span>
                          <span className="font-semibold text-red-600">
                            {formatPrice(product.price * product.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Information */}
            {order.paymentStatus === 'paid' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Order Tracking
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTrackOrder}
                      disabled={trackingLoading}
                    >
                      {trackingLoading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4 mr-2" />
                      )}
                      {showTracking ? 'Hide Tracking' : 'Track Order'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showTracking && (
                  <CardContent>
                    <div className="space-y-4">
                      {trackingEvents.map((event, index) => (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {getTrackingIcon(event.status)}
                            {index < trackingEvents.length - 1 && (
                              <div className="w-px h-8 bg-gray-200 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <h4 className="font-medium text-gray-900">{event.description}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatDate(event.timestamp)}
                            </p>
                            {event.location && (
                              <p className="text-sm text-gray-500 mt-1">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {event.location}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900">{order.user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900">{order.user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Order Date</label>
                    <p className="text-gray-900">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-900">
                    {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                    {order.shippingAddress.city && (
                      <p>
                        {order.shippingAddress.city}
                        {order.shippingAddress.state && `, ${order.shippingAddress.state}`},
                        {order.shippingAddress.address && ` ${order.shippingAddress.address}`}
                      </p>
                    )}
                    {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.paymentStatus === 'paid' && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleTrackOrder}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Track Order
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>

                  {order.paymentStatus === 'pending' && (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleCancelOrder}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}