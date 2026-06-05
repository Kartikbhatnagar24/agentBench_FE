import React from 'react';
import type { DocumentAttachment } from '../../../types/chat';
import { Spinner } from '../spinners/Spinner';

interface IndexedDocsDrawerProps {
  docs: DocumentAttachment[];
  isDeletingDoc: string | null;
  onDeleteDoc: (docId: string, docName: string) => void;
}

export const IndexedDocsDrawer: React.FC<IndexedDocsDrawerProps> = ({
  docs,
  isDeletingDoc,
  onDeleteDoc,
}) => {
  return (
    <div className="docs-drawer flex-shrink-0 animate-slide-down">
      {/* Drawer header */}
      <div className="px-5 py-3 flex items-center justify-between">
        <p className="label-mono">Indexed Documents</p>
        <p className="font-mono text-[10px] text-text-tertiary">
          {docs.length} file{docs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Drawer body */}
      {docs.length === 0 ? (
        <p className="px-5 pb-4 text-xs text-text-tertiary">No documents indexed in this session.</p>
      ) : (
        <div className="px-4 pb-3 space-y-1 max-h-40 overflow-y-auto scroll-area">
          {docs.map((doc) => {
            const ext = doc.name.split('.').pop()?.toLowerCase() ?? '';
            const isDeleting = isDeletingDoc === doc.id;
            return (
              <div key={doc.id} className="doc-row flex items-center gap-2.5 px-3 py-2 rounded-lg group">
                {/* File type badge */}
                <span className={`badge flex-shrink-0 ${ext === 'pdf' ? 'badge-pdf' : 'badge-txt'}`}>
                  {ext}
                </span>

                {/* File name */}
                <span className="text-xs text-text-secondary truncate flex-grow">{doc.name}</span>

                {/* File size */}
                <span className="font-mono text-[10px] text-text-tertiary flex-shrink-0">{doc.size}</span>

                {/* Delete button */}
                <button
                  onClick={() => onDeleteDoc(doc.id, doc.name)}
                  disabled={isDeleting}
                  title="Remove from index"
                  className="flex-shrink-0 p-1 text-text-tertiary hover:text-state-danger opacity-0 group-hover:opacity-100 transition-all duration-150 disabled:opacity-40"
                >
                  {isDeleting ? (
                    <Spinner size="sm" />
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
