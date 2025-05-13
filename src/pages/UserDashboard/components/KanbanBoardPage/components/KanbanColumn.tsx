import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit3, PlusCircle, Trash2 } from "lucide-react";
import React, { useMemo } from "react";

import { UniqueIdentifier } from "@dnd-kit/core";
import { Column, Task } from "../types/kanban";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: UniqueIdentifier) => void;
  isOverlay?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onEditColumn,
  onDeleteColumn,
  isOverlay,
}) => {
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: "Column", column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !isOverlay ? 0.5 : 1,
    boxShadow: isDragging && !isOverlay ? "none" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full md:w-[298px] lg:w-[298px] bg-gray-100 rounded-xl shadow-sm flex flex-col flex-shrink-0 h-full max-h-[calc(100vh-12rem)] ${
        isOverlay ? "ring-2 ring-indigo-500 shadow-2xl" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className={`p-3 ${
          column.color || "bg-gray-300"
        } rounded-t-xl flex justify-between items-center border-b border-gray-300/50 cursor-grab active:cursor-grabbing`}
        style={{ backgroundColor: column.color }}
      >
        <input
          type="text"
          value={column.title}
          readOnly
          className="text-sm font-semibold text-white bg-transparent outline-none truncate w-full mr-2"
          title={column.title}
          onDoubleClick={() => onEditColumn(column)}
        />
        <div className="flex items-center space-x-1 flex-shrink-0">
          <span className="text-xs font-medium text-white bg-black/20 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditColumn(column);
            }}
            className="p-1 text-white/70 hover:text-white hover:bg-black/20 rounded"
            title="Editar Coluna"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteColumn(column.id);
            }}
            className="p-1 text-white/70 hover:text-white hover:bg-black/20 rounded"
            title="Remover Coluna"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <div className="flex-grow p-3 overflow-y-auto overflow-x-hidden">
        {" "}
        {/* Adicionado overflow-x-hidden */}
        {/* A classe md:w-[298px] foi removida daqui, pois a largura da coluna já está definida no container pai */}
        <SortableContext items={taskIds} strategy={undefined}>
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <div className="flex items-center justify-center h-full min-h-[80px]">
              {" "}
              <p className="text-xs text-gray-400 italic text-center py-4">Nenhum lead.</p>{" "}
            </div>
          )}
        </SortableContext>
      </div>
      <div className="p-3 border-t border-gray-200 mt-auto flex-shrink-0">
        <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-md transition-colors">
          <PlusCircle className="w-4 h-4" /> Adicionar Lead
        </button>
      </div>
    </div>
  );
};

export default KanbanColumn;
