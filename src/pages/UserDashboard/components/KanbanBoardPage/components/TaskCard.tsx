import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Briefcase, DollarSign, GripVertical } from "lucide-react";
import React from "react";
import { Task } from "../types/kanban";
import AvatarPlaceholder from "./AvatarPlaceholder";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "Task", task },
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
      <div className="flex justify-between items-center mb-2">
        {task.avatarSeed && (
          <AvatarPlaceholder
            className="mr-2"
            seed={task.avatarSeed}
            size="w-6 h-6"
            textSize="text-[9px]"
          />
        )}
        <h4 className="text-sm font-semibold text-gray-800 leading-tight flex-grow mr-2 break-words">
          {task.name}
        </h4>
        <button
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
          aria-label="Arrastar lead"
        >
          <GripVertical size={16} />
        </button>
      </div>
      <div className="flex items-center space-x-2 mb-2">
        {task.company && (
          <p className="text-xs text-gray-500 flex items-center truncate">
            <Briefcase className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
            <span className="truncate">{task.company}</span>
          </p>
        )}
      </div>
      {task.value !== undefined && (
        <p className="text-xs text-green-600 font-medium flex items-center">
          <DollarSign className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
          {task.value.toLocaleString("pt-BR")}
        </p>
      )}
    </div>
  );
};

export default TaskCard;
