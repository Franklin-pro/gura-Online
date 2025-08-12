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
        <div className="flex items-center space-x-2 p-4">
          <input
            type="text"
            placeholder="Search by invoice or customer..."
            className="px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>INVOICE</TableHead>
              <TableHead>CUSTOMER</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ISSUED</TableHead>
              <TableHead>Order Stutus</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.invoiceId}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
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
                    <Badge
                      variant={
                        order.orderStatus.toLowerCase() === "completed"
                          ? "default"
                          : order.orderStatus.toLowerCase() === "processing"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {order.orderStatus.toUpperCase()}
                    </Badge>
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
      )}
    </div>
  );
}
