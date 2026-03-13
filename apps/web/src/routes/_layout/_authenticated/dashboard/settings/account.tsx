import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { Code, Settings, User } from "lucide-react";
import useAuth from "@/components/providers/auth-provider/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/cn";

export const Route = createFileRoute(
  "/_layout/_authenticated/dashboard/settings/account",
)({
  component: RouteComponent,
});

const menuItems = [
  {
    title: "Information",
    url: "/dashboard/settings/account/information",
    icon: User,
  },
  {
    title: "Preferences",
    url: "/dashboard/settings/account/preferences",
    icon: Settings,
  },
];

function RouteComponent() {
  const { user } = useAuth();
  const location = useLocation();
  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="flex h-full flex-col gap-4 md:flex-row md:gap-6">
      <aside className="w-full flex-shrink-0 md:w-64">
        <div className="p-2">
          <div className="mb-1 hidden items-center gap-3 rounded-md px-2 py-2 md:flex">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.image ?? ""} alt={user?.name || ""} />
              <AvatarFallback className="text-xs font-medium border border-border/30">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/70">
                {user?.email}
              </p>
            </div>
          </div>

          <SidebarGroup className="hidden gap-1 p-1 md:flex">
            <SidebarGroupLabel className="h-7 px-2 text-[11px] uppercase tracking-wide text-sidebar-foreground/70">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Button
                      render={<Link to={item.url} />}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-full justify-start gap-2 rounded-lg px-2 text-[11px] font-normal text-sidebar-foreground/80",
                        isActivePath(item.url) &&
                          "bg-sidebar-accent text-sidebar-accent-foreground",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="hidden gap-1 p-1 md:flex">
            <SidebarGroupLabel className="h-7 px-2 text-[11px] uppercase tracking-wide text-sidebar-foreground/70">
              Developer
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                <SidebarMenuItem>
                  <Button
                    render={<Link to="/dashboard/settings/account/developer" />}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-full justify-start gap-2 rounded-lg px-2 text-[11px] font-normal text-sidebar-foreground/80",
                      isActivePath("/dashboard/settings/account/developer") &&
                        "bg-sidebar-accent text-sidebar-accent-foreground",
                    )}
                  >
                    <Code className="h-4 w-4" />
                    <span>API Keys</span>
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="flex gap-2 overflow-x-auto px-1 pt-2 md:hidden">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                render={<Link to={item.url} />}
                variant={isActivePath(item.url) ? "secondary" : "ghost"}
                size="sm"
                className="h-8 shrink-0 gap-1.5 rounded-full px-3 text-xs"
              >
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.title}</span>
              </Button>
            ))}
            <Button
              render={<Link to="/dashboard/settings/account/developer" />}
              variant={
                isActivePath("/dashboard/settings/account/developer")
                  ? "secondary"
                  : "ghost"
              }
              size="sm"
              className="h-8 shrink-0 gap-1.5 rounded-full px-3 text-xs"
            >
              <Code className="h-3.5 w-3.5" />
              <span>API Keys</span>
            </Button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
