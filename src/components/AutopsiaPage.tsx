import React, { useState, useEffect } from 'react';
import { ConfirmationModal } from './ConfirmationModal';

interface Props {
  onBack: () => void;
  darkMode: boolean;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

const STORAGE_KEY_AUTOPSIA = 'cable_app_autopsia_v1';

export const AutopsiaPage: React.FC<Props> = ({ onBack, darkMode }) => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // State with LocalStorage persistence
  const [projectName, setProjectName] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_AUTOPSIA + '_project') || '';
  });
  
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_AUTOPSIA + '_notes') || '';
  });

  const [recipientEmail, setRecipientEmail] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_AUTOPSIA + '_email') || '';
  });

  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTOPSIA + '_items');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', label: 'Έλεγχος πρόσβασης σε ορόφους / κλειδιά', completed: false },
      { id: '2', label: 'Εντοπισμός κατακόρυφου άξονα (Riser)', completed: false },
      { id: '3', label: 'Έλεγχος διαθεσιμότητας χώρου για BEP/MDF', completed: false },
      { id: '4', label: 'Μέτρηση αποστάσεων από το σημείο εισόδου', completed: false },
      { id: '5', label: 'Φωτογράφιση εισόδου και κοινόχρηστων χώρων', completed: false },
      { id: '6', label: 'Έλεγχος παροχής ρεύματος (αν απαιτείται ενεργός εξοπλισμός)', completed: false },
      { id: '7', label: 'Καταγραφή ιδιαιτεροτήτων κτιρίου (π.χ. μάρμαρα, γυψοσανίδες)', completed: false },
    ];
  });

  // Auto-save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AUTOPSIA + '_project', projectName);
    localStorage.setItem(STORAGE_KEY_AUTOPSIA + '_notes', notes);
    localStorage.setItem(STORAGE_KEY_AUTOPSIA + '_email', recipientEmail);
    localStorage.setItem(STORAGE_KEY_AUTOPSIA + '_items', JSON.stringify(items));
  }, [projectName, notes, recipientEmail, items]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const resetChecklist = () => {
    setItems(items.map(item => ({ ...item, completed: false })));
    setProjectName('');
    setNotes('');
    setRecipientEmail('');
    setIsResetModalOpen(false);
  };

  const progress = Math.round((items.filter(i => i.completed).length / items.length) * 100);

  const shareToWhatsApp = () => {
    const completedCount = items.filter(i => i.completed).length;
    const text = `📋 *Αυτοψία Δικτύου*

🏗️ *Έργο:* ${projectName || '---'}
📈 *Πρόοδος:* ${progress}% (${completedCount}/${items.length})

📝 *Σημειώσεις:*
${notes || 'Καμία σημείωση'}

*Fiber Manager Pro*`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const sendEmail = () => {
    const completedCount = items.filter(i => i.completed).length;
    const subject = `Αυτοψία Δικτύου - ${projectName || 'Χωρίς τίτλο'}`;
    const body = `Καλησπέρα,

Σας αποστέλλω την αυτοψία δικτύου με τα παρακάτω στοιχεία:

Έργο: ${projectName || '---'}
Πρόοδος: ${progress}% (${completedCount}/${items.length})

Σημειώσεις:
${notes || 'Καμία σημείωση'}

Με εκτίμηση,
Fiber Manager Pro`;

    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const copyEmail = () => {
    if (!recipientEmail) return;
    navigator.clipboard.writeText(recipientEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-500 ${darkMode ? 'bg-[#050505] text-white' : 'bg-[#fcfcfc] text-slate-950'}`}>
      <ConfirmationModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetChecklist}
        title="Επαναφορά Αυτοψίας;"
        message="Είστε σίγουροι ότι θέλετε να διαγράψετε όλα τα δεδομένα της αυτοψίας; Αυτή η ενέργεια δεν αναιρείται."
      />
      
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8 md:mb-12 print:mb-6">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={onBack}
              className={`print:hidden w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border shadow-sm ${ 
                darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Αυτοψία Δικτύου</h1>
              <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1 ${darkMode ? 'text-neutral-500' : 'text-slate-500'}`}>
                Fiber Manager Pro • {new Date().toLocaleDateString('el-GR')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 print:hidden">
            <button 
              onClick={() => window.print()}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border ${ 
                darkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20' : 'bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100'
              }`}
              title="Εκτύπωση / PDF"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>

            <button 
              onClick={shareToWhatsApp}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border ${ 
                darkMode ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-green-50 border-green-100 text-green-600 hover:bg-green-100'
              }`}
              title="Κοινοποίηση στο WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.711 1.435h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>

            <button 
              onClick={sendEmail}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border ${ 
                darkMode ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20' : 'bg-cyan-50 border-cyan-100 text-cyan-600 hover:bg-cyan-100'
              }`}
              title="Αποστολή μέσω Email"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>

            <button 
              onClick={() => setIsResetModalOpen(true)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 border ${ 
                darkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100'
              }`}
              title="Εκκαθάριση"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </header>

        <div className="space-y-8">
          {/* Project Details Card */}
          <div className={`p-6 md:p-8 rounded-[2.5rem] border transition-all ${ 
            darkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>
                  Στοιχεία Έργου / Διεύθυνση
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Εισάγετε όνομα έργου..."
                  className={`w-full px-6 py-4 rounded-2xl border-2 font-bold transition-all outline-none print:border-none print:p-0 print:text-xl ${
                    darkMode 
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-purple-500/50 focus:bg-white/[0.08]'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-purple-400'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-2 print:hidden">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>
                  Email Παραλήπτη (Προαιρετικό)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="example@email.com"
                    className={`w-full pl-6 pr-14 py-4 rounded-2xl border-2 font-bold transition-all outline-none ${
                      darkMode 
                        ? 'bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-purple-500/50 focus:bg-white/[0.08]'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-purple-400 shadow-sm'
                    }`}
                  />
                  {recipientEmail && (
                    <button 
                      onClick={copyEmail}
                      className={`absolute right-3 p-2 rounded-xl transition-all active:scale-90 ${
                        copied 
                          ? 'text-green-500 bg-green-500/10' 
                          : (darkMode ? 'text-neutral-500 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50')
                      }`}
                      title="Αντιγραφή Email"
                    >
                      {copied ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 print:hidden">
                <div className="flex justify-between items-end px-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>Πρόοδος Αυτοψίας</span>
                  <span className="text-sm font-black text-purple-500">{progress}%</span>
                </div>
                <div className={`h-2.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Section */}
          <div className="space-y-3">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] px-1 mb-4 ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>Λίστα Ελέγχου</h2>
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-5 group print:border-slate-100 ${
                  item.completed 
                    ? (darkMode ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200')
                    : (darkMode ? 'bg-white/[0.02] border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm')
                }`}
              >
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 print:border-purple-500 ${
                  item.completed 
                    ? 'bg-purple-500 border-purple-500 text-white scale-110 shadow-lg shadow-purple-500/30' 
                    : (darkMode ? 'border-white/10 group-hover:border-purple-500/50' : 'border-slate-200 group-hover:border-purple-400')
                }`}>
                  {item.completed && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`flex-1 font-bold text-sm md:text-base transition-all ${
                  item.completed 
                    ? (darkMode ? 'text-purple-300 line-through opacity-50' : 'text-purple-700 line-through opacity-50')
                    : (darkMode ? 'text-neutral-200' : 'text-slate-700')
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Notes Section */}
          <div className="space-y-4">
            <h2 className={`text-xs font-black uppercase tracking-[0.2em] px-1 ${darkMode ? 'text-neutral-500' : 'text-slate-400'}`}>Παρατηρήσεις / Σημειώσεις</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Προσθέστε τυχόν ιδιαιτερότητες ή επιπλέον ανάγκες..."
              rows={6}
              className={`w-full px-6 py-5 rounded-[2rem] border-2 font-medium transition-all outline-none resize-none ${
                darkMode 
                  ? 'bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-purple-500/50 focus:bg-white/[0.08]'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-300 focus:border-purple-400 shadow-sm'
              }`}
            />
          </div>
        </div>

        <footer className={`mt-12 p-8 rounded-[2.5rem] border text-center print:hidden ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-neutral-600' : 'text-slate-400'}`}>
            Τα δεδομένα αποθηκεύονται αυτόματα στη συσκευή σας.
          </p>
        </footer>

        {/* Print Signature Line (Only visible on print) */}
        <div className="hidden print:block mt-20">
          <div className="flex justify-between">
            <div className="text-center border-t border-slate-300 pt-4 w-48">
              <p className="text-xs font-bold uppercase">Ημερομηνία</p>
              <p className="mt-2">{new Date().toLocaleDateString('el-GR')}</p>
            </div>
            <div className="text-center border-t border-slate-300 pt-4 w-48">
              <p className="text-xs font-bold uppercase">Υπογραφή Τεχνικού</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
