import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert', // 'alert' or 'confirm'
    onConfirm: null,
    onCancel: null,
  });

  const showAlert = (message, title = 'System Notification') => {
    setModal({
      isOpen: true,
      title,
      message,
      type: 'alert',
      onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
    });
  };

  const showConfirm = (message, onConfirm, onCancel, title = 'Confirmation Required') => {
    setModal({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal, modalConfig: modal }}>
      {children}
      <GlobalModal />
    </ModalContext.Provider>
  );
};

const GlobalModal = () => {
  const { modalConfig, closeModal } = useContext(ModalContext);
  if (!modalConfig.isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#121c2b]/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-surface-container-lowest w-full max-w-sm rounded-[2rem] shadow-2xl border border-outline-variant/10 overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center mb-4">
             <span className="material-symbols-outlined text-primary-container font-black">
                {modalConfig.type === 'alert' ? 'info' : 'verified_user'}
             </span>
          </div>
          <h3 className="font-headline font-black text-on-surface text-lg uppercase tracking-tight mb-2">
            {modalConfig.title}
          </h3>
          <p className="text-sm font-semibold text-outline leading-relaxed">
            {modalConfig.message}
          </p>
        </div>
        
        <div className="flex border-t border-outline-variant/5">
          {modalConfig.type === 'confirm' && (
            <button 
              onClick={modalConfig.onCancel}
              className="flex-1 px-4 py-5 text-[10px] font-black text-outline hover:bg-surface-container-low transition-colors uppercase tracking-[0.2em] border-r border-outline-variant/5"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={modalConfig.onConfirm}
            className="flex-1 px-4 py-5 text-[10px] font-black text-primary hover:bg-primary-fixed/30 transition-colors uppercase tracking-[0.2em]"
          >
            {modalConfig.type === 'confirm' ? 'Accept' : 'Acknowledge'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const useModal = () => useContext(ModalContext);
