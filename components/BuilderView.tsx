import React, { useState } from 'react';
import { CyberModule } from './CyberWidgets';
import { Project } from '../types';
import { geminiService } from '../services/geminiService';
import { Map, Box, Layers, Cpu } from 'lucide-react';

const MOCK_PROJECTS: Project[] = [
    { id: '1', location: 'Sector 4, North District', size: '12,000 sqft', zoning: 'Mixed Use', status: 'Available' },
    { id: '2', location: 'Industrial Zone B', size: '45,000 sqft', zoning: 'Commercial', status: 'Pending' },
    { id: '3', location: 'Old Port Waterfront', size: '8,500 sqft', zoning: 'Residential (High Density)', status: 'Available' },
];

export const BuilderView: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [concept, setConcept] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleProjectSelect = async (project: Project) => {
        setSelectedProject(project);
        setConcept('');
        setLoading(true);
        const result = await geminiService.evaluateProject(project);
        setConcept(result);
        setLoading(false);
    };

    return (
        <div className="h-full w-full grid grid-cols-12 gap-4">
            
            {/* Project List */}
            <CyberModule title="LAND OPPORTUNITIES" className="col-span-4 h-full">
                 <div className="space-y-3">
                    {MOCK_PROJECTS.map(proj => (
                        <div 
                            key={proj.id}
                            onClick={() => handleProjectSelect(proj)}
                            className={`p-3 border relative overflow-hidden cursor-pointer transition-all ${selectedProject?.id === proj.id ? 'border-[#00f0ff] bg-[#00f0ff]/10' : 'border-[#00f0ff]/30 hover:border-[#00f0ff]'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-[#00f0ff] font-bold text-xs tracking-widest flex items-center gap-2">
                                    <Map size={12} /> {proj.location.toUpperCase()}
                                </div>
                                <div className={`w-2 h-2 rounded-full ${proj.status === 'Available' ? 'bg-green-500 shadow-[0_0_5px_#00ff00]' : 'bg-yellow-500'}`}></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#00f0ff] opacity-80 font-mono">
                                <div>SIZE: {proj.size}</div>
                                <div>ZONE: {proj.zoning}</div>
                            </div>
                            {selectedProject?.id === proj.id && (
                                <div className="absolute inset-0 border-2 border-[#00f0ff] pointer-events-none"></div>
                            )}
                        </div>
                    ))}
                </div>
            </CyberModule>

            {/* AI Architect Panel */}
            <div className="col-span-8 flex flex-col gap-4">
                 {/* Visual Map Placeholder */}
                 <div className="h-1/3 border border-[#00f0ff] bg-[#020408] relative overflow-hidden border-glow">
                      <div className="absolute top-2 left-2 text-[#00f0ff] text-[10px] tracking-widest bg-black px-1 border border-[#00f0ff] z-10">SATELLITE.VIEW</div>
                      {/* Grid Map Simulation */}
                      <div className="w-full h-full bg-[linear-gradient(#00f0ff22_1px,transparent_1px),linear-gradient(90deg,#00f0ff22_1px,transparent_1px)] bg-[size:40px_40px] perspective-grid transform rotate-x-12 scale-150"></div>
                      
                      {selectedProject && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-[#00f0ff] animate-pulse flex items-center justify-center">
                              <div className="text-[#00f0ff] text-[10px] bg-black px-1">TARGET</div>
                          </div>
                      )}
                 </div>

                 {/* Analysis Output */}
                 <CyberModule title="AI ARCHITECT // CONCEPT GENERATION" className="flex-1">
                     {selectedProject ? (
                         <div className="h-full flex flex-col gap-4">
                             <div className="flex justify-between items-end border-b border-[#00f0ff]/30 pb-2">
                                 <div>
                                     <div className="text-sm text-[#00f0ff] font-bold">{selectedProject.location}</div>
                                     <div className="text-xs text-[#00f0ff] opacity-60">ZONING COMPLIANCE CHECK: PASSED</div>
                                 </div>
                                 <Cpu className="text-[#00f0ff] animate-pulse" />
                             </div>
                             
                             <div className="flex-1 bg-[#00f0ff]/5 border border-[#00f0ff]/30 p-4 font-mono text-sm text-[#00f0ff]">
                                 {loading ? (
                                     <div className="flex flex-col gap-1">
                                         <span className="animate-pulse">>> ACCESSING MUNICIPAL RECORDS...</span>
                                         <span className="animate-pulse delay-75">>> ANALYZING DEMOGRAPHIC SHIFTS...</span>
                                         <span className="animate-pulse delay-150">>> RENDERING CONCEPTUAL MODEL...</span>
                                     </div>
                                 ) : (
                                     <>
                                         <div className="text-xs opacity-50 mb-2">GENERATED CONCEPT:</div>
                                         <div className="leading-relaxed">{concept}</div>
                                     </>
                                 )}
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                                 <div className="border border-[#00f0ff]/50 p-2 flex items-center gap-3">
                                     <Box size={20} className="text-[#00f0ff]" />
                                     <div className="text-[10px] text-[#00f0ff]">
                                         <div className="opacity-50">EST. ROI</div>
                                         <div className="font-bold text-lg">18.5%</div>
                                     </div>
                                 </div>
                                 <div className="border border-[#00f0ff]/50 p-2 flex items-center gap-3">
                                     <Layers size={20} className="text-[#00f0ff]" />
                                     <div className="text-[10px] text-[#00f0ff]">
                                         <div className="opacity-50">BUILD COST</div>
                                         <div className="font-bold text-lg">$4.2M</div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ) : (
                         <div className="h-full flex items-center justify-center text-[#00f0ff] opacity-50 font-mono text-sm">
                             >> SELECT A PLOT TO GENERATE DEVELOPMENT CONCEPT
                         </div>
                     )}
                 </CyberModule>
            </div>
        </div>
    );
};