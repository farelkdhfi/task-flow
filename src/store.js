import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export const COLUMN_COLORS = [
  "bg-neutral-500 text-neutral-500",
  "bg-red-500 text-red-500",
  "bg-orange-500 text-orange-500",
  "bg-amber-500 text-amber-500",
  "bg-green-500 text-green-500",
  "bg-emerald-500 text-emerald-500",
  "bg-teal-500 text-teal-500",
  "bg-cyan-500 text-cyan-500",
  "bg-sky-500 text-sky-500",
  "bg-blue-500 text-blue-500",
  "bg-indigo-500 text-indigo-500",
  "bg-violet-500 text-violet-500",
  "bg-purple-500 text-purple-500",
  "bg-fuchsia-500 text-fuchsia-500",
  "bg-pink-500 text-pink-500",
  "bg-rose-500 text-rose-500",
];

// Helper untuk warna acak kolom baru
const getRandomColor = () => {
  return COLUMN_COLORS[Math.floor(Math.random() * COLUMN_COLORS.length)];
};

export const useTaskStore = create(
  persist(
    (set) => ({
      // Default Columns
      columns: [
        { id: "todo", title: "To Do", color: "bg-neutral-500 text-neutral-500" },
        { id: "doing", title: "In Progress", color: "bg-blue-500 text-blue-500" },
        { id: "done", title: "Done", color: "bg-green-500 text-green-500" },
      ],
      tasks: [
        { 
          id: "1", 
          columnId: "todo", 
          content: "Setup Project React", 
          image: null, 
          tags: ["bg-blue-500"] 
        },
      ],
      
      // Actions for Tasks
      addTask: (columnId, content) =>
        set((state) => ({
          tasks: [...state.tasks, { 
            id: uuidv4(), 
            columnId, 
            content, 
            image: null, 
            tags: [] 
          }],
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      updateTask: (id, newContent, newImage, newTags) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, content: newContent, image: newImage, tags: newTags } : t
          ),
        })),
      reorderTasks: (newTasks) => set({ tasks: newTasks }),

      // Actions for Columns
      addColumn: (title) =>
        set((state) => ({
          columns: [
            ...state.columns,
            { 
              id: uuidv4(), 
              title, 
              color: getRandomColor() // Warna otomatis random
            }
          ]
        })),
      deleteColumn: (id) =>
        set((state) => ({
          // Hapus kolom DAN semua task di dalamnya (opsional, bisa hanya kolom)
          columns: state.columns.filter((c) => c.id !== id),
          tasks: state.tasks.filter((t) => t.columnId !== id) 
        })),
        updateColumnColor: (id, newColor) => 
        set((state) => ({
          columns: state.columns.map((c) => 
            c.id === id ? { ...c, color: newColor } : c
          )
        })),
      updateColumnTitle: (id, newTitle) => 
        set((state) => ({
          columns: state.columns.map((c) => c.id === id ? { ...c, title: newTitle } : c)
        }))
    }),
    {
      name: "task-flow-storage-v2", 
    }
  )
);