import { createFileRoute } from "@tanstack/react-router";
import { Check, LayoutGrid, List, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import CreateWorkspaceModal from "@/components/shared/modals/create-workspace-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import useActiveWorkspace from "@/hooks/queries/workspace/use-active-workspace";
import useGetWorkspaces from "@/hooks/queries/workspace/use-get-workspaces";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/lib/toast";
import { useUserPreferencesStore } from "@/store/user-preferences";
import type { Workspace } from "@/types/workspace";

export const Route = createFileRoute(
  "/_layout/_authenticated/dashboard/settings/account/preferences",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const isMobile = useIsMobile();
  const { data: activeWorkspace } = useActiveWorkspace();
  const { data: workspaces = [] } = useGetWorkspaces();
  const workspaceOptions = workspaces ?? [];
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState(false);
  const {
    theme,
    setTheme,
    viewMode,
    setViewMode,
    compactMode,
    setCompactMode,
    showTaskNumbers,
    setShowTaskNumbers,
    showAssignees,
    setShowAssignees,
    showDueDates,
    setShowDueDates,
    showLabels,
    setShowLabels,
    showPriority,
    setShowPriority,
    resetDisplayPreferences,
    sidebarDefaultOpen,
    setSidebarDefaultOpen,
  } = useUserPreferencesStore();

  const handleWorkspaceChange = async (workspaceId: string) => {
    if (
      !workspaceId ||
      workspaceId === activeWorkspace?.id ||
      isSwitchingWorkspace
    ) {
      return;
    }

    const nextWorkspace = workspaceOptions.find(
      (workspace) => workspace.id === workspaceId,
    );

    if (!nextWorkspace) {
      return;
    }

    setIsSwitchingWorkspace(true);

    try {
      await authClient.organization.setActive({
        organizationId: nextWorkspace.id,
      });
      toast.success(`Switched to ${nextWorkspace.name}`);
    } catch (error) {
      console.error("Failed to switch workspace:", error);
      toast.error("Failed to switch workspace");
    } finally {
      setIsSwitchingWorkspace(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6 px-3 pb-6 md:space-y-8 md:px-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Preferences</h1>
          <p className="text-muted-foreground">
            Customize your Kaneo experience.
          </p>
        </div>

        {isMobile ? (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-md font-medium">Workspace</h2>
              <p className="text-xs text-muted-foreground">
                Choose which workspace the app should use.
              </p>
            </div>

            <div className="space-y-4 rounded-md border border-border bg-sidebar p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">
                    Active Workspace
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Projects, members, and settings follow this selection.
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="outline"
                        className="w-full justify-between md:w-[240px]"
                        disabled={isSwitchingWorkspace}
                      />
                    }
                  >
                    <span className="truncate">
                      {isSwitchingWorkspace
                        ? "Switching..."
                        : (activeWorkspace?.name ?? "Select workspace")}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[240px]">
                    {workspaceOptions.map((workspace: Workspace) => (
                      <DropdownMenuItem
                        key={workspace.id}
                        onClick={() => handleWorkspaceChange(workspace.id)}
                        disabled={isSwitchingWorkspace}
                        className="justify-between"
                      >
                        <span className="truncate">{workspace.name}</span>
                        {workspace.id === activeWorkspace?.id ? (
                          <Check className="size-4" />
                        ) : null}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsCreateWorkspaceOpen(true)}
                      disabled={isSwitchingWorkspace}
                    >
                      <Plus className="size-4" />
                      Add workspace
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-md font-medium">Appearance</h2>
            <p className="text-xs text-muted-foreground">
              Visual settings and layout preferences.
            </p>
          </div>

          <div className="space-y-4 rounded-md border border-border bg-sidebar p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Theme</Label>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <Select
                value={theme}
                onValueChange={(value) => value && setTheme(value)}
              >
                <SelectTrigger className="w-full !py-4 md:w-auto">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 rounded-md border border-border bg-muted p-1">
                        <span className="size-2 rounded-full bg-primary" />
                        <span className="text-xs font-normal text-foreground">
                          Aa
                        </span>
                      </div>
                      <span className="text-xs font-normal">Light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
                        <span className="size-2 rounded-full bg-primary" />
                        <span className="text-xs font-normal text-foreground">
                          Aa
                        </span>
                      </div>
                      <span className="text-xs font-normal">Dark</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <span className="text-xs font-normal">System</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Default View</Label>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred task view mode
                </p>
              </div>
              <Select
                value={viewMode}
                onValueChange={(value) => value && setViewMode(value)}
              >
                <SelectTrigger className="w-full !py-4 md:w-auto">
                  <SelectValue placeholder="Select a view mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="board">
                    <div className="flex items-center gap-3">
                      <LayoutGrid className="mr-1 h-4 w-4" />
                      <span className="text-xs font-normal">Board</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="list">
                    <div className="flex items-center gap-3">
                      <List className="mr-1 h-4 w-4" />
                      <span className="text-xs font-normal">List</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Compact Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Use reduced spacing for more content
                </p>
              </div>
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Sidebar Default</Label>
                <p className="text-xs text-muted-foreground">
                  Keep the desktop sidebar expanded on startup
                </p>
              </div>
              <Switch
                checked={sidebarDefaultOpen}
                onCheckedChange={setSidebarDefaultOpen}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3 md:items-center">
            <div className="space-y-1">
              <h2 className="text-md font-medium">Display options</h2>
              <p className="text-xs text-muted-foreground">
                Choose which information to show in task views
              </p>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={resetDisplayPreferences}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="space-y-4 rounded-md border border-border bg-sidebar p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Task Numbers</Label>
                <p className="text-xs text-muted-foreground">
                  Show task IDs and numbers
                </p>
              </div>
              <Switch
                checked={showTaskNumbers}
                onCheckedChange={setShowTaskNumbers}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Assignees</Label>
                <p className="text-xs text-muted-foreground">
                  Show who&apos;s assigned to tasks
                </p>
              </div>
              <Switch
                checked={showAssignees}
                onCheckedChange={setShowAssignees}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Due Dates</Label>
                <p className="text-xs text-muted-foreground">
                  Display task deadlines
                </p>
              </div>
              <Switch
                checked={showDueDates}
                onCheckedChange={setShowDueDates}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Labels</Label>
                <p className="text-xs text-muted-foreground">
                  Show task labels and tags
                </p>
              </div>
              <Switch checked={showLabels} onCheckedChange={setShowLabels} />
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Priority</Label>
                <p className="text-xs text-muted-foreground">
                  Display priority indicators
                </p>
              </div>
              <Switch
                checked={showPriority}
                onCheckedChange={setShowPriority}
              />
            </div>
          </div>
        </div>
      </div>

      <CreateWorkspaceModal
        open={isCreateWorkspaceOpen}
        onClose={() => setIsCreateWorkspaceOpen(false)}
      />
    </>
  );
}
