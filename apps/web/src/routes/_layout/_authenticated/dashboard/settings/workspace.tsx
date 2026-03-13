import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useWorkspacePermission } from "@/hooks/use-workspace-permission";
import { cn } from "@/lib/cn";

export const Route = createFileRoute(
  "/_layout/_authenticated/dashboard/settings/workspace",
)({
  component: RouteComponent,
});

const menuItems = [
  {
    title: "General",
    url: "/dashboard/settings/workspace/general",
    icon: Settings,
  },
];

function RouteComponent() {
  const { workspace, role } = useWorkspacePermission();
  const location = useLocation();
  const isActivePath = (path: string) => location.pathname === path;
  const workspaceInitials =
    workspace?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "WS";

  return (
    <div className="flex h-full flex-col gap-4 md:flex-row md:gap-6">
      <aside className="w-full flex-shrink-0 md:w-64">
        <div className="p-2">
          <div className="mb-1 hidden items-center gap-3 rounded-md px-2 py-2 md:flex">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={workspace?.logo ?? ""}
                alt={workspace?.name || ""}
              />
              <AvatarFallback className="border border-sidebar-border/70 bg-sidebar-accent/70 text-[11px] font-medium text-sidebar-accent-foreground">
                {workspaceInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm">{workspace?.name}</p>
              <p className="text-[11px] text-sidebar-foreground/60 capitalize">
                {role}
              </p>
            </div>
          </div>

          <SidebarGroup className="hidden gap-1 p-1 md:flex">
            <SidebarGroupLabel className="h-7 px-2 text-[11px] uppercase tracking-wide text-sidebar-foreground/70">
              Workspace
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
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
