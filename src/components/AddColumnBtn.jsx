import React, { useState } from "react";
import { Plus, X, Layout, ArrowRight } from "lucide-react";
import { useTaskStore } from "../store";

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
      <div className="
        w-full md:w-[350px] shrink-0 
        p-4 bg-[#09090b] 
        rounded-2xl border border-white/10 
        shadow-2xl shadow-indigo-500/5
        animate-in fade-in zoom-in-95 duration-200 
        flex flex-col gap-3
      ">
        <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-indigo-400">
                <Layout size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">New Section</span>
             </div>
             <button 
                onClick={() => setIsAdding(false)} 
                className="text-neutral-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md"
             >
                <X size={14}/>
             </button>
        </div>

        <input 
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="
            w-full bg-white/[0.03] border border-white/5 
            rounded-xl p-3 text-sm text-white 
            focus:border-indigo-500/50 focus:bg-white/[0.05] focus:outline-none 
            placeholder-neutral-600 transition-all
          "
          placeholder="e.g. Backlog, Review..."
        />
        
        <div className="flex justify-end pt-1">
          <button 
            onClick={handleAdd} 
            className="
                flex items-center gap-2 px-4 py-2 
                bg-white text-black text-xs font-semibold tracking-wide 
                rounded-lg hover:bg-neutral-200 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] 
                transition-all duration-300
            "
          >
            Create List <ArrowRight size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setIsAdding(true)}
      // RESPONSIVE UPDATE: Changed md:w-[300px] to md:w-[350px] to match Column width
      className="
        shrink-0 w-full md:w-[350px] h-[56px]
        border border-dashed border-white/10 rounded-2xl 
        flex items-center justify-center gap-x-2 
        text-neutral-500 bg-white/[0.01]
        hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 
        transition-all duration-300 group
      "
    >
       <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
         <Plus size={16} className="group-hover:text-indigo-400"/>
       </div>
       <span className="text-sm font-medium tracking-tight">Add Another List</span>
    </button>
  );
}

export default AddColumnBtn;