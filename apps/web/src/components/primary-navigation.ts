import { useLocation } from "@tanstack/react-router";
import { FolderKanban, type LucideIcon, Mailbox, Users } from "lucide-react";
import { usePendingInvitations } from "@/hooks/queries/invitation/use-pending-invitations";
import useActiveWorkspace from "@/hooks/queries/workspace/use-active-workspace";

export type PrimaryNavigationItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
  badge: number | null;
};

export function usePrimaryNavigationItems(): PrimaryNavigationItem[] {
  const location = useLocation();
  const { data: workspace } = useActiveWorkspace();
  const { data: invitations = [] } = usePendingInvitations();

  if (!workspace) {
    return [];
  }

  const pathname = location.pathname;
  const workspaceRoot = `/dashboard/workspace/${workspace.id}`;
  const membersRoute = `${workspaceRoot}/members`;

  return [
    {
      title: "Projects",
      url: workspaceRoot,
      icon: FolderKanban,
      isActive:
        pathname.startsWith(workspaceRoot) &&
        !pathname.startsWith(membersRoute),
      badge: null,
    },
    {
      title: "Members",
      url: membersRoute,
      icon: Users,
      isActive: pathname === membersRoute,
      badge: null,
    },
    {
      title: "Invitations",
      url: "/dashboard/invitations",
      icon: Mailbox,
      isActive: pathname === "/dashboard/invitations",
      badge: invitations.length > 0 ? invitations.length : null,
    },
  ];
}
