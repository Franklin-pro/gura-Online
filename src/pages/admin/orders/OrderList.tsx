import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface Order {
  id: string;
  invoiceId: string;
  customer: string;
  amount: number;
  status: string; // e.g. "paid", "processing"
  orderStatus: string; // e.g. "completed", "pending"
  issueDate: string;
  dueDate?: string | null;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`https://gura-online-bn.onrender.com/api/v1/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await fetch("https://gura-online-bn.onrender.com/api/v1/orders/admin/all", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const json = await response.json();

        // Map API data to Order interface
        const mappedOrders: Order[] = (json.data || []).map((order: any) => ({
          id: order._id,
          invoiceId: order.orderNumber,
          customer: order.user?.name || "Unknown Customer",
          amount: order.totalAmount,
          status: order.paymentStatus || "pending",
          orderStatus: order.status || "pending",
          issueDate: new Date(order.createdAt).toLocaleDateString(),
          dueDate: null, // Or set as needed if you have due date info
        }));

        setOrders(mappedOrders);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      <div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 p-4">
          <input
            type="text"
            placeholder="Search by invoice or customer..."
            className="flex-1 px-4 py-2 border rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => {
              // Optionally trigger refetch or just filter locally
            }}
          >
            Search
          </Button>
        </div>
      </div>

      {loading && <p className="p-4">Loading orders...</p>}
      {error && <p className="p-4 text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">INVOICE</TableHead>
                <TableHead className="min-w-[150px]">CUSTOMER</TableHead>
                <TableHead className="min-w-[100px]">AMOUNT</TableHead>
                <TableHead className="min-w-[100px]">STATUS</TableHead>
                <TableHead className="min-w-[100px]">ISSUED</TableHead>
                <TableHead className="min-w-[150px]">Order Status</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.invoiceId}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={order.customer}>{order.customer}</TableCell>
                  <TableCell className="font-semibold">${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status.toLowerCase() === "paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.issueDate}</TableCell>
                  <TableCell>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`w-full px-2 py-1 border rounded text-xs sm:text-sm font-medium ${
                        order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                        order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                      }`}
                    >
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="shipped">Shipped</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center p-4">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
