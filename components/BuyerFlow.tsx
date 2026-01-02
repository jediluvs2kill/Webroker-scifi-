import React, { useState, useRef, useEffect } from 'react';
import { Message, Broker } from '../types';
import { geminiService } from '../services/geminiService';
import { Send, Fingerprint, AlertCircle } from 'lucide-react'; // Removed unused imports
import { motion } from 'framer-motion';
import { CyberEye, CyberWaveform, CyberFigure } from './CyberWidgets';

const BuyerFlow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'init', 
      role: 'model', 
      text: "INITIATING CONCIERGE PROTOCOL... \nIdentify property requirements.", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectBroker = (broker: Broker) => {
    setSelectedBroker(broker);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await geminiService.sendMessage(userMsg.text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text,
        timestamp: new Date(),
        brokers: response.brokers,
        isBrokerRecommendation: !!response.brokers
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full w-full grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
      
      {/* LEFT COLUMN - VISUAL DATA */}
      <div className="flex flex-col gap-4 h-full">
        
        {/* TOP LEFT: EYE SCANNER (Subject A-34 style) */}
        <div className="relative flex-1 border border-[#00f0ff] bg-[#020408] p-1 flex flex-col items-center justify-center overflow-hidden border-glow group">
           <div className="absolute top-2 left-2 flex gap-1 z-10">
               <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></div>
               <div className="w-2 h-2 rounded-full bg-[#00f0ff] opacity-50"></div>
           </div>
           <div className="absolute top-2 right-2 text-[#00f0ff] text-[10px] tracking-widest opacity-70 z-10">VISUAL.INPUT</div>
           
           {/* Cyber Eye Widget */}
           <div className="w-full h-full relative">
               <CyberEye />
               {/* Overlay Data */}
               <div className="absolute bottom-4 left-4 text-[#00f0ff] text-[8px] font-mono leading-tight">
                   PUPIL_DILATION: 4.2mm<br/>
                   SACCADE_RATE: 200ms<br/>
                   ATTENTION: 98%
               </div>
           </div>
        </div>

        {/* BOTTOM LEFT: FINGERPRINT & WAVEFORM */}
        <div className="h-1/3 flex gap-4">
             {/* Fingerprint Module */}
            <div className="w-1/3 border border-[#00f0ff] bg-[#020408] relative p-2 flex items-center justify-center border-glow overflow-hidden">
                 <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#00f0ff]"></div>
                 <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#00f0ff]"></div>
                 <Fingerprint size={64} className="text-[#00f0ff] opacity-80 animate-pulse" strokeWidth={0.5} />
                 <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.1)_50%)] bg-[length:100%_4px]"></div>
            </div>

            {/* Waveform Module */}
            <div className="flex-1 border border-[#00f0ff] bg-[#020408] relative p-0 border-glow flex flex-col">
                <div className="absolute top-2 left-2 text-[10px] text-[#00f0ff] tracking-widest z-10">
                    AUDIO.FREQ
                </div>
                <CyberWaveform />
                 {/* Bottom Stats */}
                 <div className="absolute bottom-1 left-2 grid grid-cols-4 gap-2 text-[8px] text-[#00f0ff]/60 font-mono">
                    <div>44.1Khz</div>
                    <div>16BIT</div>
                    <div>MONO</div>
                </div>
            </div>
        </div>
        
        {/* WALKING FIGURE / THREAT ASSESSMENT */}
         <div className="h-1/3 border border-[#00f0ff] bg-[#020408] p-0 relative border-glow flex">
             {/* Figure Visualization */}
             <div className="w-1/3 border-r border-[#00f0ff]/30 h-full relative">
                 <CyberFigure />
                 <div className="absolute bottom-2 left-2 text-[8px] text-[#00f0ff]">SUBJ_89</div>
             </div>
             
             {/* Text Data */}
             <div className="flex-1 p-3 space-y-3">
                 <div className="flex justify-between items-center border-b border-[#00f0ff]/30 pb-1">
                     <span className="text-xs text-[#00f0ff] font-bold">ASSESSMENT</span>
                     <span className="flex gap-1">
                         <AlertCircle size={12} fill="#00f0ff" className="text-black" />
                         <AlertCircle size={12} fill="#00f0ff" className="text-black" />
                         <AlertCircle size={12} className="text-[#00f0ff] opacity-30" />
                     </span>
                 </div>
                 <div className="grid grid-cols-2 gap-2 text-[10px] text-[#00f0ff] font-mono">
                     <div className="opacity-70">HEART_RATE</div><div>65 BPM</div>
                     <div className="opacity-70">BP_SYSTOLIC</div><div>120 mmHg</div>
                     <div className="opacity-70">O2_SAT</div><div>98%</div>
                     <div className="opacity-70">STRESS</div><div>LOW</div>
                 </div>
                 <div className="mt-2 text-[8px] text-[#00f0ff]/50 leading-tight">
                     > SCAN COMPLETE<br/>
                     > NO ANOMALIES DETECTED<br/>
                     > CLEARANCE GRANTED
                 </div>
             </div>
         </div>

      </div>

      {/* RIGHT COLUMN - THE CHAT INTERFACE */}
      <div className="flex flex-col gap-4 h-full">
         
         {/* HEADER DATA BLOCK - Matching Reference "Name/Function" block */}
         <div className="h-32 border border-[#00f0ff] bg-[#020408] p-4 grid grid-cols-2 gap-x-8 gap-y-1 border-glow relative">
             <div className="absolute top-0 right-0 p-1">
                 <div className="w-8 h-8 border border-[#00f0ff] p-0.5">
                     <div className="w-full h-full bg-[#00f0ff] opacity-20"></div>
                 </div>
             </div>
             
             <div className="col-span-2 border-b border-[#00f0ff]/30 pb-1 mb-1 flex justify-between items-center">
                 <h2 className="text-xl font-bold text-[#00f0ff] tracking-widest">SUBJECT: BUYER</h2>
                 <span className="text-[10px] bg-[#00f0ff] text-black px-1">ACTIVE</span>
             </div>
             <div className="flex justify-between text-sm text-[#00f0ff] border-b border-[#00f0ff]/10">
                 <span className="opacity-60">NAME</span>
                 <span className="font-bold tracking-wider">GUEST.USER</span>
             </div>
             <div className="flex justify-between text-sm text-[#00f0ff] border-b border-[#00f0ff]/10">
                 <span className="opacity-60">INCEPT DATE</span>
                 <span>03/05/2025</span>
             </div>
             <div className="flex justify-between text-sm text-[#00f0ff] border-b border-[#00f0ff]/10">
                 <span className="opacity-60">FUNCTION</span>
                 <span>ACQUISITION</span>
             </div>
             <div className="flex justify-between text-sm text-[#00f0ff] border-b border-[#00f0ff]/10">
                 <span className="opacity-60">MENTAL STATE</span>
                 <span className="animate-pulse text-[#00f0ff]">ANALYZING...</span>
             </div>
         </div>

         {/* MAIN CHAT LOG (SCHEMATIC) */}
         <div className="flex-1 border border-[#00f0ff] bg-[#020408] p-1 flex flex-col relative border-glow overflow-hidden">
             {/* Decorative Background Grid inside Chat */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
             </div>
             
             <div className="absolute top-0 right-0 p-2 text-[10px] text-[#00f0ff] opacity-50 font-mono text-right">
                 LOG.REF: 44X-9<br/>
                 ENCRYPTION: ON
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono z-10" id="chat-container">
                 {messages.map((msg) => (
                     <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                         <span className="text-[10px] text-[#00f0ff]/50 mb-1 tracking-wider uppercase">
                             {msg.role === 'user' ? '>> USER.INPUT' : '>> SYS.RESPONSE'} [{msg.timestamp.toLocaleTimeString()}]
                         </span>
                         <div className={`max-w-[90%] p-3 border ${
                             msg.role === 'user' 
                             ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]' 
                             : 'border-white/30 bg-white/5 text-white'
                         } text-sm shadow-[0_0_5px_rgba(0,240,255,0.1)] relative`}>
                             {/* Corner accents for bubbles */}
                             <div className="absolute top-0 left-0 w-1 h-1 bg-[#00f0ff]"></div>
                             <div className="absolute bottom-0 right-0 w-1 h-1 bg-[#00f0ff]"></div>
                             
                             {msg.text}
                         </div>

                         {/* Broker Cards inside Chat */}
                         {msg.isBrokerRecommendation && msg.brokers && (
                             <div className="mt-2 w-full max-w-[90%] border border-[#00f0ff]/50 p-2 bg-[#020408]">
                                 <div className="text-xs text-[#00f0ff] border-b border-[#00f0ff]/30 mb-2 pb-1">MATCHED_AGENTS_FOUND (3)</div>
                                 <div className="grid gap-2">
                                     {msg.brokers.map(broker => (
                                         <div 
                                            key={broker.id} 
                                            onClick={() => handleSelectBroker(broker)}
                                            className={`flex items-center gap-3 p-2 border ${selectedBroker?.id === broker.id ? 'bg-[#00f0ff] text-black border-[#00f0ff]' : 'border-[#00f0ff]/30 hover:bg-[#00f0ff]/10'} cursor-pointer transition-colors`}
                                         >
                                             <div className="w-8 h-8 bg-[#00f0ff]/20 border border-[#00f0ff] flex items-center justify-center">
                                                 <span className="text-xs font-bold">{broker.name.substring(0,1)}</span>
                                             </div>
                                             <div className="flex-1">
                                                 <div className="text-xs font-bold uppercase">{broker.name}</div>
                                                 <div className="text-[10px] opacity-70">{broker.specialty} | RATING: {broker.rating}</div>
                                             </div>
                                             {selectedBroker?.id === broker.id && <div className="text-[10px] font-bold">[SELECTED]</div>}
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )}
                     </div>
                 ))}
                 {loading && (
                    <div className="text-[#00f0ff] text-xs animate-pulse">
                        >> PROCESSING DATA STREAM...
                    </div>
                 )}
                 <div ref={messagesEndRef} />
             </div>

             {/* Input Area */}
             <div className="border-t border-[#00f0ff] p-2 bg-[#020408] flex items-center gap-2 z-10">
                 <span className="text-[#00f0ff] animate-pulse">_</span>
                 <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    className="flex-1 bg-transparent border-none outline-none text-[#00f0ff] font-mono placeholder-[#00f0ff]/30 text-sm"
                    placeholder="ENTER COMMAND OR QUERY..."
                    autoFocus
                 />
                 <button 
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    className="text-[#00f0ff] hover:text-white disabled:opacity-30"
                 >
                     <div className="border border-[#00f0ff] px-3 py-1 text-xs font-bold">SEND</div>
                 </button>
             </div>
         </div>

      </div>

    </div>
  );
};

export default BuyerFlow;