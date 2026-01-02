import React, { useState, useEffect } from 'react';
import { CyberModule } from './CyberWidgets';
import { Lead } from '../types';
import { geminiService } from '../services/geminiService';
import { Users, TrendingUp, AlertCircle, MessageSquare } from 'lucide-react';

export const BrokerView: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [analysis, setAnalysis] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Fetch leads from the shared service to see "connected" buyers
    useEffect(() => {
        const fetchedLeads = geminiService.getLeads();
        setLeads(fetchedLeads);
    }, []);

    const handleLeadSelect = async (lead: Lead) => {
        setSelectedLead(lead);
        setAnalysis('');
        setLoading(true);
        const result = await geminiService.analyzeLead(lead);
        setAnalysis(result);
        setLoading(false);
    };

    return (
        <div className="h-full w-full grid grid-cols-12 gap-4">
            
            {/* Lead Feed */}
            <CyberModule title="INCOMING LEADS" className="col-span-4 h-full">
                <div className="space-y-2">
                    {leads.map(lead => (
                        <div 
                            key={lead.id}
                            onClick={() => handleLeadSelect(lead)}
                            className={`p-3 border cursor-pointer transition-all ${selectedLead?.id === lead.id ? 'bg-[#00f0ff] text-black border-[#00f0ff]' : 'border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/10'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm tracking-widest">{lead.name.toUpperCase()}</span>
                                <span className={`text-[10px] px-1 border ${selectedLead?.id === lead.id ? 'border-black' : 'border-[#00f0ff]'}`}>{lead.urgency} PRIORITY</span>
                            </div>
                            <div className="text-[10px] opacity-80 mb-2 font-mono">
                                {lead.preferences}
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="font-mono text-xs">{lead.budget}</span>
                                <span className="text-xs font-bold">{lead.matchScore}% MATCH</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CyberModule>

            {/* AI Analysis & CRM */}
            <div className="col-span-8 flex flex-col gap-4">
                
                {/* Stats Header */}
                <div className="h-24 grid grid-cols-3 gap-4">
                    <CyberModule title="CONVERSION RATE" className="h-full">
                         <div className="flex items-center gap-3 h-full">
                             <TrendingUp size={24} className="text-[#00f0ff]" />
                             <div>
                                 <div className="text-2xl font-bold text-[#00f0ff]">24.8%</div>
                                 <div className="text-[10px] text-[#00f0ff] opacity-60">WEEKLY VARIANCE +2.1%</div>
                             </div>
                         </div>
                    </CyberModule>
                    <CyberModule title="ACTIVE CLIENTS" className="h-full">
                        <div className="flex items-center gap-3 h-full">
                             <Users size={24} className="text-[#00f0ff]" />
                             <div>
                                 <div className="text-2xl font-bold text-[#00f0ff]">{leads.length + 12}</div>
                                 <div className="text-[10px] text-[#00f0ff] opacity-60">3 PENDING CONTRACT</div>
                             </div>
                         </div>
                    </CyberModule>
                    <CyberModule title="ALERTS" className="h-full">
                        <div className="flex items-center gap-3 h-full">
                             <AlertCircle size={24} className="text-[#00f0ff] animate-pulse" />
                             <div>
                                 <div className="text-xs font-bold text-[#00f0ff]">NEW MARKET REGULATION</div>
                                 <div className="text-[10px] text-[#00f0ff] opacity-60">CHECK COMPLIANCE DOCS</div>
                             </div>
                         </div>
                    </CyberModule>
                </div>

                {/* Main Analysis Panel */}
                <CyberModule title="NEURAL LINK // ANALYSIS" className="flex-1">
                    {selectedLead ? (
                        <div className="h-full flex flex-col">
                            <div className="flex items-center gap-4 border-b border-[#00f0ff]/30 pb-4 mb-4">
                                <div className="w-16 h-16 border border-[#00f0ff] bg-[#00f0ff]/10 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#00f0ff]">{selectedLead.name.split(' ')[0][0]}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl text-[#00f0ff] font-bold tracking-widest">{selectedLead.name}</h2>
                                    <div className="text-xs text-[#00f0ff] opacity-70 font-mono">ID: {selectedLead.id} // BUDGET: {selectedLead.budget}</div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="text-xs text-[#00f0ff] mb-2 font-bold tracking-widest flex items-center gap-2">
                                    <MessageSquare size={14} /> AI STRATEGIC ADVISORY
                                </div>
                                <div className="p-4 border border-[#00f0ff] bg-[#00f0ff]/5 font-mono text-sm text-[#00f0ff] leading-relaxed relative">
                                    {loading ? (
                                        <div className="animate-pulse">
                                            >> ANALYZING PSYCHOGRAPHIC PROFILE...<br/>
                                            >> CROSS-REFERENCING MARKET INVENTORY...<br/>
                                            >> GENERATING TACTICAL APPROACH...
                                        </div>
                                    ) : (
                                        <div className="typewriter">
                                            {analysis}
                                        </div>
                                    )}
                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-[#00f0ff]"></div>
                                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00f0ff]"></div>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 border border-[#00f0ff] bg-[#00f0ff] text-black py-2 font-bold hover:bg-white transition-colors text-sm tracking-widest">INITIATE CONTACT</button>
                                <button className="flex-1 border border-[#00f0ff] text-[#00f0ff] py-2 font-bold hover:bg-[#00f0ff]/10 transition-colors text-sm tracking-widest">ARCHIVE LEAD</button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-[#00f0ff] opacity-50 font-mono text-sm">
                            >> SELECT A LEAD FROM THE FEED TO INITIATE ANALYSIS
                        </div>
                    )}
                </CyberModule>
            </div>
        </div>
    );
};