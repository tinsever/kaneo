import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDays, LayoutGrid, Plus } from "lucide-react";
import { useState } from "react";
import WorkspaceLayout from "@/components/common/workspace-layout";
import PageTitle from "@/components/page-title";
import CreateProjectModal from "@/components/shared/modals/create-project-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import icons from "@/constants/project-icons";
import { shortcuts } from "@/constants/shortcuts";
import type getProjects from "@/fetchers/project/get-projects";
import useGetProjects from "@/hooks/queries/project/use-get-projects";
import { useRegisterShortcuts } from "@/hooks/use-keyboard-shortcuts";

export const Route = createFileRoute(
  "/_layout/_authenticated/dashboard/workspace/$workspaceId/",
)({
  component: RouteComponent,
});

type ProjectListItem = NonNullable<
  Awaited<ReturnType<typeof getProjects>>
>[number];

function getProjectStatus(project: ProjectListItem) {
  if (project.statistics.totalTasks === 0) return "Not started";
  if (project.statistics.completionPercentage === 100) return "Complete";
  return "In progress";
}

function getProjectStatusVariant(project: ProjectListItem) {
  if (project.statistics.totalTasks === 0) return "secondary" as const;
  if (project.statistics.completionPercentage === 100)
    return "default" as const;
  return "outline" as const;
}

function formatDueDate(dueDate: string | null | undefined) {
  if (!dueDate) return null;

  return new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectCreateButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="xs"
      onClick={onClick}
      className="gap-1.5 self-end sm:self-auto"
      aria-label="Create project"
    >
      <Plus className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Create project</span>
    </Button>
  );
}

function MobileProjectSkeletonList() {
  return (
    <div className="space-y-3 p-3 md:hidden">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border/80 bg-card px-3.5 py-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileProjectCards({
  projects,
  onProjectClick,
}: {
  projects: ProjectListItem[];
  onProjectClick: (projectId: string) => void;
}) {
  return (
    <div className="space-y-3 p-3 md:hidden">
      {projects.map((project) => {
        if (!project?.id || !project.statistics) return null;

        const IconComponent =
          icons[project.icon as keyof typeof icons] || icons.Layout;
        const statusText = getProjectStatus(project);
        const dueDate = formatDueDate(project.statistics.dueDate);

        return (
          <button
            key={project.id}
            type="button"
            onClick={() => onProjectClick(project.id)}
            className="w-full rounded-xl border border-border/80 bg-card px-3.5 py-3 text-left shadow-xs/5 transition-colors hover:bg-accent/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <IconComponent className="w-4.5 h-4.5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-card-foreground">
                    {project.name}
                  </div>
                </div>
              </div>
              <Badge
                variant={getProjectStatusVariant(project)}
                className="shrink-0"
              >
                {statusText}
              </Badge>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-3">
                <Progress
                  value={project.statistics.completionPercentage}
                  className="flex-1 gap-0"
                />
                <span className="text-sm tabular-nums text-muted-foreground">
                  {project.statistics.completionPercentage}%
                </span>
              </div>
            </div>

            {dueDate ? (
              <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="size-3.5" />
                <span>{dueDate}</span>
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function RouteComponent() {
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const { workspaceId } = Route.useParams();
  const navigate = useNavigate();
  const { data: projects, isLoading } = useGetProjects({
    workspaceId,
  });

  const handleCreateProject = () => {
    setIsCreateProjectOpen(true);
  };

  useRegisterShortcuts({
    sequentialShortcuts: {
      [shortcuts.project.prefix]: {
        [shortcuts.project.create]: handleCreateProject,
      },
    },
  });

  const handleProjectClick = (projectId: string) => {
    navigate({
      to: "/dashboard/workspace/$workspaceId/project/$projectId/board",
      params: { workspaceId, projectId },
    });
  };

  if (isLoading) {
    return (
      <>
        <PageTitle title="Projects" />
        <WorkspaceLayout
          title="Projects"
          showBreadcrumb={false}
          headerActions={<ProjectCreateButton onClick={handleCreateProject} />}
        >
          <MobileProjectSkeletonList />
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-foreground font-medium">
                  Title
                </TableHead>
                <TableHead className="text-foreground font-medium">
                  Progress
                </TableHead>
                <TableHead className="text-foreground font-medium">
                  Target date
                </TableHead>
                <TableHead className="text-foreground font-medium">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-2 w-20" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="py-3">
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </WorkspaceLayout>
      </>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <>
        <PageTitle title="Projects" />
        <WorkspaceLayout
          title="Projects"
          showBreadcrumb={false}
          headerActions={<ProjectCreateButton onClick={handleCreateProject} />}
        >
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-xl bg-muted flex items-center justify-center">
                <LayoutGrid className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No projects yet</h3>
                <p className="text-muted-foreground">
                  Get started by creating your first project.
                </p>
              </div>
              <Button onClick={handleCreateProject} className="gap-2 ">
                <Plus className="w-4 h-4" />
                Create project
              </Button>
            </div>
          </div>
        </WorkspaceLayout>

        <CreateProjectModal
          open={isCreateProjectOpen}
          onClose={() => setIsCreateProjectOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <PageTitle title="Projects" />
      <WorkspaceLayout
        title="Projects"
        showBreadcrumb={false}
        headerActions={<ProjectCreateButton onClick={handleCreateProject} />}
      >
        <MobileProjectCards
          projects={projects}
          onProjectClick={handleProjectClick}
        />

        <Table className="hidden md:table">
          <TableHeader className="p-4">
            <TableRow>
              <TableHead className="text-foreground font-medium">
                Title
              </TableHead>
              <TableHead className="text-foreground font-medium">
                Progress
              </TableHead>
              <TableHead className="text-foreground font-medium">
                Due date
              </TableHead>
              <TableHead className="text-foreground font-medium">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => {
              if (!project || !project.id || !project.statistics) return null;

              const IconComponent =
                icons[project.icon as keyof typeof icons] || icons.Layout;

              return (
                <TableRow
                  key={project.id}
                  className="cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{project.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={project.statistics.completionPercentage}
                        className="w-16 h-2"
                      />
                      <span className="text-sm text-muted-foreground">
                        {project.statistics.completionPercentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">
                      {formatDueDate(project.statistics.dueDate) ??
                        "No due date"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant={getProjectStatusVariant(project)}>
                      {getProjectStatus(project)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </WorkspaceLayout>

      <CreateProjectModal
        open={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
    </>
  );
}
