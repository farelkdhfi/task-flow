import React, { useState, useEffect } from "react";
import { 
  Pencil, 
  X, 
  Tag,
  Save,
  Upload,
  Trash2,
  Image as ImageIcon, 
  Layout
} from "lucide-react";
import { useTaskStore } from "../store";

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
    // RESPONSIVE UPDATE: items-end on mobile (bottom-sheet feel) -> items-center on desktop
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      <div 
        className="
            w-full sm:w-[95%] max-w-lg 
            bg-[#09090b] border-t sm:border border-white/10 
            rounded-t-2xl sm:rounded-2xl 
            shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)] 
            overflow-hidden flex flex-col 
            max-h-[90vh] sm:max-h-[85vh]
            animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        {/* RESPONSIVE UPDATE: Reduced padding on mobile (p-4 vs p-5) */}
        <div className="p-4 md:p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Pencil size={16} />
             </div>
             <div>
                <h3 className="text-white font-medium text-base tracking-tight">Edit Task</h3>
                <p className="text-xs text-neutral-500 font-light">Modify content and details</p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* --- Body --- */}
        {/* RESPONSIVE UPDATE: 
            1. Reduced padding (p-4 vs p-6).
            2. Reduced vertical spacing (space-y-5 vs space-y-8) to fit small screens.
        */}
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar space-y-5 md:space-y-8">
          
          {/* Content Input */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold flex items-center gap-2">
               <Layout size={12}/> Description
            </label>
            <div className="relative group">
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  // RESPONSIVE UPDATE: Adjusted min-height
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-xl p-4 text-sm text-neutral-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 min-h-[100px] md:min-h-[120px] resize-none transition-all placeholder:text-neutral-700 leading-relaxed"
                  placeholder="What needs to be done?"
                />
                {/* Decorative corner accent */}
                <div className="absolute bottom-3 right-3 pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-white/10 group-focus-within:bg-indigo-500 transition-colors duration-300"></div>
                </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
             <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold flex items-center gap-2">
               <Tag size={12}/> Labels
             </label>
             <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 border-dashed">
               {colors.map(color => (
                 <button
                   key={color}
                   onClick={() => toggleTag(color)}
                   className={`
                      w-6 h-6 rounded-full transition-all duration-300 
                      ${color} 
                      ${selectedTags.includes(color) 
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#09090b] scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'opacity-40 hover:opacity-100 hover:scale-105'}
                   `}
                 />
               ))}
             </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold flex items-center gap-2">
              <ImageIcon size={12}/> Attachments
            </label>
            
            {image ? (
              <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-lg">
                {/* RESPONSIVE UPDATE: Responsive height for image preview */}
                <img src={image} alt="Cover" className="w-full h-40 md:h-48 object-cover transition-transform duration-700 group-hover:scale-105" />
                
                {/* Image Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                   <button 
                      onClick={() => document.getElementById('edit-img-upload').click()} 
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-medium rounded-full hover:scale-105 transition-transform"
                   >
                      <Pencil size={12}/> Change
                   </button>
                   <button 
                      onClick={() => setImage(null)} 
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium rounded-full hover:bg-red-500 hover:text-white transition-all"
                   >
                      <Trash2 size={12}/> Remove
                   </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => document.getElementById('edit-img-upload').click()}
                className="group relative border border-dashed border-white/10 bg-white/[0.02] rounded-xl h-28 md:h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300"
              >
                <div className="p-3 rounded-full bg-white/5 mb-3 group-hover:scale-110 transition-transform duration-300 text-neutral-400 group-hover:text-white">
                    <Upload size={20}/>
                </div>
                <span className="text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">Click to upload cover image</span>
              </div>
            )}
            <input id="edit-img-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

        </div>

        {/* --- Footer --- */}
        {/* RESPONSIVE UPDATE: Adjusted padding */}
        <div className="p-4 md:p-5 border-t border-white/5 flex justify-end gap-3 bg-white/[0.01] shrink-0 mb-safe">
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-wide rounded-full hover:bg-neutral-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center gap-2"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;