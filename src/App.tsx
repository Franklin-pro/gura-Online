import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import ProductDetails from "./pages/ProductDetails";
import CategoryPage from "./pages/CategoryPage";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import { ShopProvider } from "./context/ShopContext";
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/payment-success";
import AdminLayout from "./pages/admin/DashboardLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/products/ListProducts";
import CreateProduct from "./pages/admin/products/CreateProduct";
import Orders from "./pages/admin/orders";
import Customers from "./pages/admin/customers";
import PrivateRoute from "./components/PrivateRoutes";
import ResetPassword from "./pages/ResetPassword";
import OrderDetails from "./pages/OrderDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ShopProvider>
        {/* <Toaster /> */}
        <Sonner />
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            {/* Corrected admin routes */}
            <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/create" element={<CreateProduct />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ShopProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;