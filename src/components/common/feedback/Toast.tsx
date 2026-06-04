import React, { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3800);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      border: 'rgba(74,222,128,0.2)',
      icon: 'var(--success)',
      bg: 'rgba(74,222,128,0.05)',
    },
    error: {
      border: 'rgba(248,113,113,0.2)',
      icon: 'var(--danger)',
      bg: 'rgba(248,113,113,0.05)',
    },
    info: {
      border: 'rgba(129,140,248,0.2)',
      icon: 'var(--accent)',
      bg: 'rgba(129,140,248,0.04)',
    },
  }[toast.type];

  return (
    <div
      className="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl text-text-primary transition-all duration-300"
      style={{
        background: `rgba(17,17,19,0.95)`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${config.border}`,
        boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)`,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.97)',
        opacity: visible ? 1 : 0,
      }}
      role="alert"
    >
      {/* Icon */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: config.bg, border: `1px solid ${config.border}` }}
      >
        {toast.type === 'success' && (
          <svg className="w-3.5 h-3.5" style={{ color: config.icon }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
        {toast.type === 'error' && (
          <svg className="w-3.5 h-3.5" style={{ color: config.icon }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {toast.type === 'info' && (
          <svg className="w-3.5 h-3.5" style={{ color: config.icon }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      <p className="text-sm flex-grow leading-relaxed" style={{ color: 'var(--text-primary)' }}>
        {toast.text}
      </p>

      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded-md transition-colors duration-150 mt-0.5"
        style={{ color: 'var(--text-tertiary)' }}
        aria-label="Close notification"
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
