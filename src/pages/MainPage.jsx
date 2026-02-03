import React, { useState, useMemo, useEffect, useRef } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Pencil, 
  X, 
  Image as ImageIcon, 
  Tag,
  Save,
  Upload,
  Layout,
  Palette,
  MoreHorizontal
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* 1. ZUSTAND STORE                                                           */
/* -------------------------------------------------------------------------- */

const COLUMN_COLORS = [
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

const useTaskStore = create(
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
      name: "task-flow-storage-v2", // Ganti nama key storage biar fresh (karena struktur data berubah)
    }
  )
);

/* -------------------------------------------------------------------------- */
/* 2. COMPONENTS - EDIT MODAL                                                 */
/* -------------------------------------------------------------------------- */

const EditModal = ({ task, isOpen, onClose }) => {
  const { updateTask } = useTaskStore();
  const [content, setContent] = useState(task?.content || "");
  const [image, setImage] = useState(task?.image || null);
  const [selectedTags, setSelectedTags] = useState(task?.tags || []);

  useEffect(() => {
    if (task) {
      setContent(task.content);
      setImage(task.image);
      setSelectedTags(task.tags || []);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (colorClass) => {
    if (selectedTags.includes(colorClass)) {
      setSelectedTags(selectedTags.filter(t => t !== colorClass));
    } else {
      setSelectedTags([...selectedTags, colorClass]);
    }
  };

  const handleSave = () => {
    updateTask(task.id, content, image, selectedTags);
    onClose();
  };

  const colors = [
    "bg-red-500", "bg-orange-500", "bg-yellow-500", 
    "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-pink-500"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111] border border-neutral-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Pencil size={16} /> Edit Task
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-neutral-500 min-h-[100px] resize-none"
              placeholder="Task description..."
            />
          </div>
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-2">
               <Tag size={12}/> Labels
             </label>
             <div className="flex flex-wrap gap-2">
               {colors.map(color => (
                 <button
                   key={color}
                   onClick={() => toggleTag(color)}
                   className={`w-8 h-8 rounded-full ${color} transition-transform hover:scale-110 ${selectedTags.includes(color) ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111]' : 'opacity-50 hover:opacity-100'}`}
                 />
               ))}
             </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-2">
              <ImageIcon size={12}/> Cover Image
            </label>
            {image ? (
              <div className="relative group rounded-xl overflow-hidden border border-neutral-700">
                <img src={image} alt="Cover" className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button onClick={() => document.getElementById('edit-img-upload').click()} className="p-2 bg-white text-black rounded-full hover:bg-neutral-200"><Pencil size={14}/></button>
                   <button onClick={() => setImage(null)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"><Trash2 size={14}/></button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => document.getElementById('edit-img-upload').click()}
                className="border-2 border-dashed border-neutral-800 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-900 hover:border-neutral-700 transition-colors"
              >
                <Upload size={24} className="text-neutral-600 mb-2"/>
                <span className="text-xs text-neutral-500">Click to upload image</span>
              </div>
            )}
            <input id="edit-img-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
        </div>
        <div className="p-4 border-t border-neutral-800 flex justify-end gap-3 bg-[#0a0a0a]">
          <button onClick={onClose} className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2">
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. COMPONENT - TASK CARD                                                   */
/* -------------------------------------------------------------------------- */

const TaskCard = ({ task, deleteTask, onEdit }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-neutral-800 p-4 rounded-xl border border-neutral-700 h-[100px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#0A0A0A] group hover:bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-all shadow-sm flex flex-col touch-none overflow-hidden"
    >
      {task.image && (
        <div className="h-32 w-full overflow-hidden border-b border-neutral-800 relative">
             <img src={task.image} alt="Task cover" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
        </div>
      )}

      <div className="p-4 flex gap-3">
          <button
            {...attributes}
            {...listeners}
            className="mt-1 text-neutral-600 hover:text-neutral-400 cursor-grab active:cursor-grabbing shrink-0 h-fit"
          >
            <GripVertical size={16} />
          </button>

          <div className="flex-1 space-y-2">
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1">
                {task.tags.map((tag, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full ${tag}`} />
                ))}
              </div>
            )}

            <p className="text-sm text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">
              {task.content}
            </p>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(task)} className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-md transition-colors" title="Edit Task">
                <Pencil size={14} />
            </button>
            <button onClick={() => deleteTask(task.id)} className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-md transition-colors" title="Delete Task">
                <Trash2 size={14} />
            </button>
          </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. COMPONENT - COLUMN                                                      */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* 4. COMPONENT - COLUMN                                                      */
/* -------------------------------------------------------------------------- */

const Column = ({ id, title, icon: Icon, color, tasks, onEditTask }) => {
  // Ambil updateColumnColor dari store
  const { addTask, deleteTask, deleteColumn, updateColumnTitle, updateColumnColor } = useTaskStore();
  
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  
  // State baru untuk popup warna
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false); 
  const colorPickerRef = useRef(null);

  // Menutup popup warna jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setIsColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAdd = () => {
    if (!inputValue.trim()) {
      setIsAdding(false);
      return;
    }
    addTask(id, inputValue);
    setInputValue("");
    setIsAdding(false);
  };

  const handleTitleSubmit = () => {
    if(titleInput.trim()) {
      updateColumnTitle(id, titleInput);
    }
    setIsEditingTitle(false);
  }

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  
  const { setNodeRef } = useDroppable({ 
    id: id, 
    data: { type: "Column", columnId: id } 
  });

  return (
    <div ref={setNodeRef} className="flex flex-col w-full md:w-[300px] shrink-0 relative">
      
      {/* Header Kolom */}
      <div className="mb-4 flex items-center justify-between p-1 group/column-header relative">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {/* Icon Header */}
          <div className={`p-1.5 rounded-md bg-opacity-10 ${color} shrink-0`}>
            <Icon size={16} className={color.replace("bg-", "text-")} />
          </div>
          
          {/* Judul Kolom */}
          {isEditingTitle ? (
            <input 
              autoFocus
              className="bg-transparent text-sm font-medium text-white border-b border-blue-500 outline-none w-full min-w-0"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
            />
          ) : (
            <h3 
              onClick={() => setIsEditingTitle(true)}
              className="font-medium text-neutral-200 text-sm tracking-wide cursor-pointer hover:text-white truncate"
            >
              {title}
            </h3>
          )}

          <span className="text-xs font-mono text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800 shrink-0">
            {tasks.length}
          </span>
        </div>

        {/* Action Buttons (Color & Delete) */}
        <div className="flex items-center gap-1 opacity-0 group-hover/column-header:opacity-100 transition-all">
          
          {/* Tombol Buka Color Picker */}
          <button 
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            className={`p-1 text-neutral-600 hover:text-white transition-colors ${isColorPickerOpen ? 'text-white opacity-100' : ''}`}
            title="Change Color"
          >
            <Palette size={14}/>
          </button>

          {/* Tombol Delete */}
          <button 
            onClick={() => {
              if(window.confirm("Delete this list and all its tasks?")) {
                deleteColumn(id);
              }
            }}
            className="p-1 text-neutral-600 hover:text-red-500 transition-colors"
            title="Delete Column"
          >
            <Trash2 size={14}/>
          </button>
        </div>

        {/* --- POPUP COLOR PICKER --- */}
        {isColorPickerOpen && (
          <div 
            ref={colorPickerRef}
            className="absolute top-8 right-0 z-50 p-3 bg-[#111] border border-neutral-800 rounded-xl shadow-2xl flex flex-wrap gap-2 w-[180px] animate-in fade-in zoom-in-95 duration-200"
          >
            {COLUMN_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  updateColumnColor(id, c);
                  // setIsColorPickerOpen(false); // Uncomment jika ingin auto-close setelah pilih
                }}
                className={`w-6 h-6 rounded-full ${c.split(' ')[0]} hover:scale-110 transition-transform border border-transparent ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111]' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Area Task List (Tidak berubah) */}
      <div className={`flex-1 bg-[#050505] rounded-2xl border p-3 flex flex-col transition-colors duration-300 ${isColorPickerOpen ? 'border-neutral-700' : 'border-white/5'}`}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 flex-1 min-h-[50px]">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                deleteTask={deleteTask} 
                onEdit={onEditTask} 
              />
            ))}
          </div>
        </SortableContext>

        {isAdding ? (
          <div className="mt-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-700 animate-in fade-in zoom-in-95 duration-200">
            <textarea
              autoFocus
              placeholder="What needs to be done?"
              className="w-full bg-transparent text-sm text-white placeholder-neutral-600 outline-none resize-none h-16"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              onBlur={handleAdd}
            />
            <div className="flex justify-end mt-2">
               <span className="text-[10px] text-neutral-500">Press Enter to add</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-3 w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 hover:bg-white/[0.02] transition-all text-sm group"
          >
            <Plus size={16} className="group-hover:scale-110 transition-transform"/>
            Add Task
          </button>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. COMPONENTS - ADD COLUMN BUTTON                                          */
/* -------------------------------------------------------------------------- */

const AddColumnBtn = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const { addColumn } = useTaskStore();

  const handleAdd = () => {
    if(title.trim()) {
      addColumn(title);
    }
    setTitle("");
    setIsAdding(false);
  };

  if (isAdding) {
    return (
      <div className="w-[350px] shrink-0 p-4 bg-[#0A0A0A] rounded-2xl border border-neutral-800 animate-in fade-in slide-in-from-left-4 duration-300 h-fit">
        <h4 className="text-sm font-medium text-neutral-400 mb-2">New List Name</h4>
        <input 
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none mb-3"
          placeholder="e.g. Backlog, Review..."
        />
        <div className="flex gap-2">
          <button onClick={handleAdd} className="flex-1 bg-white text-black text-sm py-2 rounded-md font-medium hover:bg-neutral-200">Add List</button>
          <button onClick={() => setIsAdding(false)} className="px-3 text-neutral-400 hover:text-white"><X size={18}/></button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsAdding(true)}
      className="shrink-0 w-70 border border-dashed border-neutral-800 rounded-2xl flex items-center gap-x-2 p-3 text-neutral-600 hover:text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900/30 transition-all group"
    >
       <div className="p-2 rounded-full bg-neutral-900 group-hover:bg-neutral-800 transition-colors">
         <Plus size={20}/>
       </div>
       <span className="text-sm font-medium">Add New List</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. MAIN APP                                                                */
/* -------------------------------------------------------------------------- */

const MainPage = () => {
  const { tasks, columns, reorderTasks } = useTaskStore(); // Ambil columns dari store
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper untuk mendapatkan icon berdasarkan ID atau Default
  const getIcon = (id) => {
    switch (id) {
      case "todo": return Circle;
      case "doing": return Clock;
      case "done": return CheckCircle2;
      default: return Layout; // Icon default untuk kolom custom
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleEditClick = (task) => {
      setEditingTask(task);
      setIsModalOpen(true);
  }

  const handleDragStart = (event) => {
    if (event.active.data.current?.type === "Task") {
      setActiveDragItem(event.active.data.current.task);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    
    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        const newTasks = [...tasks];
        newTasks[activeIndex].columnId = tasks[overIndex].columnId;
        reorderTasks(arrayMove(newTasks, activeIndex, overIndex));
      }
    }

    const isOverColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      if (tasks[activeIndex].columnId !== overId) {
        const newTasks = [...tasks];
        newTasks[activeIndex].columnId = overId;
        reorderTasks(newTasks); 
      }
    }
  };

  const handleDragEnd = (event) => {
    setActiveDragItem(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);
    if (activeIndex !== -1 && overIndex !== -1) {
        reorderTasks(arrayMove(tasks, activeIndex, overIndex));
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-12 font-sans flex flex-col">
        <EditModal 
            task={editingTask} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
        />

        <div className="max-w-7xl mx-auto w-full mb-12">
            <h1 className="text-4xl md:text-5xl font-light mb-4">Task<span className="text-neutral-600">Flow.</span></h1>
            <p className="text-neutral-500 max-w-lg font-light leading-relaxed">
                A minimal kanban board. Create custom lists, drag tasks, and stay organized.
            </p>
        </div>

        <div className="max-w-7xl mx-auto w-full flex-1 overflow-x-auto pb-8">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col md:flex-row gap-8 min-w-full md:min-w-0 items-start">
                    {/* Render Columns dari Store */}
                    {columns.map((col) => (
                        <Column
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            icon={getIcon(col.id)} // Function untuk ambil icon
                            color={col.color}
                            tasks={tasks.filter((t) => t.columnId === col.id)}
                            onEditTask={handleEditClick}
                        />
                    ))}

                    {/* Tombol Tambah Kolom Baru */}
                    <AddColumnBtn />
                </div>

                <DragOverlay>
                    {activeDragItem ? (
                          <div className="bg-[#0A0A0A] p-4 rounded-xl border border-neutral-700 shadow-2xl cursor-grabbing opacity-90 rotate-2 scale-105 flex flex-col overflow-hidden w-[300px]">
                            {activeDragItem.image && (
                                <div className="h-32 w-full overflow-hidden border-b border-neutral-800 mb-2">
                                     <img src={activeDragItem.image} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <p className="text-sm text-neutral-200">{activeDragItem.content}</p>
                          </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    </div>
  );
};

export default MainPage;