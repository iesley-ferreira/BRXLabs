import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DollarSign, GripVertical, Headset } from "lucide-react";
import React from "react";

export interface Task {
  id: string | number;
  columnId: string | number;
  name: string;
  value?: number | null;
  company?: string;
  avatarSeed?: string;
  kanban_order?: number;
}

import AvatarPlaceholder from "./AvatarPlaceholder";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task: { ...task } },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.4 : 1,
    boxShadow: isDragging && !isOverlay ? "none" : undefined,
    zIndex: isDragging ? 100 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`p-3.5 rounded-lg bg-white shadow-md border border-gray-200 hover:shadow-lg ${
        isOverlay ? "ring-2 ring-indigo-500 shadow-2xl cursor-grabbing z-50" : "cursor-grab"
      } mb-3 last:mb-0 transition-shadow duration-200`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center flex-grow min-w-0 mr-2">
          {" "}
          {task.avatarSeed && (
            <AvatarPlaceholder
              className="mr-2 flex-shrink-0"
              seed={task.avatarSeed}
              size="w-6 h-6"
              textSize="text-[9px]"
            />
          )}
          <h4
            className="text-sm font-semibold text-gray-800 leading-tight break-words truncate"
            title={task.name}
          >
            {task.name}
          </h4>
        </div>
        <button
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
          aria-label="Arrastar lead"
        >
          <GripVertical size={16} />
        </button>
      </div>

      {/* Informações do Lead */}
      {task.company && (
        <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1 truncate">
          <Headset className="w-3 h-3 text-gray-400 flex-shrink-0" />
          <span className="truncate" title={task.company}>
            {task.company}
          </span>
        </div>
      )}

      {typeof task.value === "number" && !isNaN(task.value) && (
        <div className="flex items-center space-x-1 text-xs text-green-600 font-medium">
          <DollarSign className="w-3 h-3 text-green-500 flex-shrink-0" />
          <span>{task.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
