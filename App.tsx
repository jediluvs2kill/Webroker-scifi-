import React, { useState } from 'react';
import { LandingTerminal } from './components/LandingTerminal';
import BuyerFlow from './components/BuyerFlow';
import Dashboard from './components/Dashboard';
import { UserRole } from './types';
import { ChevronLeft, BatteryMedium, Wifi } from 'lucide-react';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.NONE);

  const renderContent = () => {
    switch (currentRole) {
      case UserRole.NONE:
        return <LandingTerminal onSelectRole={setCurrentRole} />;
      case UserRole.BUYER:
        return <BuyerFlow />;
      case UserRole.BROKER:
      case UserRole.BUILDER:
        return <Dashboard role={currentRole} />;
      default:
        return <LandingTerminal onSelectRole={setCurrentRole} />;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020408] cyber-grid-bg font-mono-cyber">
      {/* CRT Effects */}
      <div className="scanlines"></div>
      <div className="noise"></div>
      <div className="vignette"></div>

      {/* Main HUD Frame */}
      <div className="absolute inset-2 border border-[rgba(0,240,255,0.3)] z-50 pointer-events-none">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 border-b border-[rgba(0,240,255,0.3)] flex items-center justify-between px-4 bg-[#020408]/80 backdrop-blur-sm pointer-events-auto">
             <div className="flex items-center space-x-4">
                 <h1 className="text-xl font-bold tracking-[0.2em] text-[#00f0ff] text-glow">
                     WEBROKER <span className="text-xs opacity-70">SYS.V.2.5</span>
                 </h1>
             </div>
             <div className="flex items-center space-x-6 text-[#00f0ff] opacity-80 text-xs tracking-widest">
                 <span className="animate-pulse">ONLINE</span>
                 <div className="flex items-center space-x-1">
                     <span>NET</span>
                     <Wifi size={14} />
                 </div>
                 <div className="flex items-center space-x-1">
                     <span>PWR</span>
                     <BatteryMedium size={14} />
                 </div>
             </div>
          </div>

          {/* Corner Markers */}
          <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]"></div>
          <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]"></div>
          <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]"></div>
          
          {/* Crosshairs */}
          <div className="absolute top-1/2 left-4 w-2 h-[1px] bg-[#00f0ff] opacity-50"></div>
          <div className="absolute top-1/2 right-4 w-2 h-[1px] bg-[#00f0ff] opacity-50"></div>
          <div className="absolute bottom-4 left-1/2 w-[1px] h-2 bg-[#00f0ff] opacity-50"></div>
      </div>

      {/* Back Button (Interactive) */}
      {currentRole !== UserRole.NONE && (
        <button 
          onClick={() => setCurrentRole(UserRole.NONE)}
          className="absolute top-16 left-6 z-[60] p-2 bg-black/50 text-[#00f0ff] border border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all uppercase text-xs tracking-widest flex items-center cursor-pointer"
        >
          <ChevronLeft size={14} className="mr-1" />
          Abort
        </button>
      )}
      
      {/* Content Container */}
      <div className="relative w-full h-full pt-14 pb-4 px-4 z-40">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;