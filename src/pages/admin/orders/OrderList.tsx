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
  status: "paid" | "pending";
  issueDate: string;
  dueDate: string;
}

const orders: Order[] = [
  {
    id: "1",
    invoiceId: "INV-0019",
    customer: "ACME SRL",
    amount: 55.5,
    status: "paid",
    issueDate: "01/02/2024",
    dueDate: "08/02/2024",
  },
  {
    id: "2",
    invoiceId: "INV-0018",
    customer: "Blind Spots Inc.",
    amount: 688.9,
    status: "paid",
    issueDate: "01/02/2024",
    dueDate: "07/02/2024",
  },
  {
    id: "3",
    invoiceId: "INV-0017",
    customer: "Beauty Clinic SRL",
    amount: 695.2,
    status: "paid",
    issueDate: "01/02/2024",
    dueDate: "10/02/2024",
  },
  {
    id: "4",
    invoiceId: "INV-0021",
    customer: "Matt Jason",
    amount: 523.11,
    status: "pending",
    issueDate: "30/01/2024",
    dueDate: "28/02/2024",
  },
  {
    id: "5",
    invoiceId: "INV-0020",
    customer: "Matt Jason",
    amount: 253.76,
    status: "pending",
    issueDate: "30/01/2024",
    dueDate: "15/02/2024",
  },
];

export default function OrdersTable() {
  return (
    <div className="rounded-md border">
      <div>
        <div className="flex items-center space-x-2 p-4">
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-md"
          />
          <Button variant="outline" size="sm">
            Search
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>INVOICE</TableHead>
            <TableHead>CUSTOMER</TableHead>
            <TableHead>AMOUNT</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>ISSUED</TableHead>
            <TableHead>DUE</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.invoiceId}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>${order.amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={order.status === "paid" ? "default" : "secondary"}
                >
                  {order.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{order.issueDate}</TableCell>
              <TableCell>{order.dueDate}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
