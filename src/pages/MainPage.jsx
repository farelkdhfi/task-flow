import React, { useState } from "react";
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
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Layout,
  MoreHorizontal,
  Kanban,
  Sparkles
} from "lucide-react";

import { motion } from "framer-motion";

import { useTaskStore } from "../store";
import EditModal from "../components/EditModal";
import Column from "../components/Column";
import AddColumnBtn from "../components/AddColumnBtn";

/* -------------------------------------------------------------------------- */
/* 1. VISUAL ASSETS */
/* -------------------------------------------------------------------------- */

const GeometricMesh = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
    <svg
      className="absolute top-0 left-0 w-full h-full opacity-[0.15]"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <path d="M0 100 L100 0 L100 100 Z" fill="url(#grid-gradient)" />
      <path d="M0 0 L100 0 L0 100 Z" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.1" />
    </svg>
    {/* Radial Glows - Adjusted for responsive overflow handling */}
    <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/5 rounded-full blur-[60px] md:blur-[100px]" />
  </div>
);

/* -------------------------------------------------------------------------- */
/* 2. MAIN PAGE COMPONENT                                                     */
/* -------------------------------------------------------------------------- */

const MainPage = () => {
  const { tasks, columns, reorderTasks } = useTaskStore();
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper untuk mendapatkan icon
  const getIcon = (id) => {
    switch (id) {
      case "todo": return Circle;
      case "doing": return Clock;
      case "done": return CheckCircle2;
      default: return Layout;
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

  /* --- LOGIC: Drag Handlers (UNTOUCHED) --- */
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
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden selection:bg-indigo-500/30 relative">
        
        {/* --- Background Elements --- */}
        <GeometricMesh />
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none fixed"></div>

        <EditModal 
            task={editingTask} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
        />

        {/* --- Header Section --- */}
        <div className="relative z-10 pt-10 md:pt-16 pb-8 md:pb-12 px-4 sm:px-6 md:px-12 max-w-[1600px] mx-auto w-full border-b border-white/5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-4 md:mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
                        Workspace Active
                    </span>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        {/* Responsive Font Size for Title */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-white leading-[1.1]">
                            Task<span className="text-neutral-600">Flow.</span>
                        </h1>
                        <p className="text-neutral-400 mt-4 max-w-lg font-light leading-relaxed text-sm md:text-base border-l border-white/10 pl-4">
                            Orchestrate your workflow with precision. <br className="hidden sm:block"/> Drag, drop, and maintain your state of flow.
                        </p>
                    </div>
                    
                    {/* Stats / Indicators (Visual Flair) */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs font-mono text-neutral-500">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] rounded border border-white/5">
                            <Kanban size={14} />
                            <span>{columns.length} LISTS</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] rounded border border-white/5">
                            <Sparkles size={14} />
                            <span>{tasks.length} ITEMS</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* --- Board Area --- */}
        {/* Adjusted padding and overflow handling for mobile vs desktop */}
        <div className="relative z-10 max-w-[1600px] mx-auto w-full flex-1 overflow-x-hidden md:overflow-x-auto pb-12 pt-8 md:pt-12 px-4 sm:px-6 md:px-12">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {/* Responsive Layout Logic:
                   - flex-col: Stack columns vertically on mobile.
                   - md:flex-row: Align horizontally on desktop.
                   - items-center (mobile): Center the cards if they aren't full width.
                   - md:items-start (desktop): Align top for horizontal scroll.
                */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-w-full md:min-w-max items-stretch md:items-start">
                    {/* Render Columns */}
                    {columns.map((col) => (
                        <div 
                            key={col.id} 
                            // Responsive width: Full on mobile, but capped at 'md' size for aesthetics on tablets, fixed 350px on desktop
                            className="w-full md:w-[350px] shrink-0"
                        >
                             <Column
                                id={col.id}
                                title={col.title}
                                icon={getIcon(col.id)}
                                color={col.color}
                                tasks={tasks.filter((t) => t.columnId === col.id)}
                                onEditTask={handleEditClick}
                            />
                        </div>
                    ))}

                    {/* Add Column Button Wrapper */}
                    <div className="w-full md:w-[350px] shrink-0 pt-2 opacity-60 hover:opacity-100 transition-opacity duration-300">
                         <AddColumnBtn />
                    </div>
                </div>

                {/* --- Custom Drag Overlay (Glassmorphism Style) --- */}
                <DragOverlay>
                    {activeDragItem ? (
                          <div className="
                            bg-[#080808]/90 backdrop-blur-xl 
                            p-5 rounded-2xl 
                            border border-white/10 
                            shadow-[0_20px_50px_rgba(8,112,184,0.2)] 
                            cursor-grabbing 
                            rotate-2 scale-105 
                            flex flex-col overflow-hidden
                            group ring-1 ring-indigo-500/30
                            /* Responsive Drag Item Width */
                            w-[85vw] sm:w-[320px]
                          ">
                             {/* Header overlay item */}
                             <div className="flex items-center justify-between mb-3 opacity-50">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">Moving Task</span>
                                <MoreHorizontal size={14} className="text-white"/>
                             </div>

                            {activeDragItem.image && (
                                <div className="h-36 w-full overflow-hidden rounded-lg border border-white/5 mb-3 relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"/>
                                     <img src={activeDragItem.image} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <p className="text-base text-white font-medium leading-snug">{activeDragItem.content}</p>
                            
                            {/* Footer visual */}
                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"/>
                                <span className="text-xs text-neutral-500 font-light">Assignee</span>
                            </div>
                          </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    </div>
  );
};

export default MainPage;