import React from 'react';
import { UserRole } from '../types';
import { BrokerView } from './BrokerView';
import { BuilderView } from './BuilderView';
import { CyberModule } from './CyberWidgets'; // Re-export check
import { CyberCircuit } from './CyberWidgets'; // Re-export check

interface DashboardProps {
  role: UserRole;
}

const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  // If we are a Broker, render the specific Broker View
  if (role === UserRole.BROKER) {
      return (
          <div className="h-full w-full p-2 flex flex-col gap-4">
             {/* Shared Header for context */}
             <div className="h-16 border border-[#00f0ff] bg-[#020408] p-2 flex justify-between items-center border-glow">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#00f0ff]/20 flex items-center justify-center border border-[#00f0ff] text-[#00f0ff] font-bold">BR</div>
                     <div>
                         <div className="text-[#00f0ff] font-bold tracking-widest text-sm">BROKER TERMINAL</div>
                         <div className="text-[#00f0ff] text-[10px] opacity-60">ID: 884-XJ-99 // CONNECTED</div>
                     </div>
                 </div>
                 <div className="text-[#00f0ff] text-xs font-mono">
                     NETWORK_LATENCY: 12ms
                 </div>
             </div>
             
             {/* Specific View */}
             <div className="flex-1 overflow-hidden">
                 <BrokerView />
             </div>
          </div>
      );
  }

  // If we are a Builder, render the specific Builder View
  if (role === UserRole.BUILDER) {
      return (
         <div className="h-full w-full p-2 flex flex-col gap-4">
             <div className="h-16 border border-[#00f0ff] bg-[#020408] p-2 flex justify-between items-center border-glow">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#f97316]/20 flex items-center justify-center border border-[#f97316] text-[#f97316] font-bold">BU</div>
                     <div>
                         <div className="text-[#00f0ff] font-bold tracking-widest text-sm">BUILDER TERMINAL</div>
                         <div className="text-[#00f0ff] text-[10px] opacity-60">ID: APEX-CONST-01 // CONNECTED</div>
                     </div>
                 </div>
                 <div className="text-[#00f0ff] text-xs font-mono">
                     SYS_LOAD: 34%
                 </div>
             </div>
             
             <div className="flex-1 overflow-hidden">
                 <BuilderView />
             </div>
          </div>
      );
  }

  return null;
};

export default Dashboard;