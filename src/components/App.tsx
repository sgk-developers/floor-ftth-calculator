import React, { useState, useEffect } from 'react';
import { FloorData, CableType } from '../types/cable';
import { DistributionPanel } from './DistributionPanel';
import { FloorTable } from './FloorTable';
import { BuildingVisual } from './BuildingVisual';
import { ConfirmationModal } from './ConfirmationModal';

const STORAGE_KEY = 'cable_app_data';
const THEME_KEY = 'cable_app_theme';

const App: React.FC = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved ? saved === 'dark' : true;
  });

  const [floors, setFloors] = useState<FloorData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      { id: '1', floor: '+00', apartments: 0, shops: 0, fb01Count: 0, fb01Type: '', fb02Count: 0, fb02Type: '', customerFb: '', customerApt: '', gisId: '', fb04Type: '', customerFb2: '', customerRoomNumbering: '', gisId2: '', meters: 0, cableType: '' }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(floors));
  }, [floors]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addFloor = () => {
    const newFloor: FloorData = {
      id: Math.random().toString(36).substr(2, 9),
      floor: `+${floors.length.toString().padStart(2, '0')}`,
      apartments: 0,
      shops: 0,
      fb01Count: 0,
      fb01Type: '',
      fb02Count: 0,
      fb02Type: '',
      customerFb: '',
      customerApt: '',
      gisId: '',
      fb04Type: '',
      customerFb2: '',
      customerRoomNumbering: '',
      gisId2: '',
      meters: 0,
      cableType: ''
    };
    setFloors([...floors, newFloor]);
  };

  const addThreeFloors = () => {
    const newFloors: FloorData[] = Array.from({ length: 3 }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9) + i,
      floor: `+${(floors.length + i).toString().padStart(2, '0')}`,
      apartments: 0,
      shops: 0,
      fb01Count: 0,
      fb01Type: '',
      fb02Count: 0,
      fb02Type: '',
      customerFb: '',
      customerApt: '',
      gisId: '',
      fb04Type: '',
      customerFb2: '',
      customerRoomNumbering: '',
      gisId2: '',
      meters: 0,
      cableType: ''
    }));
    setFloors([...floors, ...newFloors]);
  };

  const updateFloor = (id: string, field: keyof FloorData, value: any) => {
    setFloors(floors.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const deleteFloor = (id: string) => {
    if (floors.length > 1) {
      setFloors(floors.filter(f => f.id !== id));
    }
  };

  const handleConfirmReset = () => {
    setFloors([
      { id: '1', floor: '+00', apartments: 0, shops: 0, fb01Count: 0, fb01Type: '', fb02Count: 0, fb02Type: '', customerFb: '', customerApt: '', gisId: '', fb04Type: '', customerFb2: '', customerRoomNumbering: '', gisId2: '', meters: 0, cableType: '' }
    ]);
    localStorage.removeItem(STORAGE_KEY);
    setIsResetModalOpen(false);
  };

  const applyDistribution = (updates: { id: string; meters: number; cableType: CableType }[]) => {
    setFloors(prev => prev.map(floor => {
      const update = updates.find(u => u.id === floor.id);
      if (update) {
        return { ...floor, meters: update.meters, cableType: update.cableType };
      }
      return floor;
    }));
  };

  const exportToExcel = () => {
    const headers = ['ΟΡΟΦΟΣ', 'ΔΙΑΜΕΡΙΣΜΑΤΑ', 'ΚΑΤΑΣΤΗΜΑΤΑ', 'FB01', 'FB01 TYPE', 'FB02', 'FB02 TYPE', 'FB ΠΕΛΑΤΗ', 'GIS ID', 'ΜΕΤΡΑ', 'ΕΙΔΟΣ'];
    const csvContent = [
      headers.join(','),
      ...floors.map(f => [
        f.floor, f.apartments, f.shops, f.fb01Count, f.fb01Type, f.fb02Count, f.fb02Type, f.customerFb, f.gisId, f.meters, f.cableType
      ].join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `cable_distribution_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 p-4 md:p-8 font-sans selection:bg-purple-500/30 ${
      darkMode ? 'bg-[#050505] text-white' : 'bg-[#fcfcfc] text-slate-950'
    }`}>
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className={`absolute top-[-15%] left-[-10%] w-[50%] h-[50%] blur-[140px] rounded-full ${
          darkMode ? 'bg-purple-600/20' : 'bg-purple-400/20'
        }`} />
        <div className={`absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] blur-[140px] rounded-full ${
          darkMode ? 'bg-cyan-600/20' : 'bg-cyan-400/20'
        }`} />
      </div>

      <div className="max-w-7xl mx-auto">
        <ConfirmationModal 
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={handleConfirmReset}
          title="Ολική Διαγραφή;"
          message="Είστε σίγουροι; Αυτή η ενέργεια θα διαγράψει οριστικά όλους τους ορόφους και τις μετρήσεις καλωδίων."
        />
        
        <header className={`relative backdrop-blur-3xl border rounded-[2rem] p-6 md:p-8 mb-6 md:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden shadow-2xl transition-all ${
          darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white/80 border-slate-200 shadow-slate-200/60'
        }`}>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/40">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-2xl md:text-4xl font-black tracking-tight leading-none ${darkMode ? 'text-white' : 'text-slate-950'}`}>
                  Fiber<span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">Manager</span>
                </h1>
                <p className={`text-xs md:text-sm font-bold uppercase tracking-[0.15em] mt-1 ${darkMode ? 'text-neutral-500' : 'text-slate-500'}`}>
                  Professional Network Planner
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 active:scale-90 shadow-lg ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-purple-500/50 shadow-slate-200/50'
              }`}
            >
              {darkMode ? (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>

            <button 
              onClick={addFloor}
              className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 border-2 ${
                darkMode
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20'
                  : 'bg-slate-950 border-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-950/20'
              }`}
              title="Προσθήκη ενός ορόφου"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              +1
            </button>

            <button 
              onClick={addThreeFloors}
              className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 border-2 ${
                darkMode
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
                  : 'bg-cyan-600 border-cyan-700 text-white hover:bg-cyan-700 shadow-xl shadow-cyan-900/20'
              }`}
              title="Προσθήκη τριών ορόφων"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              +3
            </button>
            
            <button 
              onClick={exportToExcel}
              className={`px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 border-2 ${
                darkMode
                  ? 'bg-white text-black border-white hover:bg-neutral-200'
                  : 'bg-white border-slate-200 text-slate-950 hover:bg-slate-50 shadow-lg'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Excel
            </button>

            <button 
              onClick={() => setIsResetModalOpen(true)}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 active:scale-90 shadow-lg ${
                darkMode
                  ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                  : 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 shadow-red-200/50'
              }`}
              title="Εκκαθάριση Δεδομένων"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
              <DistributionPanel floors={floors} onApply={applyDistribution} />
              <div className={`backdrop-blur-3xl border rounded-[2.5rem] p-2 shadow-2xl transition-all ${
                darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-slate-200/40'
              }`}>
                <FloorTable 
                  floors={floors} 
                  onUpdate={updateFloor} 
                  onDelete={deleteFloor} 
                  darkMode={darkMode} 
                  selectedFloorId={selectedFloorId}
                />
              </div>
            </div>
            <div className="lg:col-span-4">
              <BuildingVisual 
                floors={floors} 
                darkMode={darkMode} 
                onFloorSelect={setSelectedFloorId}
                selectedFloorId={selectedFloorId}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;