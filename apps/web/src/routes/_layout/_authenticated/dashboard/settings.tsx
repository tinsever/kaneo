import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useGetProjects from "@/hooks/queries/project/use-get-projects";
import useActiveWorkspace from "@/hooks/queries/workspace/use-active-workspace";

export const Route = createFileRoute(
  "/_layout/_authenticated/dashboard/settings",
)({
  component: SettingsLayout,
});

function SettingsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: workspace } = useActiveWorkspace();
  const { data: projects } = useGetProjects({
    workspaceId: workspace?.id ?? "",
  });

  const getActiveTab = () => {
    const pathname = location.pathname;
    if (pathname.includes("/dashboard/settings/account")) {
      return "account";
    }
    if (pathname.includes("/dashboard/settings/workspace")) {
      return "workspace";
    }
    if (pathname.includes("/dashboard/settings/projects")) {
      return "project";
    }
    return "account";
  };

  const activeTab = getActiveTab();

  return (
    <>
      <PageTitle title="Settings" />
      <div className="flex h-full w-full flex-col gap-3 bg-sidebar p-2 md:gap-4 md:p-4">
        <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-md border border-border bg-card p-3 md:gap-4 md:p-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate({
                  to: "/dashboard/workspace/$workspaceId",
                  params: { workspaceId: workspace?.id ?? "" },
                })
              }
              className="h-8 px-2 text-xs md:h-auto md:px-3"
            >
              <ChevronLeft className=" border border-border rounded-md p-1 size-6" />
              <span className="hidden md:inline">Back to Workspace</span>
            </Button>

            <h1 className="mt-2 pl-1 text-xl font-semibold md:pl-2 md:text-2xl">
              Settings
            </h1>

            <Tabs value={activeTab} className="w-full pt-2 md:max-w-[400px]">
              <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-sidebar p-1 md:gap-2">
                <TabsTrigger
                  className="[&[data-state=active]]:border [&[data-state=active]]:border-border [&[data-state=active]]:rounded-md [&[data-state=active]]:bg-card"
                  value="account"
                  onClick={() =>
                    navigate({ to: "/dashboard/settings/account/information" })
                  }
                >
                  Account
                </TabsTrigger>
                <TabsTrigger
                  value="workspace"
                  className="[&[data-state=active]]:border [&[data-state=active]]:border-border [&[data-state=active]]:rounded-md [&[data-state=active]]:bg-card"
                  onClick={() =>
                    navigate({ to: "/dashboard/settings/workspace/general" })
                  }
                >
                  Workspace
                </TabsTrigger>
                <TabsTrigger
                  disabled={projects?.length === 0}
                  value="project"
                  className="[&[data-state=active]]:border [&[data-state=active]]:border-border [&[data-state=active]]:rounded-md [&[data-state=active]]:bg-card"
                  onClick={() =>
                    navigate({ to: "/dashboard/settings/projects" })
                  }
                >
                  Projects
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
