import { UniqueIdentifier } from "@dnd-kit/core";

export interface Column {
  id: UniqueIdentifier;
  title: string;
  color?: string;
  column_order: number;
}

export interface Task {
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
  name: string;
  value?: number;
  company?: string;
  avatarSeed?: string;
  kanban_order?: number;
}
