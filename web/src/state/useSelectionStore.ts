import { create } from "zustand";

interface SelectionState {
  hoveredId: string | null;
  selectedId: string | null;
  setHovered: (id: string | null) => void;
  setSelected: (id: string | null) => void;
}

export const useSelectionStore = create<SelectionState>(set => ({
  hoveredId: null,
  selectedId: null,
  setHovered: id => set({ hoveredId: id }),
  setSelected: id => set({ selectedId: id })
}));

