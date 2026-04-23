import React, { useState } from 'react';
import { CableType, FloorData } from '../types/cable';
import { calculateDistribution } from '../utils/calculations';

interface Props {
  floors: FloorData[];
  onApply: (updates: { id: string; meters: number; cableType: CableType }[]) => void;
}

type CableConfig = {
  totalMeters: number;
  floorIds: string[];
};

export const DistributionPanel: React.FC<Props> = ({ floors, onApply }) => {
  const [configs, setConfigs] = useState<Record<string, CableConfig>>({
    '2"': { totalMeters: 0, floorIds: [] },
    '4"': { totalMeters: 0, floorIds: [] },
    '12"': { totalMeters: 0, floorIds: [] },
  });

  const updateMeters = (type: string, meters: number) => {
    setConfigs(prev => ({
      ...prev,
      [type]: { ...prev[type], totalMeters: meters }
    }));
  };

  const toggleFloorForType = (type: string, floorId: string) => {
    setConfigs(prev => {
      const newConfigs = { ...prev };
      Object.keys(newConfigs).forEach(t => {
        newConfigs[t].floorIds = newConfigs[t].floorIds.filter(id => id !== floorId);
      });
      if (!prev[type].floorIds.includes(floorId)) {
        newConfigs[type].floorIds = [...newConfigs[type].floorIds, floorId];
      }
      return newConfigs;
    });
  };

  const handleApplyAll = () => {
    const allUpdates: { id: string; meters: number; cableType: CableType }[] = [];
    Object.entries(configs).forEach(([type, config]) => {
      if (config.totalMeters > 0 && config.floorIds.length > 0) {
        const distribution = calculateDistribution(config.totalMeters, config.floorIds.length);
        config.floorIds.forEach((id, idx) => {
          allUpdates.push({ id, meters: distribution[idx], cableType: type as CableType });
        });
      }
    });

    if (allUpdates.length > 0) {
      onApply(allUpdates);
      setConfigs({
        '2"': { totalMeters: 0, floorIds: [] },
        '4"': { totalMeters: 0, floorIds: [] },
        '12"': { totalMeters: 0, floorIds: [] },
      });
    }
  };

  const cableTypes = [
    { id: '2"', label: '2" (Blue)', color: 'border-blue-500', darkBg: 'dark:bg-blue-500/10', darkText: 'dark:text-blue-400', lightBg: 'bg-blue-50', lightText: 'text-blue-700' },
    { id: '4"', label: '4" (Orange)', color: 'border-orange-500', darkBg: 'dark:bg-orange-500/10', darkText: 'dark:text-orange-400', lightBg: 'bg-orange-50', lightText: 'text-orange-700' },
    { id: '12"', label: '12" (Red)', color: 'border-red-500', darkBg: 'dark:bg-red-500/10', darkText: 'dark:text-red-400', lightBg: 'bg-red-50', lightText: 'text-red-700' },
  ];

  return (
    <div className="backdrop-blur-3xl border rounded-[2.5rem] p-4 md:p-8 shadow-2xl transition-all duration-500 bg-white border-slate-200 shadow-slate-200/50 dark:bg-white/[0.02] dark:border-white/10 dark:shadow-black/40">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <h2 className="text-2xl font-black mb-1 text-slate-950 dark:text-white">Μαζική Κατανομή</h2>
          <p className="text-sm font-bold text-slate-400 dark:text-neutral-500">Αυτόματος υπολογισμός μήκους καλωδίων</p>
        </div>
        <button 
          onClick={handleApplyAll}
          className="group relative overflow-hidden bg-slate-950 text-white font-black rounded-2xl px-10 py-5 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-950/20"
        >
          <span className="relative z-10">ΕΦΑΡΜΟΓΗ ΤΩΡΑ</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cableTypes.map(type => (
          <div key={type.id} className={`p-6 rounded-3xl border-2 transition-all duration-500 shadow-xl shadow-slate-200/40 dark:shadow-black/20 ${type.lightBg} ${type.darkBg} ${type.color}`}>
            <label className={`block text-[11px] font-black uppercase tracking-widest mb-4 ${type.lightText} ${type.darkText}`}>
              {type.label}
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={configs[type.id].totalMeters || ''}
                onChange={(e) => updateMeters(type.id, Number(e.target.value))}
                className="w-full font-mono text-2xl font-black rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 transition-all bg-white/60 border-black/5 text-slate-950 placeholder-slate-300 focus:ring-black/5 dark:bg-black/40 dark:border-white/10 dark:text-white dark:placeholder-white/10 dark:focus:ring-purple-500/20"
                placeholder="0"
              />
              <span className="absolute right-5 top-5 font-black text-lg text-slate-400 dark:text-white/20">m</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-950 dark:text-white">Επιλογη Οροφων</h3>
          <div className="flex-1 h-[1px] bg-slate-200 dark:bg-white/5" />
        </div>
        
        <div className="grid grid-cols-2 xs:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {floors.map(floor => {
            const activeType = Object.entries(configs).find(([_, c]) => c.floorIds.includes(floor.id))?.[0];
            const typeStyle = activeType ? cableTypes.find(t => t.id === activeType) : null;

            return (
              <div key={floor.id} className="relative group">
                <button
                  className={`w-full py-5 rounded-2xl border-2 text-sm font-black transition-all duration-500 shadow-md ${
                    typeStyle 
                      ? `${typeStyle.lightBg} ${typeStyle.darkBg} ${typeStyle.color} ${typeStyle.lightText} ${typeStyle.darkText} scale-105 shadow-xl` 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400 shadow-sm dark:bg-white/5 dark:border-white/5 dark:text-neutral-500 dark:hover:border-white/20'
                  }`}
                >
                  <span className="block text-[9px] uppercase opacity-50 mb-1">Level</span>
                  {floor.floor}
                </button>
                
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 p-2 rounded-2xl flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-2xl scale-90 group-hover:scale-100 bg-white border border-slate-200 shadow-slate-300/50 dark:bg-black/90 dark:backdrop-blur-xl dark:border-white/10">
                  {cableTypes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => toggleFloorForType(t.id, floor.id)}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-[10px] font-black transition-all hover:scale-110 active:scale-90 ${t.color} ${t.lightText} ${t.darkText}`}
                    >
                      {t.id.replace('"', '')}
                    </button>
                  ))}
                </div>
              </div>
            );
          })} 
        </div>
      </div>
    </div>
  );
};
