import React, { useEffect, useRef } from 'react';

// --- UTILS ---
const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, color: string) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  const step = 20;
  for (let x = 0; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

// --- REUSABLE CYBER CONTAINER ---
export const CyberModule = ({ title, children, className = "" }: { title: string, children?: React.ReactNode, className?: string }) => (
    <div className={`border border-[#00f0ff] bg-[#020408] relative p-4 flex flex-col border-glow ${className}`}>
        {/* Module Title Bar */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-2 py-1 border-b border-[#00f0ff]/30 bg-[#00f0ff]/5 z-10">
            <span className="text-[10px] tracking-[0.2em] font-bold text-[#00f0ff] uppercase">{title}</span>
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-[#00f0ff]"></div>
                <div className="w-1 h-1 bg-[#00f0ff] opacity-50"></div>
                <div className="w-1 h-1 bg-[#00f0ff] opacity-20"></div>
            </div>
        </div>
        {/* Content */}
        <div className="mt-4 flex-1 overflow-auto scrollbar-hide relative z-0">
            {children}
        </div>
        
        {/* Corner Accents */}
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#00f0ff]"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#00f0ff]"></div>
    </div>
);

// --- 1. THE EYE (Visual Input) ---
export const CyberEye: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      frame++;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      
      // Draw noisy pupil
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Iris
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#001122';
      ctx.fill();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pupil (Glow)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15 + Math.sin(frame * 0.1) * 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.fill();

      // Noise rings
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20 + i * 8, frame * 0.05 + i, frame * 0.05 + i + 1);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 + Math.random() * 0.2})`;
        ctx.stroke();
      }

      // Scanline
      const scanY = (frame * 2) % height;
      ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.fillRect(0, scanY, width, 2);

      // Grain
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.8) {
           const noise = Math.random() * 50;
           data[i] = Math.min(255, data[i] + noise);     // R
           data[i+1] = Math.min(255, data[i+1] + noise); // G
           data[i+2] = Math.min(255, data[i+2] + noise); // B
        }
      }
      ctx.putImageData(imageData, 0, 0);

      requestAnimationFrame(render);
    };
    render();
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full object-cover opacity-80 mix-blend-screen" width={300} height={200} />;
};

// --- 2. THE CHIPSET (Schematic) ---
export const CyberCircuit: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#001122]">
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
         <defs>
             <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00f0ff" strokeWidth="0.1" opacity="0.2"/>
             </pattern>
         </defs>
         <rect width="100" height="100" fill="url(#grid)" />
         
         {/* Central Chip */}
         <rect x="35" y="35" width="30" height="30" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
         <rect x="40" y="40" width="20" height="20" fill="#00f0ff" fillOpacity="0.1" stroke="#00f0ff" strokeWidth="0.2" />
         
         {/* Animated Traces */}
         <path d="M 50 35 L 50 10 M 40 35 L 40 10 M 60 35 L 60 10" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="5,2">
            <animate attributeName="stroke-dashoffset" from="0" to="14" dur="2s" repeatCount="indefinite" />
         </path>
         <path d="M 50 65 L 50 90 M 40 65 L 40 90 M 60 65 L 60 90" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="5,2">
            <animate attributeName="stroke-dashoffset" from="14" to="0" dur="2s" repeatCount="indefinite" />
         </path>
         <path d="M 35 50 L 10 50 M 35 40 L 10 40 M 35 60 L 10 60" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="5,2">
            <animate attributeName="stroke-dashoffset" from="0" to="14" dur="3s" repeatCount="indefinite" />
         </path>
         <path d="M 65 50 L 90 50 M 65 40 L 90 40 M 65 60 L 90 60" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="5,2">
            <animate attributeName="stroke-dashoffset" from="14" to="0" dur="3s" repeatCount="indefinite" />
         </path>
      </svg>
      {/* Blinking Status Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#00f0ff] animate-pulse blur-[2px]"></div>
    </div>
  );
};

// --- 3. THE FIGURE (Threat Assessment) ---
export const CyberFigure: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let t = 0;
        const render = () => {
            t += 0.05;
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            // Draw Silhouette (Rough collection of rectangles)
            ctx.fillStyle = '#00f0ff';
            
            // Head
            const headX = width / 2;
            const headY = height * 0.2 + Math.sin(t * 2) * 2;
            ctx.fillRect(headX - 10, headY, 20, 20);

            // Torso
            const torsoY = headY + 25;
            ctx.fillRect(headX - 15, torsoY, 30, 60);

            // Arms (Swinging)
            const armSwing = Math.sin(t * 4) * 15;
            ctx.fillRect(headX - 25 + armSwing, torsoY, 8, 40); // Left
            ctx.fillRect(headX + 17 - armSwing, torsoY, 8, 40); // Right

            // Legs (Walking)
            const legSwing = Math.sin(t * 4) * 15;
            ctx.fillRect(headX - 12 - legSwing, torsoY + 65, 10, 50); // Left
            ctx.fillRect(headX + 2 + legSwing, torsoY + 65, 10, 50); // Right

            // Scan effect
            ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
            for(let i=0; i<height; i+=4) {
                if (i % 8 === 0) ctx.fillRect(0, i, width, 1);
            }

            requestAnimationFrame(render);
        };
        render();
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full opacity-80" width={150} height={200} />;
};

// --- 4. WAVEFORM (Audio/Data) ---
export const CyberWaveform: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let offset = 0;
        const render = () => {
            offset += 0.2;
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            drawGrid(ctx, width, height, 'rgba(0, 240, 255, 0.1)');

            ctx.beginPath();
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;

            for (let x = 0; x < width; x++) {
                const y = height / 2 + Math.sin(x * 0.05 + offset) * 20 * Math.sin(x * 0.01 + offset * 0.5);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Second harmonic
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
            for (let x = 0; x < width; x++) {
                const y = height / 2 + Math.sin(x * 0.1 - offset) * 10;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            requestAnimationFrame(render);
        };
        render();
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" width={300} height={100} />;
}