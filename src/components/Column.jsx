import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Palette, Trash2, Plus, MoreHorizontal } from "lucide-react";
import { useTaskStore, COLUMN_COLORS } from "../store";
import TaskCard from "./TaskCard";

const Column = ({ id, title, icon: Icon, color, tasks, onEditTask }) => {
  const { addTask, deleteTask, deleteColumn, updateColumnTitle, updateColumnColor } = useTaskStore();
  
  const [inputValue, setInputValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(title);
  
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false); 
  const colorPickerRef = useRef(null);

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

  // Extract base color for text/border styling (naive approach for tailwind classes)
  const baseColorClass = color.replace("bg-", "text-");
  const borderFocusClass = color.replace("bg-", "focus-within:border-");

  return (
    <div ref={setNodeRef} className="flex flex-col w-full shrink-0 group/column">
      
      {/* --- Column Header --- */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {/* Icon Badge */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/5 shadow-sm`}>
            <Icon size={14} className={`${baseColorClass} opacity-90`} />
          </div>
          
          {/* Title & Count */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
              {isEditingTitle ? (
                <input 
                  autoFocus
                  className={`bg-transparent text-sm font-semibold tracking-tight text-white border-b-2 border-indigo-500 outline-none w-full py-0.5`}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                />
              ) : (
                <h3 
                  onClick={() => setIsEditingTitle(true)}
                  className="font-semibold text-neutral-200 text-sm tracking-tight cursor-pointer hover:text-white truncate transition-colors"
                >
                  {title}
                </h3>
              )}
              <span className="text-[10px] font-mono font-medium text-neutral-500 bg-white/[0.04] px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
              {/* RESPONSIVE UPDATE: 
                  opacity-100 on mobile/tablet (default), 
                  lg:opacity-0 (hidden on desktop until hover) 
              */}
              <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover/column:opacity-100 transition-opacity duration-200">
                <button 
                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                    className={`p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-white/10 transition-all ${isColorPickerOpen ? 'bg-white/10 text-white opacity-100' : ''}`}
                >
                    <Palette size={14}/>
                </button>
                <button 
                    onClick={() => deleteColumn(id)}
                    className="p-1.5 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                    <Trash2 size={14}/>
                </button>
            </div>

            {/* Floating Color Picker */}
            {isColorPickerOpen && (
                <div 
                    ref={colorPickerRef}
                    className="absolute top-full right-0 mt-2 z-50 p-3 bg-[#09090b] border border-white/10 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex flex-wrap gap-2 w-[160px] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
                >
                    <div className="w-full text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-1">Color Theme</div>
                    {COLUMN_COLORS.map((c) => (
                    <button
                        key={c}
                        onClick={() => updateColumnColor(id, c)}
                        className={`
                            w-6 h-6 rounded-full ${c.split(' ')[0]} 
                            hover:scale-110 transition-all duration-300
                            ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#09090b] scale-110' : 'opacity-70 hover:opacity-100'}
                        `}
                    />
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* --- Task List Area --- */}
      <div className={`
            flex-1 bg-[#09090b]/50 backdrop-blur-sm 
            rounded-2xl border border-white/5 
            flex flex-col relative overflow-hidden transition-all duration-500
            ${isColorPickerOpen ? 'ring-1 ring-white/10' : ''}
      `}>
         {/* Top Accent Line */}
         <div className={`absolute top-0 left-0 w-full h-[2px] ${color} opacity-50`}></div>

        {/* RESPONSIVE UPDATE: Adjusted padding and min-height for mobile */}
        <div className="p-2 md:p-3 flex-1 flex flex-col gap-3 min-h-[100px] md:min-h-[150px]">
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                 {tasks.map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        deleteTask={deleteTask} 
                        onEdit={onEditTask} 
                    />
                 ))}
            </SortableContext>
        </div>

        {/* --- Add Task Footer --- */}
        {/* RESPONSIVE UPDATE: Adjusted padding */}
        <div className="p-2 md:p-3 pt-0">
            {isAdding ? (
            <div className={`
                p-3 bg-[#0a0a0a] rounded-xl border border-white/10 
                shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200
                focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all
            `}>
                <textarea
                    autoFocus
                    placeholder="Describe the task..."
                    className="w-full bg-transparent text-sm text-neutral-200 placeholder-neutral-600 outline-none resize-none h-14 leading-relaxed custom-scrollbar"
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
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-600 font-medium">New Item</span>
                    <span className="text-[10px] text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">⏎ Enter</span>
                </div>
            </div>
            ) : (
            <button
                onClick={() => setIsAdding(true)}
                className="
                    w-full py-2.5 flex items-center justify-center gap-2 
                    rounded-xl border border-dashed border-white/10 bg-white/[0.01]
                    text-neutral-500 text-sm font-medium
                    hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 
                    transition-all duration-300 group
                "
            >
                <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300"/>
                <span>Add Task</span>
            </button>
            )}
        </div>

      </div>
    </div>
  );
};

export default Column;