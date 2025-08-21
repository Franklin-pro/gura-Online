import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Link, Outlet } from "react-router-dom"
import { LayoutDashboard, Package, Users, ShoppingCart, Settings, ListOrdered, PackagePlus, LogOut, AlignLeft } from "lucide-react"
import { useState } from "react";

function AdminLayoutContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { setOpenMobile } = useSidebar();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const handleLinkClick = () => {
    setOpenMobile(false);
  };



  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar>
        <SidebarHeader className="p-4">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link to="/admin" onClick={handleLinkClick}>
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
                    <Link to="/admin/products" onClick={handleLinkClick}>
                      <ListOrdered className="w-4 h-4" />
                      <span>List Products</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <Link to="/admin/products/create" onClick={handleLinkClick}>
                      <PackagePlus className="w-4 h-4" />
                      <span>Create Product</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Orders">
                <Link to="/admin/orders" onClick={handleLinkClick}>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Orders</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link to="/admin/settings" onClick={handleLinkClick}>
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
      <div className="flex-1 p-2 sm:p-4 lg:p-8">
        <div className="mb-4">
          <SidebarTrigger className="lg:hidden" />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  )
}