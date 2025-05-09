import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { PlusCircle, RefreshCw } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import ColumnModal from "./components/ColumnModal";
import KanbanColumn from "./components/KanbanColumn";
import TaskCard from "./components/TaskCard";
import {
  createKanbanColumnAPI,
  deleteKanbanColumnAPI,
  fetchKanbanColumns,
  fetchKanbanLeads,
  updateKanbanColumnAPI,
  updateKanbanColumnsOrderAPI,
  updateKanbanLeadPosition,
} from "./services/kanbanAPI";
import { Column, Task } from "./types/kanban";

const KanbanBoardPage: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [draggingTaskOriginalState, setDraggingTaskOriginalState] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  const loadBoardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedColumns, fetchedTasks] = await Promise.all([
        fetchKanbanColumns(),
        fetchKanbanLeads(),
      ]);
      setColumns(fetchedColumns);
      setTasks(fetchedTasks);
    } catch (err) {
      setError("Falha ao carregar dados. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBoardData();
  }, []);

  const tasksByColumn = useMemo(() => {
    const grouped = columns.reduce((acc, column) => {
      acc[column.id] = tasks
        .filter((task) => task.columnId === column.id)
        .sort(
          (a, b) => (a.kanban_order ?? tasks.indexOf(a)) - (b.kanban_order ?? tasks.indexOf(b)),
        );
      return acc;
    }, {} as Record<UniqueIdentifier, Task[]>);
    return grouped;
  }, [columns, tasks]);

  const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "Task") {
      const currentTask = active.data.current.task as Task;
      setActiveTask(currentTask);
      setDraggingTaskOriginalState({ ...currentTask });
    } else if (active.data.current?.type === "Column") {
      setActiveColumn(active.data.current.column as Column);
    } else {
      setActiveTask(null);
      setActiveColumn(null);
      setDraggingTaskOriginalState(null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !active.data.current) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const activeType = active.data.current.type;
    if (activeType === "Task") {
      const overIsColumn = over.data.current?.type === "Column";
      const overIsTask = over.data.current?.type === "Task";
      setTasks((prevTasks) => {
        const activeTaskIndex = prevTasks.findIndex((t) => t.id === activeId);
        if (activeTaskIndex === -1) return prevTasks;
        const newTasks = [...prevTasks];
        const taskToMove = { ...newTasks[activeTaskIndex] };
        if (overIsColumn) {
          if (taskToMove.columnId !== overId) {
            taskToMove.columnId = overId;
            newTasks[activeTaskIndex] = taskToMove;
            return newTasks;
          }
        } else if (overIsTask) {
          const overTaskIndex = newTasks.findIndex((t) => t.id === overId);
          if (overTaskIndex === -1) return prevTasks;
          const overTask = newTasks[overTaskIndex];
          if (taskToMove.columnId !== overTask.columnId) {
            taskToMove.columnId = overTask.columnId;
            newTasks[activeTaskIndex] = taskToMove;
            return arrayMove(newTasks, activeTaskIndex, overTaskIndex);
          } else {
            return arrayMove(newTasks, activeTaskIndex, overTaskIndex);
          }
        }
        return prevTasks;
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const activeType = active.data.current?.type;
    // const currentTask = activeTask;
    const originalState = draggingTaskOriginalState;
    setActiveTask(null);
    setActiveColumn(null);
    setDraggingTaskOriginalState(null);

    if (!over || !active.data.current) {
      if (
        activeType === "Task" &&
        originalState &&
        tasks.find((t) => t.id === active.id)?.columnId !== originalState.columnId
      ) {
        setTasks((prev) => prev.map((t) => (t.id === active.id ? originalState : t)));
      }
      return;
    }

    if (activeType === "Task") {
      if (!originalState) return;
      const updatedTask = tasks.find((t) => t.id === active.id);
      if (!updatedTask) return;

      const newColumnId = updatedTask.columnId;
      const tasksInNewColumn = tasks.filter((t) => t.columnId === newColumnId);
      const newOrderInColumn = tasksInNewColumn.findIndex((t) => t.id === active.id);

      const columnChanged = originalState.columnId !== newColumnId;
      const orderChanged = originalState.kanban_order !== newOrderInColumn;

      if (columnChanged || orderChanged) {
        try {
          await updateKanbanLeadPosition(active.id, newColumnId, newOrderInColumn);
          loadBoardData();
        } catch (error) {
          console.error("Erro ao salvar posição:", error);
          setError("Erro ao salvar posição. Recarregando...");
          loadBoardData();
        }
      }
    } else if (activeType === "Column" && active.id !== over.id) {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      const reordered = arrayMove(columns, oldIndex, newIndex);
      setColumns(reordered);
      const updates = reordered.map((col, idx) => ({ id: col.id, column_order: idx }));
      try {
        await updateKanbanColumnsOrderAPI(updates);
      } catch (error) {
        console.error("Erro ao reordenar colunas:", error);
        setError("Erro ao reordenar colunas. Recarregando...");
        loadBoardData();
      }
    }
  };

  const handleOpenAddColumnModal = () => {
    setEditingColumn(null);
    setIsColumnModalOpen(true);
  };

  const handleOpenEditColumnModal = (column: Column) => {
    setEditingColumn(column);
    setIsColumnModalOpen(true);
  };

  const handleSaveColumn = async (title: string, color: string, columnId?: UniqueIdentifier) => {
    setIsLoading(true);
    try {
      let saved: Column | null;
      if (columnId) {
        saved = await updateKanbanColumnAPI(columnId, title, color);
      } else {
        saved = await createKanbanColumnAPI(title, color);
      }
      if (saved) loadBoardData();
      else throw new Error("Erro na criação/atualização da coluna");
      setIsColumnModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar coluna:", error);
      setError("Erro ao salvar coluna.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteColumn = async (columnId: UniqueIdentifier) => {
    const hasTasks = tasks.some((t) => t.columnId === columnId);
    if (hasTasks) {
      alert("Remova os leads antes de excluir a coluna.");
      return;
    }
    if (!confirm("Tem certeza que deseja excluir esta coluna?")) return;
    setIsLoading(true);
    try {
      await deleteKanbanColumnAPI(columnId);
      loadBoardData();
    } catch (error) {
      console.error("Erro ao excluir coluna:", error);
      setError("Erro ao excluir coluna.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && columns.length === 0 && tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Carregando quadro Kanban...
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={loadBoardData}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-100 p-4 md:p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Funil de Vendas</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={loadBoardData}
            className="p-2 rounded-md hover:bg-gray-200 text-gray-600"
            title="Recarregar Quadro"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenAddColumnModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-indigo-700"
          >
            <PlusCircle size={16} /> Nova Coluna
          </button>
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 md:gap-6 flex-grow overflow-x-auto pb-4">
          <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasksByColumn[column.id] || []}
                onEditColumn={handleOpenEditColumnModal}
                onDeleteColumn={handleDeleteColumn}
              />
            ))}
          </SortableContext>
        </div>
        {typeof document !== "undefined" &&
          createPortal(
            <>
              {activeTask && <TaskCard task={activeTask} isOverlay />}
              {activeColumn && (
                <KanbanColumn
                  column={activeColumn}
                  tasks={tasksByColumn[activeColumn.id] || []}
                  onEditColumn={() => {}}
                  onDeleteColumn={() => {}}
                  isOverlay
                />
              )}
            </>,
            document.body,
          )}
      </DndContext>
      <ColumnModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onSave={handleSaveColumn}
        column={editingColumn}
      />
    </div>
  );
};

export default KanbanBoardPage;
