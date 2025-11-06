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
                <div
                    className="bg-[length:12rem_6rem] sm:bg-[length:16rem_8rem] lg:bg-[length:21rem_9rem] absolute left-1/2 top-1/2 opacity-4 w-[200%] h-[250%] -translate-x-1/2 -translate-y-1/2"
                    style={{
                        backgroundImage: "url(/logo/small-logo-netnam-padding.png)",
                        backgroundRepeat: "repeat space",
                        transform: "rotate(45deg)",
                        transformOrigin: "center",
                    }}
                />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
