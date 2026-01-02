import React from 'react';
import { UserRole } from '../types';
import { motion } from 'framer-motion';
import { Eye, Briefcase, Hammer, ChevronRight } from 'lucide-react';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleCard = ({ role, label, icon: Icon, onClick, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    onClick={() => onClick(role)}
    className="group relative w-64 h-80 cursor-pointer z-50 pointer-events-auto"
  >
    {/* Card Frame */}
    <div className="absolute inset-0 border border-[#00f0ff] bg-[#00f0ff]/5 backdrop-blur-sm transform transition-all duration-300 group-hover:scale-105 group-hover:bg-[#00f0ff]/10 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
       {/* Corner Accents */}
       <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f0ff]"></div>
       <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00f0ff]"></div>
       <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00f0ff]"></div>
       <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f0ff]"></div>
       
       {/* Content */}
       <div className="h-full flex flex-col items-center justify-center p-6 text-[#00f0ff]">
          <div className="mb-6 p-4 border border-[#00f0ff] rounded-full bg-black/50 relative group-hover:animate-pulse shadow-[0_0_10px_#00f0ff]">
             <Icon size={40} strokeWidth={1} />
          </div>
          <h3 className="text-2xl font-bold tracking-[0.2em] mb-2">{label}</h3>
          <div className="text-[10px] opacity-70 tracking-widest mb-8">ACCESS_TERMINAL</div>
          
          <div className="flex items-center gap-2 text-xs font-bold border border-[#00f0ff] px-4 py-1 group-hover:bg-[#00f0ff] group-hover:text-black transition-colors">
             <span>CONNECT</span>
             <ChevronRight size={12} />
          </div>
       </div>
    </div>
  </motion.div>
);

export const LandingTerminal: React.FC<LandingProps> = ({ onSelectRole }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative z-30">
       {/* Background Grid Accent */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.1)_0%,transparent_70%)] pointer-events-none"></div>

       {/* Title Block */}
       <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 1 }}
         className="text-center mb-16 relative z-30"
       >
          <h1 className="text-6xl md:text-8xl font-bold text-[#00f0ff] tracking-[0.1em] text-glow font-mono-cyber drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            WEBROKER
          </h1>
          <p className="text-[#00f0ff] mt-4 text-sm md:text-base font-mono tracking-[0.5em] uppercase opacity-70">
            DECENTRALIZED ESTATE PROTOCOL
          </p>
       </motion.div>

       {/* Cards Container */}
       <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative z-40">
          <RoleCard 
            role={UserRole.BUYER} 
            label="BUYER" 
            icon={Eye} 
            onClick={onSelectRole} 
            delay={0.2}
          />
          <RoleCard 
            role={UserRole.BROKER} 
            label="BROKER" 
            icon={Briefcase} 
            onClick={onSelectRole} 
            delay={0.4}
          />
          <RoleCard 
            role={UserRole.BUILDER} 
            label="BUILDER" 
            icon={Hammer} 
            onClick={onSelectRole} 
            delay={0.6}
          />
       </div>
    </div>
  );
};
