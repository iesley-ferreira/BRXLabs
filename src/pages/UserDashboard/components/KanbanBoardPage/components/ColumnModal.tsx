import { UniqueIdentifier } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Column } from "../types/kanban";

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, color: string, columnId?: UniqueIdentifier) => void;
  column?: Column | null;
}

const ColumnModal: React.FC<ColumnModalProps> = ({ isOpen, onClose, onSave, column }) => {
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#A0AEC0");

  useEffect(() => {
    if (column) {
      setTitle(column.title);
      setColor(column.color || "#A0AEC0");
    } else {
      setTitle("");
      setColor("#A0AEC0");
    }
  }, [column, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) onSave(title.trim(), color, column?.id);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          {column ? "Editar Coluna" : "Adicionar Nova Coluna"}
        </h2>
        <div>
          <label htmlFor="columnTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Título da Coluna
          </label>
          <input
            id="columnTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="columnColor" className="block text-sm font-medium text-gray-700 mb-1">
            Cor da Coluna
          </label>
          <div className="flex items-center gap-2">
            <input
              id="columnColor"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 p-0 border-none rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              title="Insira uma cor hexadecimal válida (ex: #FF0000)"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default ColumnModal;
