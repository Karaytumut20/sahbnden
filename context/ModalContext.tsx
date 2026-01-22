"use client";
import React, { createContext, useContext, useState } from 'react';

// 'QUICK_VIEW' eklendi
type ModalType = 'SHARE' | 'REPORT' | 'OFFER' | 'QUICK_VIEW' | null;
type ModalProps = Record<string, any>;

type ModalContextType = {
  activeModal: ModalType;
  modalProps: ModalProps;
  openModal: (type: ModalType, props?: ModalProps) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<ModalProps>({});

  const openModal = (type: ModalType, props: ModalProps = {}) => {
    setActiveModal(type);
    setModalProps(props);
    // Scrollu kilitle (UX İyileştirmesi)
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalProps({});
    document.body.style.overflow = 'auto';
  };

  return (
    <ModalContext.Provider value={{ activeModal, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within an ModalProvider');
  }
  return context;
}