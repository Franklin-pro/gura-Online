import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Payment Successful!</h1>
        <div className="space-y-2 text-gray-600">
          <p className="text-sm">Transaction Number: 14953829359</p>
          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between py-2">
              <span>Amount Paid:</span>
              <span className="font-semibold">$250</span>
            </div>
            <div className="flex justify-between">
              <span>Bank:</span>
              <span>Mellat Bank</span>
            </div>
          </div>
        </div>
        <Button asChild className="w-full bg-red-500 hover:bg-red-600">
          <Link to="/profile">View Orders</Link>
        </Button>
      </Card>
    </div>
  )
}