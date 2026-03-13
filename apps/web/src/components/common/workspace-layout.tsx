import type { ReactNode } from "react";
import Layout from "@/components/common/layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { KbdSequence } from "@/components/ui/kbd";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { shortcuts } from "@/constants/shortcuts";
import useActiveWorkspace from "@/hooks/queries/workspace/use-active-workspace";
import { cn } from "@/lib/cn";

type WorkspaceLayoutProps = {
  title: string;
  headerActions?: ReactNode;
  children: ReactNode;
  onCreateProject?: () => void;
  className?: string;
  showBreadcrumb?: boolean;
};

export default function WorkspaceLayout({
  title,
  headerActions,
  children,
  className,
  showBreadcrumb = true,
}: WorkspaceLayoutProps) {
  const { data: workspace } = useActiveWorkspace();
  const isSimpleHeader = !showBreadcrumb;

  return (
    <Layout>
      <Layout.Header
        className={cn(isSimpleHeader && "h-auto min-h-11 px-2 py-2.5 md:h-10")}
      >
        <div
          className={cn(
            "flex w-full items-center justify-between",
            isSimpleHeader && "items-start gap-3 md:flex-row md:items-center",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-1 w-full",
              isSimpleHeader && "min-w-0 flex-1",
            )}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger
                    className={cn(
                      "-ml-1 h-6 w-6",
                      isSimpleHeader && "hidden md:flex",
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="flex items-center gap-2 text-[10px]">
                    Toggle sidebar
                    <KbdSequence
                      keys={[
                        shortcuts.sidebar.prefix,
                        shortcuts.sidebar.toggle,
                      ]}
                    />
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div
              className={cn(
                "mx-1.5 h-4 w-px shrink-0 bg-border/80",
                isSimpleHeader && "hidden md:block",
              )}
            />
            {showBreadcrumb ? (
              <Breadcrumb className="flex items-center gap-1 text-xs w-full">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">
                      <span className="text-xs font-normal text-card-foreground">
                        {workspace?.name}
                      </span>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-xs font-normal text-card-foreground">
                      {title}
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            ) : (
              <>
                <div className="flex min-w-0 flex-col md:hidden">
                  {workspace?.name ? (
                    <span className="truncate text-[11px] text-muted-foreground">
                      {workspace.name}
                    </span>
                  ) : null}
                  <h1 className="text-lg leading-none font-semibold text-card-foreground">
                    {title}
                  </h1>
                </div>
                <Breadcrumb className="hidden w-full items-center gap-1 text-xs md:flex">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">
                        <span className="text-xs font-normal text-card-foreground">
                          {workspace?.name}
                        </span>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <span className="text-xs font-normal text-card-foreground">
                        {title}
                      </span>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </>
            )}
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5",
              isSimpleHeader && "w-auto shrink-0 self-start",
              className,
            )}
          >
            {headerActions}
            <div className="md:hidden">
              <UserAvatar settingsPath="/dashboard/settings/account/preferences" />
            </div>
          </div>
        </div>
      </Layout.Header>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}
