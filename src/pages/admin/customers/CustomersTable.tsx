import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pencil, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface Customer {
  _id: string;
  name: string;
  email: string;
  shippingAddress?: {
    city?: string;
    state?: string;
    country?: string;
  };
  orders?: any[];
  totalSpent?: number;
}

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://gura-online-bn.onrender.com/api/v1/orders/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }

        const data = await response.json();
        
        // Transform order data into customer data
        const customerMap = new Map<string, Customer>();
        
        data.data.forEach((order: any) => {
          const email = order.user?.email || "unknown@example.com";
          const name = order.user?.name || "Unknown Customer";
          
          if (!customerMap.has(email)) {
            customerMap.set(email, {
              _id: order.user?._id || order._id,
              name,
              email,
              shippingAddress: order.shippingAddress || {},
              orders: [],
              totalSpent: 0
            });
          }
          
          const customer = customerMap.get(email);
          if (customer) {
            customer.orders?.push(order);
            customer.totalSpent = (customer.totalSpent || 0) + (order.totalAmount || 0);
          }
        });

        setCustomers(Array.from(customerMap.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLocation = (customer: Customer) => {
    const addr = customer.shippingAddress;
    if (!addr) return "Unknown";
    
    const parts = [];
    if (addr.city) parts.push(addr.city);
    if (addr.state) parts.push(addr.state);
    if (addr.country) parts.push(addr.country);
    
    return parts.length > 0 ? parts.join(", ") : "Unknown";
  };

  if (loading) {
    return (
      <div className="rounded-md border p-4">
        <div className="flex items-center space-x-2 p-4">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between p-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>LOCATION</TableHead>
            <TableHead>ORDERS</TableHead>
            <TableHead>SPENT</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-sm text-gray-500">
                        {customer.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getLocation(customer)}</TableCell>
                <TableCell>{customer.orders?.length || 0}</TableCell>
                <TableCell>${(customer.totalSpent || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {searchTerm ? "No matching customers found" : "No customers found"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}