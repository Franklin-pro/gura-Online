import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "@/components/ui/sidebar"
import { Link, Outlet } from "react-router-dom"
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, ListOrdered, PackagePlus, LogOut } from "lucide-react"
import { useState } from "react";

export default function AdminLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace with actual auth logic

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
  setIsLoggedIn(false);
  window.location.href = "/login"; // Redirect to login page
}



  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link to="/admin">
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Products">
                  <Package className="w-5 h-5" />
                  <span>Products</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/admin/products">
                        <ListOrdered className="w-4 h-4" />
                        <span>List Products</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link to="/admin/products/create">
                        <PackagePlus className="w-4 h-4" />
                        <span>Create Product</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Customers">
                  <Link to="/admin/customers">
                    <Users className="w-5 h-5" />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                  <Link to="/admin/orders">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/admin/settings">
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout" className="text-red-500 bottom-0">
                  <LogOut className="w-5 h-5" />
                  <span className="text-red-500">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}