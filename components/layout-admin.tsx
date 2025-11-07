import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "@/components/header"

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="relative overflow-hidden">
                <Header />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
