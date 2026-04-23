import React from 'react';
import { FloorData } from '../types/cable';

interface Props {
  floors: FloorData[];
  darkMode?: boolean;
}

export const BuildingVisual: React.FC<Props> = ({ floors, darkMode = true }) => {
  // Keep floors in original order (+00, +01, +02...) to match Y calculation
  const displayFloors = [...floors]; 
  const floorHeight = 70;
  const buildingWidth = 320;
  const shaftWidth = 80;
  const totalWidth = buildingWidth + shaftWidth + 100;
  const chartHeight = Math.max(500, (displayFloors.length + 2) * floorHeight);

  const totals = {
    '2"': floors.filter(f => f.cableType === '2"').reduce((acc, f) => acc + f.meters, 0),
    '4"': floors.filter(f => f.cableType === '4"').reduce((acc, f) => acc + f.meters, 0),
    '12"': floors.filter(f => f.cableType === '12"').reduce((acc, f) => acc + f.meters, 0),
  };

  const risers = [
    { type: '2"' as const, x: buildingWidth + 30, color: '#3b82f6', label: '2"', glow: 'rgba(59, 130, 246, 0.5)' },
    { type: '4"' as const, x: buildingWidth + 55, color: '#f97316', label: '4"', glow: 'rgba(249, 115, 22, 0.5)' },
    { type: '12"' as const, x: buildingWidth + 80, color: '#ef4444', label: '12"', glow: 'rgba(239, 68, 68, 0.5)' },
  ];

  return (
    <div className={`backdrop-blur-2xl border rounded-3xl p-6 md:p-8 shadow-2xl sticky top-8 transition-all duration-300 ${
      darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white/70 border-slate-200 shadow-slate-200/50'
    }`}>
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Elevation View</h2>
          <p className={`text-xs mt-1 uppercase tracking-widest ${darkMode ? 'text-neutral-500' : 'text-slate-500'}`}>Δυναμική Απεικόνιση Κτιρίου</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {risers.map(r => (
            <div key={r.type} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
              darkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: r.color, boxShadow: `0 0 8px ${r.glow}` }} />
              <div className="flex flex-col">
                <span className={`text-[9px] font-black uppercase leading-none ${darkMode ? 'opacity-40 text-white' : 'text-slate-400'}`}>{r.label}</span>
                <span className={`text-[11px] font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{totals[r.type]}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-auto max-h-[70vh] pr-2 custom-scrollbar">
        <svg width={totalWidth} height={chartHeight} className="mx-auto drop-shadow-2xl min-w-[400px]">
          <defs>
            <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)"} />
              <stop offset="100%" stopColor={darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.01)"} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect x="20" y={chartHeight - 40} width={buildingWidth + 120} height="40" rx="4" fill={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
          <line x1="0" y1={chartHeight - 40} x2={totalWidth} y2={chartHeight - 40} stroke={darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} strokeWidth="2" />

          <rect 
            x="50" 
            y={40} 
            width={buildingWidth} 
            height={chartHeight - 80} 
            fill="url(#buildingGradient)" 
            stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 
            strokeWidth="1"
            rx="8"
          />

          <rect 
            x={buildingWidth + 20} 
            y={60} 
            width={shaftWidth + 20} 
            height={chartHeight - 100} 
            fill={darkMode ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.04)"} 
            rx="4"
            stroke={darkMode ? "none" : "rgba(0,0,0,0.05)"}
          />

          {risers.map(riser => {
            // Find the index of the highest floor for this cable type
            let maxIdx = -1;
            displayFloors.forEach((f, i) => {
              if (f.cableType === riser.type && f.meters > 0) maxIdx = i;
            });

            if (maxIdx === -1) return null;
            const stopY = chartHeight - 110 - (maxIdx * floorHeight);

            return (
              <g key={riser.type}>
                <line 
                  x1={riser.x} 
                  y1={chartHeight - 40} 
                  x2={riser.x} 
                  y2={stopY}
                  stroke={riser.color} 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  style={{ filter: darkMode ? 'url(#glow)' : 'none' }}
                  className="opacity-80"
                />
                <circle cx={riser.x} cy={chartHeight - 40} r="6" fill={riser.color} />
                <text 
                  x={riser.x} 
                  y={chartHeight - 15} 
                  textAnchor="middle" 
                  fill={riser.color} 
                  fontSize="10" 
                  className="font-black"
                >
                  {riser.label}
                </text>
              </g>
            );
          })}

          {displayFloors.map((floor, index) => {
            const y = chartHeight - 110 - (index * floorHeight);
            const isCurrent = floor.meters > 0;
            const currentRiser = risers.find(r => r.type === floor.cableType);

            return (
              <g key={floor.id} className="group">
                <line 
                  x1="50" y1={y + 30} x2={buildingWidth + 50} y2={y + 30} 
                  stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} 
                  strokeWidth="2" 
                />
                
                {[0, 1, 2, 3].map(w => (
                  <rect 
                    key={w} 
                    x={70 + (w * 70)} 
                    y={y - 15} 
                    width="40" 
                    height="35" 
                    rx="4" 
                    fill={isCurrent 
                      ? (darkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)') 
                      : (darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)')} 
                    stroke={isCurrent 
                      ? (darkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.4)') 
                      : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')} 
                  />
                ))}

                <text 
                  x="40" 
                  y={y + 5} 
                  textAnchor="end" 
                  fill={isCurrent ? (darkMode ? "white" : "#0f172a") : (darkMode ? "#666" : "#94a3b8")} 
                  fontSize="14" 
                  className="font-black"
                >
                  {floor.floor}
                </text>

                {currentRiser && isCurrent && (
                  <g>
                    <path 
                      d={`M ${currentRiser.x} ${y} L ${buildingWidth + 50} ${y}`}
                      stroke={currentRiser.color}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 2"
                    />
                    
                    <circle cx={buildingWidth + 50} cy={y} r="4" fill={currentRiser.color} />

                    <line 
                      x1={buildingWidth + 50} 
                      y1={y} 
                      x2={buildingWidth - 20} 
                      y2={y} 
                      stroke={currentRiser.color} 
                      strokeWidth="2"
                    />
                    
                    <g transform={`translate(${buildingWidth - 120}, ${y - 35})`}>
                      <rect 
                        width="75" 
                        height="22" 
                        rx="6" 
                        fill={darkMode ? "#111" : "white"} 
                        stroke={currentRiser.color} 
                        strokeWidth="1.5" 
                      />
                      <text x="37.5" y="15" textAnchor="middle" fontSize="10" className="font-bold">
                        <tspan fill={currentRiser.color}>{floor.cableType}</tspan>
                        <tspan dx="4" fill={darkMode ? "white" : "#0f172a"} className="font-mono">{floor.meters}m</tspan>
                      </text>
                    </g>
                  </g>
                )}
              </g>
            );
          })}

          <path 
            d={`M 50 40 L ${buildingWidth/2 + 50} 10 L ${buildingWidth + 50} 40 Z`} 
            fill={darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"} 
            stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
          />
          <rect x={buildingWidth/2 + 30} y="5" width="40" height="15" rx="2" fill={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
        </svg>
      </div>
    </div>
  );
};
