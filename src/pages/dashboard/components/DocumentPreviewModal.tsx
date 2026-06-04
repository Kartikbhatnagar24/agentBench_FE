import React from 'react';
import type { DocumentAttachment } from '../../../types/chat';

interface DocumentPreviewModalProps {
  doc: DocumentAttachment;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ doc, onClose }) => {
  return (
    <div className="fixed inset-0 z-40 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-card border border-dark-iron rounded-2xl w-full max-w-2xl p-6 shadow-2xl flex flex-col max-h-[85vh] animate-slide-up">
        <div className="flex items-center justify-between border-b border-dark-iron pb-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-ice-primary leading-none">{doc.name}</h3>
            <p className="text-[10px] text-ice-secondary/70 mt-1">Indexed size: {doc.size}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ice-secondary hover:text-ice-primary rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar bg-dark-deep/60 p-4 border border-dark-iron/50 rounded-xl">
          <pre className="text-xs text-ice-secondary font-mono whitespace-pre-wrap leading-relaxed">
            {doc.content}
          </pre>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-dark-input border border-dark-iron hover:border-titanium-primary/30 text-xs font-semibold text-ice-primary rounded-lg transition-all"
          >
            Dismiss Reader
          </button>
        </div>
      </div>
    </div>
  );
};
