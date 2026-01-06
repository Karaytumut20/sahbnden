
"use client";
import React from 'react';
import { useModal } from '@/context/ModalContext';
import ShareModal from './modals/ShareModal';
import ReportModal from './modals/ReportModal';
import OfferModal from './modals/OfferModal'; // YENİ

export default function ModalRoot() {
  const { activeModal } = useModal();

  if (!activeModal) return null;

  return (
    <>
      {activeModal === 'SHARE' && <ShareModal />}
      {activeModal === 'REPORT' && <ReportModal />}
      {activeModal === 'OFFER' && <OfferModal />}
    </>
  );
}
