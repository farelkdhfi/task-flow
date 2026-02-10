import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Layers,
  Zap,
  Database,
  Github,
  Play,
  ArrowRight,
  CheckCircle2,
  Cpu,
  MousePointer2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import VideoDemo from "../assets/videos/videoDemo.mp4";

/* -------------------------------------------------------------------------- */
/* 1. VISUAL ASSETS (GEOMETRIC MESH)                                          */
/* -------------------------------------------------------------------------- */

const GeometricMesh = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
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
      <path
        d="M0 100 L100 0 L100 100 Z"
        fill="url(#grid-gradient)"
      />
      <path
        d="M0 0 L100 0 L0 100 Z"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.1"
      />
      {/* Abstract Lines */}
      <path
        d="M0 50 Q 50 0 100 50 T 200 50"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.2"
        className="animate-pulse"
      />
       <path
        d="M0 70 Q 50 20 100 70 T 200 70"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="0.1"
      />
    </svg>
    
    {/* Radial Glows - Adjusted size for responsiveness */}
    <div className="absolute top-[-20%] right-[-10%] w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[500px] md:h-[600px] bg-indigo-500/10 rounded-full blur-[80px] md:blur-[120px]" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[300px] sm:w-[500px] md:w-[600px] h-[300px] sm:h-[500px] md:h-[600px] bg-blue-600/5 rounded-full blur-[60px] md:blur-[100px]" />
  </div>
);

/* -------------------------------------------------------------------------- */
/* 2. UI COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

const FeaturePoint = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="flex gap-4 items-start group"
  >
    <div className="mt-1 p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-400 group-hover:text-white group-hover:bg-white/10 transition-all duration-300 shrink-0">
      <Icon size={18} />
    </div>
    <div>
      <h4 className="text-white text-base font-medium mb-1 tracking-wide">{title}</h4>
      <p className="text-neutral-500 text-sm font-light leading-relaxed max-w-sm">
        {description}
      </p>
    </div>
  </motion.div>
);

/* -------------------------------------------------------------------------- */
/* 3. LANDING PAGE                                                            */
/* -------------------------------------------------------------------------- */

const LandingPage = () => {
  const appRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 border-b border-white/5">
        <GeometricMesh />
        
        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10 pt-16 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-6 sm:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
                Next Gen Productivity
              </span>
            </div>

            {/* Responsive Typography: Adjusted text sizes for mobile */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight mb-6 sm:mb-8 text-white leading-[1.1] sm:leading-[1.1]">
              Effortless <span className="text-neutral-500">Flow.</span> <br />
              Master your tasks.
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed max-w-xl md:max-w-2xl mx-auto mb-10 sm:mb-12 antialiased px-2">
              A study in state persistence and fluid interactions. 
              Experience the power of modern frontend architecture designed for clarity and speed.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-5 items-center w-full sm:w-auto px-4 sm:px-0">
               <button 
                 onClick={() => navigate("/main")} 
                 className="group relative w-full sm:w-auto px-8 py-3.5 bg-white text-black text-sm font-semibold tracking-wide rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
               >
                 <span className="relative z-10 flex items-center justify-center gap-2">
                   Launch Demo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                 </span>
               </button>
               
               <a href="#" className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/10 bg-white/[0.02] text-neutral-300 text-sm font-medium tracking-wide hover:bg-white/[0.05] hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                 <Github size={16}/> View Source Code
               </a>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack Subtle Indicators */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8, duration: 1 }}
           className="absolute bottom-8 sm:bottom-12 w-full flex flex-wrap justify-center items-center gap-x-6 gap-y-3 sm:gap-8 md:gap-16 pointer-events-none px-4"
        >
           {['React 18', 'Zustand', 'DnD-Kit', 'Tailwind'].map((tech) => (
               <span key={tech} className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-neutral-700 font-medium">
                 {tech}
               </span>
           ))}
        </motion.div>
      </section>

      {/* --- SHOWCASE SECTION (REPLACED LIVE DEMO) --- */}
      <section ref={appRef} className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 relative bg-[#030303] overflow-hidden">
        {/* Decorative Divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 sm:h-24 bg-gradient-to-b from-white/10 to-transparent"></div>

        <div className="max-w-7xl mx-auto">
          {/* Grid stack on mobile, side-by-side on lg */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Video/Visual Demo Wrapper */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group order-2 lg:order-1"
            >
              {/* Glow Effect behind video */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
              
              <div className="relative rounded-2xl border border-white/10 bg-[#080808] overflow-hidden shadow-2xl">
                {/* Mock Browser Header */}
                <div className="h-8 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                </div>

                {/* VIDEO PLACEHOLDER */}
                <div className="aspect-video bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                   <video
                     src={VideoDemo}
                     autoPlay
                     loop
                     muted
                     playsInline // Added playsInline for better mobile video handling
                     className="w-full h-full object-cover"
                   >
                   </video>
                </div>
              </div>
            </motion.div>

            {/* Right: Feature Description */}
            <div className="flex flex-col gap-8 sm:gap-10 pl-0 lg:pl-12 order-1 lg:order-2">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-4 tracking-tight">
                  Seamless Drag & Drop <br className="hidden sm:block" />
                  <span className="text-neutral-500">Interaction.</span>
                </h2>
                <p className="text-neutral-400 font-light leading-relaxed text-sm sm:text-base">
                  Designed to feel natural. Every movement is calculated for precision, 
                  providing immediate tactile feedback for a superior user experience.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <FeaturePoint 
                  icon={MousePointer2}
                  delay={0.2}
                  title="Optimistic UI Updates"
                  description="Instant visual feedback. State updates happen immediately before server confirmation, creating a zero-latency feel."
                />
                
                <FeaturePoint 
                  icon={Database}
                  delay={0.4}
                  title="Persistent Local State"
                  description="Built with Zustand Middleware to automatically sync state with local storage. Your workflow is saved, even if you close the tab."
                />

                <FeaturePoint 
                  icon={Cpu}
                  delay={0.6}
                  title="Fluid Architecture"
                  description="Powered by lightweight logic core. Optimized to maintain 60fps animations even with complex sorting operations."
                />
              </div>
              
              <div className="pt-2 sm:pt-4 text-center lg:text-left">
                 <button onClick={() => navigate("/main")} className="text-sm font-semibold text-white border-b border-white/30 pb-1 hover:border-white transition-colors">
                   Try the Live Demo
                 </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (REFINED) --- */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 border-t border-white/5 bg-[#030303]">
          <div className="max-w-7xl mx-auto">
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                  {[
                      { icon: Layers, title: "Modular Design", desc: "Component-based architecture allowing for easy scalability." },
                      { icon: CheckCircle2, title: "Type Safe", desc: "Reliable data handling ensuring fewer runtime errors." },
                      { icon: Zap, title: "Performance First", desc: "Minimal re-renders ensuring the application remains snappy." }
                  ].map((feature, i) => (
                      <div key={i} className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                          <feature.icon size={24} className="text-neutral-400 mb-4 sm:mb-6" strokeWidth={1} />
                          <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                          <p className="text-neutral-500 text-sm font-light leading-relaxed">{feature.desc}</p>
                      </div>
                  ))}
             </div>
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 sm:py-12 border-t border-white/5 text-center px-4">
          <p className="text-neutral-600 text-[10px] uppercase tracking-[0.2em] font-medium mb-4">
            Designed & Engineered by Setia Farel MK
          </p>
          <p className="text-neutral-700 text-xs font-light">
            © 2024 Task-Flow Project. All rights reserved.
          </p>
      </footer>
    </div>
  );
};

export default LandingPage;