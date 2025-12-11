"use client"
import * as React from "react"
import {
  Link,
  Settings,
  Share2,
  Columns3CogIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { getCurrentUser } from "@/lib/api"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // ✅ Now this runs *during* a request, so cookies() works
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    getCurrentUser().then(({ user }: any) => setUser(user ?? "anonymous"))
  }, [])

  const data = {
    user: {
      name: user ? "Admin" : "Loading...",
      email: user ?? "anonymous",
      avatar: '/logo/small-logo-netnam.png',
    },
    navMain: [
      { title: "URL", url: "/admin/url", icon: Link },
      { title: "Share", url: "/admin/share-platform", icon: Share2 },
      { title: "Customize Templates", url: "/admin/customize", icon: Columns3CogIcon },
      { title: "Settings", url: "#", icon: Settings },
    ],
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#" className="flex items-center gap-2 sm:gap-3">
                <img
                  src="/logo/small-logo-netnam.png"
                  alt="Logo"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <h1 className="font-medium text-sm sm:text-base">Netnam AIIA</h1>
                  <span className="text-xs text-muted-foreground">v1.0.0</span>
                </div>
              </a>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
