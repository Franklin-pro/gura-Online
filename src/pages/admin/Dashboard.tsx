import React, { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUp,
  ArrowDown,
  Package,
  Activity,
  Star,
  PieChart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Dashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [ordersRes, productsRes] = await Promise.all([
          fetch("https://gura-online-bn.onrender.com/api/v1/orders/alls", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch("https://gura-online-bn.onrender.com/api/v1/products", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!ordersRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        setOrders(ordersData.data || []);
        setProducts(productsData.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Calculate metrics
  const metrics = useMemo(() => {
    const pendingOrders = orders.filter(o => o.status === "processing").length;
    const completedOrders = orders.filter(o => o.status === "completed").length;
    const totalIncome = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalIncome / orders.length : 0;
    
    // Calculate average rating from products
    const totalRatings = products.reduce((sum, product) => sum + (product.rating || 0), 0);
    const avgRating = products.length > 0 ? totalRatings / products.length : 0;

    return {
      pendingOrders,
      completedOrders,
      totalOrders: orders.length,
      totalIncome,
      avgOrderValue,
      totalProducts: products.length,
      avgRating,
      categories: [...new Set(products.map(p => p.category))].length
    };
  }, [orders, products]);

  // Prepare monthly data for charts
  const monthlyData = useMemo(() => {
    const months: Record<string, any> = {};
    
    orders.forEach(order => {
      const month = format(new Date(order.createdAt), "MMM");
      if (!months[month]) {
        months[month] = {
          month,
          revenue: 0,
          orders: 0,
          products: products.filter(p => 
            new Date(p.createdAt) <= new Date(order.createdAt)
          ).length
        };
      }
      months[month].revenue += order.totalAmount || 0;
      months[month].orders += 1;
    });

    return Object.values(months).slice(-6); // Last 6 months
  }, [orders, products]);

  // Prepare category data
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    products.forEach(product => {
      const category = product.category || "Uncategorized";
      categories[category] = (categories[category] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      products: products.filter(p => p.category === name).length
    })).sort((a, b) => b.value - a.value);
  }, [products]);

  // Prepare rating distribution
  const ratingData = useMemo(() => {
    const ratings: Record<number, number> = {};
    
    products.forEach(product => {
      const rating = Math.floor(product.rating || 0);
      ratings[rating] = (ratings[rating] || 0) + 1;
    });

    return Object.entries(ratings).map(([name, value]) => ({
      name: `${name} star${name === "1" ? "" : "s"}`,
      value,
      fill: COLORS[parseInt(name) - 1] || COLORS[0]
    }));
  }, [products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            <Activity className="h-4 w-4 mr-2" />
            Live Data
          </Badge>
          <Badge variant="outline">
            Updated: {format(new Date(), "MMM d, h:mm a")}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">${metrics.avgOrderValue.toFixed(2)}</span> avg per order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={metrics.pendingOrders > 0 ? "text-orange-500" : "text-green-600"}>
                {metrics.pendingOrders} pending
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">
              in <span className="text-purple-600">{metrics.categories}</span> categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              across all products
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    name="Revenue ($)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#10b981"
                    name="Orders"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} products`,
                      name
                    ]}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Ratings Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={ratingData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Products" fill="#8884d8">
                    {ratingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Top Category</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {categoryData[0]?.name || "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                {categoryData[0]?.value || 0} products
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="font-medium">Avg Rating</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {metrics.avgRating.toFixed(1)}
              </div>
              <div className="text-sm text-muted-foreground">
                across {metrics.totalProducts} products
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Order Completion</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {metrics.completedOrders}
              </div>
              <div className="text-sm text-muted-foreground">
                {((metrics.completedOrders / metrics.totalOrders) * 100 || 0).toFixed(1)}% rate
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-orange-600" />
                <span className="font-medium">New Products</span>
              </div>
              <div className="text-2xl font-bold mt-2">
                {products.filter(p => new Date(p.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-muted-foreground">
                added last 30 days
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-red-800">
            <div className="flex items-center">
              <span className="font-medium">Error:</span> {error}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}