import { Plus } from "lucide-react";
import { useState } from "react";
import CreateTaskModal from "@/components/shared/modals/create-task-modal";
import type { ProjectWithTasks } from "@/types/project";
import { ColumnDropzone } from "./column-dropzone";
import { ColumnHeader } from "./column-header";

type ColumnProps = {
  column: ProjectWithTasks["columns"][number];
};

function Column({ column }: ColumnProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDropzoneOver, setIsDropzoneOver] = useState(false);

  return (
    <div
      className={`group relative flex h-full min-h-0 w-full flex-col rounded-2xl transition-all duration-300 ease-out md:rounded-xl md:border ${
        isDropzoneOver
          ? "bg-accent/60 shadow-md ring-2 ring-ring/30 md:border-ring/40"
          : "border-transparent bg-muted/50 shadow-none dark:bg-card/80 md:border-border/70 md:bg-muted/40 md:shadow-xs/5 md:hover:border-border/90 md:dark:bg-card/90"
      }`}
    >
      <CreateTaskModal
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        status={column.id}
      />

      <div className="shrink-0 px-3 pb-1 pt-2 md:border-border/60 md:border-b md:px-3 md:py-2">
        <ColumnHeader column={column} />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-1.5 [-webkit-overflow-scrolling:touch] md:px-2 md:py-2">
        <ColumnDropzone column={column} onIsOverChange={setIsDropzoneOver} />
      </div>

      <div className="px-2 pb-2 pt-0 transition-opacity md:border-border/60 md:border-t md:p-1.5 md:opacity-0 md:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-xs text-muted-foreground transition-all hover:bg-accent/40 hover:text-foreground md:text-sm md:hover:bg-accent/50"
        >
          <Plus className="w-4 h-4" />
          <span>Add task</span>
        </button>
      </div>
    </div>
  );
}

export default Column;
