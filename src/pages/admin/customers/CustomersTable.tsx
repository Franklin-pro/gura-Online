import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pencil } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  orders: number;
  spent: number;
}

const customers: Customer[] = [
  {
    id: "1",
    name: "Carson Darrin",
    email: "carson.darrin@devias.io",
    location: "Cleveland, Ohio, USA",
    orders: 3,
    spent: 300.0,
  },
  {
    id: "2",
    name: "Fran Perez",
    email: "fran.perez@devias.io",
    location: "Atlanta, Georgia, USA",
    orders: 0,
    spent: 0,
  },
  {
    id: "3",
    name: "Jie Yan Song",
    email: "jie.yan.song@devias.io",
    location: "North Canton, Ohio, USA",
    orders: 6,
    spent: 5600.0,
  },
  {
    id: "4",
    name: "Anika Visser",
    email: "anika.visser@devias.io",
    location: "Madrid, Madrid, Spain",
    orders: 1,
    spent: 300.0,
  },
  {
    id: "5",
    name: "Miron Vitold",
    email: "miron.vitold@devias.io",
    location: "San Diego, California, USA",
    orders: 0,
    spent: 0,
  },
];

export default function CustomersTable() {
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
            <TableHead>NAME</TableHead>
            <TableHead>LOCATION</TableHead>
            <TableHead>ORDERS</TableHead>
            <TableHead>SPENT</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-sm text-gray-500">
                      {customer.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{customer.location}</TableCell>
              <TableCell>{customer.orders}</TableCell>
              <TableCell>${customer.spent.toFixed(2)}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
