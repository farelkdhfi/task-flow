import React, { useState, useMemo, useRef } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { motion, useInView } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
  ArrowDown,
  Layers,
  Zap,
  Database,
  Github
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/* 1. ZUSTAND STORE (LOGIC DATA)                                              */
/* -------------------------------------------------------------------------- */

const useTaskStore = create(
  persist(
    (set) => ({
      tasks: [
        { id: "1", columnId: "todo", content: "Research Design Systems" },
        { id: "2", columnId: "doing", content: "Implement Drag & Drop" },
        { id: "3", columnId: "done", content: "Initialize Repo" },
      ],
      addTask: (columnId, content) =>
        set((state) => ({
          tasks: [...state.tasks, { id: uuidv4(), columnId, content }],
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      updateTaskColumn: (taskId, newColumnId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, columnId: newColumnId } : t
          ),
        })),
      reorderTasks: (newTasks) => set({ tasks: newTasks }),
    }),
    {
      name: "task-flow-storage",
    }
  )
);

/* -------------------------------------------------------------------------- */
/* 2. KANBAN COMPONENTS                                                       */
/* -------------------------------------------------------------------------- */

const TaskCard = ({ task, deleteTask }) => {
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
      className="bg-[#0f0f0f] group hover:bg-neutral-800/80 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all shadow-sm flex items-start justify-between gap-2 touch-none cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <div className="flex gap-3 overflow-hidden w-full">
        <p className="text-sm text-neutral-300 font-light leading-relaxed whitespace-pre-wrap w-full">
          {task.content}
        </p>
      </div>
      <button
        onPointerDown={(e) => {
            e.stopPropagation(); // Mencegah drag saat klik delete
            deleteTask(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-opacity"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

const Column = ({ id, title, icon: Icon, color, tasks }) => {
  const { addTask, deleteTask } = useTaskStore();
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!inputValue.trim()) {
      setIsAdding(false);
      return;
    }
    addTask(id, inputValue);
    setInputValue("");
    setIsAdding(false);
  };

  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);
  const { setNodeRef } = useSortable({ id: id, data: { type: "Column", columnId: id } });

  return (
    <div ref={setNodeRef} className="flex flex-col w-full md:w-[320px] shrink-0">
      <div className="mb-4 flex items-center justify-between p-1">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md bg-opacity-10 ${color}`}>
            <Icon size={14} className={color.replace("bg-", "text-")} />
          </div>
          <h3 className="font-medium text-neutral-200 text-sm tracking-wide">{title}</h3>
          <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-800">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-[#0A0A0A] rounded-2xl border border-white/5 p-3 min-h-[400px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
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
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd(); }
              }}
              onBlur={handleAdd}
            />
            <div className="flex justify-end mt-2"><span className="text-[10px] text-neutral-500">Press Enter</span></div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="mt-3 w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600 hover:bg-white/[0.02] transition-all text-xs uppercase tracking-wider group"
          >
            <Plus size={14} className="group-hover:scale-110 transition-transform" />
            Add Task
          </button>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. LANDING PAGE & APP INTEGRATION                                          */
/* -------------------------------------------------------------------------- */

const LandingPage = () => {
  const { tasks, updateTaskColumn, reorderTasks } = useTaskStore();
  const [activeDragItem, setActiveDragItem] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
        reorderTasks(arrayMove(newTasks, activeIndex, activeIndex));
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

  const columns = [
    { id: "todo", title: "To Do", icon: Circle, color: "bg-neutral-500 text-neutral-500" },
    { id: "doing", title: "In Progress", icon: Clock, color: "bg-orange-500 text-orange-500" },
    { id: "done", title: "Done", icon: CheckCircle2, color: "bg-emerald-500 text-emerald-500" },
  ];

  const appRef = useRef(null);
  const isInView = useInView(appRef, { once: true, margin: "-100px" });

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-white/20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex flex-col justify-center items-center px-6 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900/20 via-[#050505] to-[#050505]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
             <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-6 backdrop-blur-md">
                Interactive Showcase
            </span>
            <h1 className="text-6xl md:text-8xl font-light tracking-tighter mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
              TaskFlow.
            </h1>
            <p className="text-lg md:text-xl text-neutral-500 font-light leading-relaxed max-w-2xl mx-auto mb-10">
              A study in state persistence and fluid interactions. <br className="hidden md:block"/>
              Experience the power of modern frontend architecture.
            </p>

            <div className="flex justify-center gap-4">
               <button onClick={() => navigate("/main")} className="px-8 py-3 bg-white text-black text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors">
                 Launch Demo
               </button>
               <a href="#" className="px-8 py-3 border border-white/10 bg-white/5 text-white text-sm font-medium tracking-wide hover:bg-white/10 transition-colors flex items-center gap-2">
                 <Github size={16}/> View Code
               </a>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack Badges */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5, duration: 1 }}
           className="absolute bottom-12 flex gap-8 md:gap-16 text-neutral-600 grayscale opacity-50"
        >
             {['React.js', 'Zustand', 'DnD-Kit', 'Tailwind'].map((tech) => (
                 <span key={tech} className="text-xs font-mono uppercase tracking-widest">{tech}</span>
             ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 right-8 text-neutral-500 hidden md:block"
        >
            <ArrowDown size={20} strokeWidth={1} />
        </motion.div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 border-b border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                  { icon: Layers, title: "Optimistic UI", desc: "Instant visual feedback. State updates happen immediately, creating a seamless 'drag-and-feel' experience." },
                  { icon: Database, title: "Local Persistence", desc: "Built with Zustand Middleware to automatically sync state with localStorage. Refresh without losing data." },
                  { icon: Zap, title: "Fluid Architecture", desc: "Powered by @dnd-kit core for accessible, lightweight, and performant drag interactions." }
              ].map((feature, i) => (
                  <div key={i} className="group">
                      <div className="mb-6 p-4 w-fit bg-white/[0.03] rounded-full border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                          <feature.icon size={24} className="text-neutral-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-light text-white mb-3">{feature.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* --- LIVE APP DEMO SECTION --- */}
      <section ref={appRef} className="py-32 px-4 md:px-8 min-h-screen flex flex-col items-center bg-[#050505] relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto w-full mb-12 flex justify-between items-end">
            <div>
                <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-2">Live Application</h2>
                <p className="text-neutral-500">Go ahead. Create tasks, drag them around.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                SYSTEM ONLINE
            </div>
        </div>

        {/* THE KANBAN BOARD WRAPPER */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[1400px] overflow-x-auto bg-[#080808] border border-white/5 rounded-3xl p-6 md:p-12 shadow-2xl shadow-black/50 relative"
        >
             {/* Gradient Glow */}
             <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
             <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-col md:flex-row gap-8 min-w-full md:min-w-0 relative z-10">
                    {columns.map((col) => (
                        <Column
                            key={col.id}
                            id={col.id}
                            title={col.title}
                            icon={col.icon}
                            color={col.color}
                            tasks={tasks.filter((t) => t.columnId === col.id)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeDragItem ? (
                         <div className="bg-[#151515] p-4 rounded-xl border border-neutral-600 shadow-2xl cursor-grabbing opacity-90 rotate-2 scale-105 w-[300px]">
                            <p className="text-sm text-neutral-200">{activeDragItem.content}</p>
                         </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 text-center text-neutral-600 text-xs uppercase tracking-widest font-mono">
          <p>© 2024 Setia Farel MK. Task-Flow Project.</p>
      </footer>
    </div>
  );
};

export default LandingPage;