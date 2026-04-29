import React, { useEffect, useRef } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<Props> = ({ isOpen, onClose, onConfirm, title, message }) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll('button');
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Focus the cancel button when modal opens for accessibility
      setTimeout(() => cancelButtonRef.current?.focus(), 100);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden" ref={modalRef}>
        <div className="backdrop-blur-2xl bg-[#121212]/90 border border-white/10 rounded-[2.5rem] p-8 shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)] animate-in fade-in zoom-in duration-300">
          
          {/* Icon Header */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/5 rounded-full flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-500/10">
              <svg className="w-10 h-10 text-purple-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3 mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-purple-500/20 active:scale-95 uppercase tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              Εκκαθαριση Δεδομενων
            </button>
            <button
              ref={cancelButtonRef}
              onClick={onClose}
              className="w-full bg-white/5 border border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white font-bold py-4 rounded-2xl transition-all duration-300 active:scale-95 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Ακυρωση
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};