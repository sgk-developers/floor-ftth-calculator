import React from 'react';
import { FloorData, CableType } from '../types/cable';

interface Props {
  floors: FloorData[];
  onUpdate: (id: string, field: keyof FloorData, value: any) => void;
  onDelete: (id: string) => void;
  darkMode?: boolean;
  selectedFloorId?: string | null;
}

const getCableBadgeClass = (type: CableType, darkMode: boolean) => {
  switch (type) {
    case '2"': return darkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-600 border-blue-200';
    case '4"': return darkMode ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-orange-50 text-orange-600 border-orange-200';
    case '12"': return darkMode ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-600 border-red-200';
    default: return darkMode ? 'bg-white/5 text-neutral-500 border-white/10' : 'bg-slate-50 text-slate-400 border-slate-200';
  }
};

export const FloorTable: React.FC<Props> = ({ 
  floors, 
  onUpdate, 
  onDelete, 
  darkMode = true, 
  selectedFloorId 
}) => {
  React.useEffect(() => {
    if (selectedFloorId) {
      const element = document.getElementById(`floor-row-${selectedFloorId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedFloorId]);

  const totals = {
    '2"': floors.filter(f => f.cableType === '2"').reduce((acc, f) => acc + f.meters, 0),
    '4"': floors.filter(f => f.cableType === '4"').reduce((acc, f) => acc + f.meters, 0),
    '12"': floors.filter(f => f.cableType === '12"').reduce((acc, f) => acc + f.meters, 0),
  };

  const inputBaseClass = `bg-transparent w-full outline-none px-2 py-1.5 rounded-lg transition-all duration-300 focus:scale-[1.02] focus:-translate-y-0.5 focus:shadow-lg focus:ring-2 ${
    darkMode 
      ? 'focus:bg-[#1a1a1a] focus:ring-purple-500/40 text-white hover:bg-white/5'
      : 'focus:bg-white focus:ring-purple-400/40 hover:bg-slate-50/80 text-slate-900'
  }`;

  const inputNumClass = `bg-transparent w-16 outline-none px-2 py-1.5 rounded-lg transition-all duration-300 focus:scale-[1.05] focus:-translate-y-0.5 focus:shadow-lg focus:ring-2 ${
    darkMode 
      ? 'focus:bg-[#1a1a1a] focus:ring-cyan-500/40 text-white hover:bg-white/5'
      : 'focus:bg-white focus:ring-cyan-400/40 hover:bg-slate-50/80 text-slate-900'
  }`;

  return (
    <div className={`overflow-x-auto rounded-2xl border transition-all duration-300 ${
      darkMode ? 'border-white/10' : 'border-slate-200 bg-white'
    }`}>
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className={`text-xs uppercase tracking-wider ${
            darkMode ? 'bg-white/5 text-neutral-400' : 'bg-slate-50 text-slate-500 border-b border-slate-200'
          }`}>
            <th className="p-4 font-medium">ΟΡΟΦΟΣ</th>
            <th className="p-4 font-medium">ΔΙΑΜΕΡ.</th>
            <th className="p-4 font-medium">ΚΑΤΑΣΤ.</th>
            <th className="p-4 font-medium">ΜΕΤΡΑ</th>
            <th className="p-4 font-medium">ΕΙΔΟΣ</th>
            <th className="p-4 font-medium"></th>
          </tr>
        </thead>
        <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-slate-100'}`}>
          {floors.map((floor) => (
            <tr 
              key={floor.id} 
              id={`floor-row-${floor.id}`}
              className={`group transition-all duration-500 ${
                floor.id === selectedFloorId 
                  ? (darkMode ? 'bg-purple-500/10 ring-1 ring-purple-500/30' : 'bg-purple-50 ring-1 ring-purple-200')
                  : (darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/50')
              }`}
            >
              <td className="p-2">
                <input 
                  className={inputBaseClass}
                  value={floor.floor}
                  onChange={(e) => onUpdate(floor.id, 'floor', e.target.value)}
                />
              </td>
              <td className="p-2">
                <input 
                  type="number"
                  className={inputNumClass}
                  value={floor.apartments}
                  onChange={(e) => onUpdate(floor.id, 'apartments', Number(e.target.value))}
                />
              </td>
              <td className="p-2">
                <input 
                  type="number"
                  className={inputNumClass}
                  value={floor.shops}
                  onChange={(e) => onUpdate(floor.id, 'shops', Number(e.target.value))}
                />
              </td>
              <td className="p-2">
                <input 
                  type="number"
                  className={`bg-transparent w-20 font-mono outline-none px-2 py-1.5 rounded-lg transition-all duration-300 focus:scale-[1.05] focus:-translate-y-0.5 focus:shadow-lg focus:ring-2 ${
                    darkMode 
                      ? 'text-purple-400 focus:bg-[#1a1a1a] focus:ring-purple-500/40 hover:bg-white/5'
                      : 'text-purple-600 focus:bg-white focus:ring-purple-400/40 hover:bg-purple-50'
                  }`}
                  value={floor.meters}
                  onChange={(e) => onUpdate(floor.id, 'meters', Number(e.target.value))}
                />
              </td>
              <td className="p-2">
                <select 
                  value={floor.cableType}
                  onChange={(e) => onUpdate(floor.id, 'cableType', e.target.value as CableType)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold outline-none cursor-pointer transition-all duration-300 focus:scale-[1.05] focus:-translate-y-0.5 focus:shadow-lg focus:ring-2 focus:ring-purple-500/30 ${getCableBadgeClass(floor.cableType, darkMode)}`}
                >
                  <option value="" className={darkMode ? 'bg-[#121212]' : 'bg-white'}>-</option>
                  <option value='2"' className={darkMode ? 'bg-[#121212]' : 'bg-white'}>2"</option>
                  <option value='4"' className={darkMode ? 'bg-[#121212]' : 'bg-white'}>4"</option>
                  <option value='12"' className={darkMode ? 'bg-[#121212]' : 'bg-white'}>12"</option>
                </select>
              </td>
              <td className="p-2 text-right">
                <button 
                  onClick={() => onDelete(floor.id)}
                  className={`opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 ${
                    darkMode ? 'text-neutral-600 hover:text-red-400' : 'text-slate-400 hover:text-red-500'
                  }`}
                  title="Διαγραφή Ορόφου"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className={`font-semibold border-t transition-colors duration-300 ${
          darkMode ? 'bg-white/5 text-white border-white/10' : 'bg-slate-50 text-slate-900 border-slate-200'
        }`}>
          <tr>
            <td colSpan={3} className={`p-4 text-right ${darkMode ? 'text-neutral-400' : 'text-slate-500'}`}>Σύνολα Μέτρων:</td>
            <td colSpan={3} className="p-4">
              <div className="flex gap-4">
                <span className={`transition-colors duration-300 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>2": {totals['2"']}m</span>
                <span className={`transition-colors duration-300 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>4": {totals['4"']}m</span>
                <span className={`transition-colors duration-300 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>12": {totals['12"']}m</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};