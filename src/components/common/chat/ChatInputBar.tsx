import React from 'react';
import { Spinner } from '../spinners/Spinner';

interface ChatInputBarProps {
  chatMessage: string;
  attachedFiles: File[];
  isUploading: boolean;
  isSending: boolean;
  canSubmit: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onMessageChange: (value: string) => void;
  onFileAttach: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (idx: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  chatMessage,
  attachedFiles,
  isUploading,
  isSending,
  canSubmit,
  fileInputRef,
  onMessageChange,
  onFileAttach,
  onRemoveFile,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="input-form flex-shrink-0 p-4">

      {/* ── File chips tray ── */}
      {attachedFiles.length > 0 && (
        <div className="file-chips-tray flex flex-wrap gap-1.5 mb-3 p-2 rounded-xl animate-slide-up">
          {attachedFiles.map((file, idx) => {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            return (
              <div key={idx} className="file-chip flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg">
                <span className={`badge flex-shrink-0 ${ext === 'pdf' ? 'badge-pdf' : 'badge-txt'}`}>
                  {ext}
                </span>
                <span className="text-[11px] text-text-secondary max-w-[120px] truncate">{file.name}</span>
                <span className="font-mono text-[9px] text-text-tertiary">
                  {(file.size / 1024).toFixed(0)}KB
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveFile(idx)}
                  className="text-text-tertiary hover:text-state-danger transition-colors ml-0.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
          <span className="self-center font-mono text-[10px] text-text-tertiary ml-1">
            {attachedFiles.length} queued
          </span>
        </div>
      )}

      {/* ── Upload progress ── */}
      {isUploading && (
        <div className="flex items-center gap-2 mb-3 text-xs text-text-tertiary animate-fade-in">
          <Spinner size="sm" />
          <span>Indexing into RAG memory…</span>
        </div>
      )}

      {/* ── Input row ── */}
      <div className="input-row flex gap-2 items-center p-1.5 rounded-xl">
        {/* Hidden file picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf"
          multiple
          className="hidden"
          onChange={onFileAttach}
        />

        {/* Attach button */}
        <button
          type="button"
          id="attach-file-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending || isUploading}
          title="Attach .txt or .pdf (max 2 MB)"
          className={`btn-attach p-2 flex-shrink-0 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed ${
            attachedFiles.length > 0 ? 'has-files' : ''
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
          </svg>
        </button>

        {/* Text input */}
        <input
          id="chat-message-input"
          type="text"
          placeholder={
            attachedFiles.length > 0
              ? 'Add a message, or send to index…'
              : 'Ask something about your documents…'
          }
          value={chatMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          disabled={isSending || isUploading}
          className="flex-grow bg-transparent outline-none border-none text-sm text-text-primary placeholder:text-text-tertiary disabled:opacity-50 py-1.5 px-1"
        />

        {/* Send button */}
        <button
          id="send-message-btn"
          type="submit"
          disabled={!canSubmit}
          className={`btn-send p-2 flex-shrink-0 rounded-lg disabled:cursor-not-allowed ${
            canSubmit ? 'can-submit' : ''
          }`}
        >
          {isUploading ? (
            <Spinner size="sm" color="white" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};
