import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

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

  // --- DRAGGING STATE (Placeholder) ---
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
            opacity-50 
            bg-[#09090b] 
            p-4 rounded-xl 
            border-2 border-dashed border-indigo-500/30 
            h-[120px] 
            animate-pulse
            flex items-center justify-center
        "
      >
        <span className="text-xs font-medium text-indigo-500/50 uppercase tracking-widest">Drop Here</span>
      </div>
    );
  }

  // --- IDLE STATE ---
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        group relative 
        bg-[#121212] hover:bg-[#161616] 
        rounded-xl 
        ring-1 ring-inset ring-white/5 hover:ring-indigo-500/30
        shadow-[0_2px_10px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)]
        transition-all duration-300 ease-out
        flex flex-col touch-none overflow-hidden
        hover:-translate-y-0.5
      "
    >
      {/* Cover Image */}
      {task.image && (
        <div className="h-32 md:h-36 w-full overflow-hidden relative border-b border-white/5">
           <img 
            src={task.image} 
            alt="Task cover" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
           />
           {/* Gradient Overlay for Text Readability */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80"/>
           
           {/* Image Badge (Optional visual flair) */}
           <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm p-1 rounded-md border border-white/10">
              <ImageIcon size={10} className="text-white/70"/>
           </div>
        </div>
      )}

      {/* Content Area */}
      {/* RESPONSIVE UPDATE: Padding adjusted (p-3 mobile, p-4 desktop) */}
      <div className="p-3 md:p-4 flex gap-3 relative">
         
         {/* Drag Handle */}
         {/* RESPONSIVE UPDATE: Text color visibility improved on mobile */}
         <div className="mt-1 text-neutral-500 lg:text-neutral-700 lg:group-hover:text-neutral-500 cursor-grab active:cursor-grabbing shrink-0 transition-colors">
            <GripVertical size={18} />
         </div>

         <div className="flex-1 min-w-0 space-y-2.5">
            {/* Tags Row */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-6 rounded-full ${tag} shadow-[0_0_10px_-2px_currentColor] opacity-80`} 
                  />
                ))}
              </div>
            )}

            {/* Task Content */}
            {/* RESPONSIVE UPDATE: Added pr-6 to prevent text overlapping with buttons on mobile */}
            <p className="text-sm text-neutral-300 font-light leading-relaxed whitespace-pre-wrap break-words group-hover:text-white transition-colors pr-6 lg:pr-0">
              {task.content}
            </p>
         </div>

         {/* Action Buttons */}
         {/* RESPONSIVE UPDATE: 
             1. Always visible on Mobile (opacity-100 translate-x-0).
             2. Hidden on Desktop until Hover (lg:opacity-0 lg:translate-x-2).
         */}
         <div className="absolute top-3 right-3 flex gap-1 
            opacity-100 translate-x-0 
            lg:opacity-0 lg:translate-x-2 
            lg:group-hover:opacity-100 lg:group-hover:translate-x-0 
            transition-all duration-200"
         >
            <button 
                onClick={(e) => {
                    e.stopPropagation(); // Prevent drag start
                    onEdit(task);
                }} 
                className="p-1.5 bg-[#1a1a1a] border border-white/5 text-neutral-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 rounded-lg transition-all shadow-lg" 
                title="Edit Task"
            >
                <Pencil size={12} />
            </button>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                }} 
                className="p-1.5 bg-[#1a1a1a] border border-white/5 text-neutral-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 rounded-lg transition-all shadow-lg" 
                title="Delete Task"
            >
                <Trash2 size={12} />
            </button>
         </div>
      </div>
    </div>
  );
};

export default TaskCard;