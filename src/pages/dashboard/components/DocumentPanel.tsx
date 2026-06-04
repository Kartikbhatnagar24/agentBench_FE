import React, { useState } from 'react';
import type { DocumentAttachment, ChatSession } from '../../../types/chat';
import { Spinner } from '../../../components/common/spinners/Spinner';
import { ApiService } from '../../../services/api';
import type { ToastMessage } from '../../../components/common/feedback/Toast';

interface DocumentPanelProps {
  documents: DocumentAttachment[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentAttachment[]>>;
  isDocsLoading: boolean;
  activeSession: ChatSession | null;
  onPreviewDoc: (doc: DocumentAttachment) => void;
  addToast: (text: string, type: ToastMessage['type']) => void;
  pendingUploads: File[];
  setPendingUploads: React.Dispatch<React.SetStateAction<File[]>>;
}

export const DocumentPanel: React.FC<DocumentPanelProps> = ({
  documents,
  setDocuments,
  isDocsLoading,
  activeSession,
  onPreviewDoc,
  addToast,
  pendingUploads,
  setPendingUploads,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Drag-and-drop triggers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.pdf')) {
      addToast('Unsupported file format. Only plain text (.txt) and PDF (.pdf) files are accepted.', 'error');
      return;
    }

    if (file.size > 1024 * 1024 * 2) {
      addToast('File too large. Maximum size is 2MB.', 'error');
      return;
    }

    if (!activeSession) {
      // Lazy upload mode: store in pending state instead of failing
      setPendingUploads((prev) => [...prev, file]);
      return;
    }

    setIsUploading(true);
    addToast(`Uploading and parsing "${file.name}"...`, 'info');

    try {
      const uploadedDoc = await ApiService.uploadDocument(file, activeSession.id);
      setDocuments((prev) => [...prev, uploadedDoc]);
      addToast(`"${file.name}" successfully parsed and indexed into RAG memory.`, 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      addToast(errorMsg || 'File upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileBrowse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isUploading) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
    // Reset file input value so the same file can be selected/uploaded again
    e.target.value = '';
  };

  const handleDeleteDoc = async (docId: string, docName: string) => {
    if (!activeSession) return;
    if (confirm(`Remove "${docName}" from index?`)) {
      try {
        await ApiService.deleteDocument(docId, activeSession.id);
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
        addToast(`"${docName}" removed from index memory.`, 'success');
      } catch {
        addToast('Failed to delete document.', 'error');
      }
    }
  };

  const handleDeletePendingDoc = (index: number) => {
    setPendingUploads((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="md:col-span-3 bg-dark-card border border-dark-iron rounded-2xl flex flex-col overflow-hidden shadow-xl">
      <div className="p-4 border-b border-dark-iron">
        <h2 className="text-sm font-semibold text-ice-primary">Document Index</h2>
        <p className="text-[10px] text-ice-secondary/70 mt-1">Grounding reference memory</p>
      </div>

      {/* Drag-and-drop Indexing box */}
      <div className="p-4 border-b border-dark-iron">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
            isDragOver
              ? 'border-titanium-primary bg-titanium-primary/5'
              : 'border-dark-iron hover:border-titanium-primary/30 bg-dark-deep/40'
          }`}
        >
          <input
            type="file"
            id="file-input"
            accept=".txt,.pdf"
            disabled={isUploading}
            onChange={handleFileBrowse}
            className="hidden"
          />
          <label htmlFor="file-input" className="cursor-pointer block">
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Spinner size="md" />
                <span className="text-[10px] text-ice-secondary">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 select-none">
                <svg className="w-7 h-7 text-ice-secondary/50" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <span className="text-xs font-semibold text-ice-primary hover:text-titanium-primary transition-colors block">Add Document</span>
                  <span className="text-[9px] text-ice-secondary/55 block mt-1">Drag .txt or .pdf here (Max 2MB)</span>
                </div>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Uploaded files loop */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-2">
        {isDocsLoading ? (
          <div className="space-y-2 p-2">
            <div className="h-10 skeleton-box rounded-lg"></div>
            <div className="h-10 skeleton-box rounded-lg opacity-50"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-[10px] text-ice-secondary/40">Zero referenced files.</p>
          </div>
        ) : (
          <>
            {pendingUploads.map((file, idx) => (
              <div
                key={`pending-${idx}`}
                className="group flex items-center justify-between p-3 bg-dark-deep/45 border border-dark-iron/60 border-dashed rounded-xl transition-all opacity-80"
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-grow">
                  <svg className="w-5 h-5 text-ice-secondary/70 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <div className="overflow-hidden leading-tight flex-grow">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-medium text-ice-primary truncate">
                        {file.name}
                      </p>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500/80">Pending</span>
                    </div>
                    <p className="text-[9px] text-ice-secondary/55 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePendingDoc(idx)}
                  className="p-1 text-ice-secondary/40 hover:text-roseRed rounded transition-colors"
                  title="Remove Pending Document"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            {documents.map((doc) => (
            <div
              key={doc.id}
              className="group flex items-center justify-between p-3 bg-dark-deep/45 border border-dark-iron rounded-xl hover:border-titanium-primary/20 transition-all"
            >
              <div
                className="flex items-center gap-2.5 overflow-hidden flex-grow cursor-pointer"
                onClick={() => onPreviewDoc(doc)}
              >
                <svg className="w-5 h-5 text-titanium-primary flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <div className="overflow-hidden leading-tight flex-grow">
                  <p className="text-[11px] font-medium text-ice-primary truncate group-hover:text-titanium-primary transition-colors">
                    {doc.name}
                  </p>
                  <p className="text-[9px] text-ice-secondary/55 mt-0.5">{doc.size}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteDoc(doc.id, doc.name)}
                className="p-1 text-ice-secondary/40 hover:text-roseRed rounded transition-colors"
                title="Delete Document"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          </>
        )}
      </div>
    </div>
  );
};
