import { UniqueIdentifier } from "@dnd-kit/core";
import { Column, Task } from "../types/kanban";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token") || "";

export async function fetchKanbanColumns(): Promise<Column[]> {
  try {
    const response = await fetch(`${API_URL}/webhook/gi/kanban-columns`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
    const data: Column[] = await response.json();
    return data.sort((a, b) => a.column_order - b.column_order);
  } catch (error) {
    console.error("fetchKanbanColumns:", error);
    return [];
  }
}

export async function createKanbanColumnAPI(title: string, color: string): Promise<Column | null> {
  try {
    const response = await fetch(`${API_URL}/webhook/gi/kanban-columns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, color }),
    });
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("createKanbanColumnAPI:", error);
    return null;
  }
}

export async function updateKanbanColumnAPI(
  columnId: UniqueIdentifier,
  title: string,
  color: string,
): Promise<Column | null> {
  try {
    const response = await fetch(`${API_URL}/webhook/gi/kanban-columns/${columnId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, color }),
    });
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("updateKanbanColumnAPI:", error);
    return null;
  }
}

export async function deleteKanbanColumnAPI(columnId: UniqueIdentifier): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/webhook/gi/kanban-columns`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(columnId),
    });
    return response.ok;
  } catch (error) {
    console.error("deleteKanbanColumnAPI:", error);
    throw error;
  }
}

export async function updateKanbanColumnsOrderAPI(
  orderedColumns: Array<{ id: UniqueIdentifier; column_order: number }>,
): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/webhook/gi/kanban-columns-order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderedColumns),
    });
    return response.ok;
  } catch (error) {
    console.error("updateKanbanColumnsOrderAPI:", error);
    return false;
  }
}

export async function fetchKanbanLeads(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_URL}/webhook/gi/kanban-leads`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
    const data: Task[] = await response.json();
    return data.map((task) => ({
      ...task,
      id: String(task.id),
      columnId: String(task.columnId),
    }));
  } catch (error) {
    console.error("fetchKanbanLeads:", error);
    return [];
  }
}

export async function updateKanbanLeadPosition(
  leadId: UniqueIdentifier,
  newColumnId: UniqueIdentifier,
  newOrder?: number,
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/webhook/gi/kanban-lead-update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ leadId, newColumnId, newOrder }),
    });
    if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
  } catch (error) {
    console.error("updateKanbanLeadPosition:", error);
    throw error;
  }
}
