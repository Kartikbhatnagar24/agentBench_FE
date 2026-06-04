import React, { useState } from 'react';
import type { SignUpDto, SignInDto } from '../../../types/chat';
import { Spinner } from '../../../components/common/spinners/Spinner';

interface AuthCardProps {
  onLogin: (data: SignInDto) => Promise<void>;
  onSignUp: (data: SignUpDto) => Promise<void>;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onLogin, onSignUp }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleTabSwitch = (isLogin: boolean) => {
    if (isLoading) return;
    setIsLoginTab(isLogin);
    setErrorText(null);
  };

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorText(null);

    if (!email || !password) { setErrorText('Please fill in all required fields.'); return; }
    if (!validateEmail(email)) { setErrorText('Please enter a valid email address.'); return; }
    if (password.length < 6) { setErrorText('Password must be at least 6 characters.'); return; }

    setIsLoading(true);
    try {
      if (isLoginTab) {
        await onLogin({ email, password });
      } else {
        if (!firstName || !lastName) { setErrorText('First and last names are required.'); setIsLoading(false); return; }
        if (password !== confirmPassword) { setErrorText('Passwords do not match.'); setIsLoading(false); return; }
        await onSignUp({ email, password, first_name: firstName, last_name: lastName });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setErrorText(errorMsg || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const labelCls = 'block text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-1.5';

  return (
    <div className="w-full max-w-sm mx-auto animate-scale-in">

      {/* ── Logo + wordmark ── */}
      <div className="text-center mb-8">
        {/* Logo */}
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
          style={{
            background: 'linear-gradient(135deg, rgba(129,140,248,0.15) 0%, rgba(129,140,248,0.04) 100%)',
            border: '1px solid rgba(129,140,248,0.25)',
            boxShadow: '0 0 32px rgba(129,140,248,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-1.5l1.359-1.359m0 0A3.75 3.75 0 109.75 9.75v.119c0 .085.008.17.025.254l1.085 4.249z" />
          </svg>
        </div>
        <h1
          className="text-2xl font-semibold tracking-tight mb-1"
          id="auth-title"
          style={{ color: 'var(--text-primary)' }}
        >
          SleekRAG
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
          Document intelligence workspace
        </p>
      </div>

      {/* ── Card ── */}
      <div
        className="rounded-2xl p-7"
        style={{
          background: 'rgba(17,17,19,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >

        {/* Tab switcher */}
        <div
          className="flex p-1 rounded-xl mb-6"
          style={{
            background: 'rgba(9,9,11,0.8)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {[
            { label: 'Sign in', active: isLoginTab, onClick: () => handleTabSwitch(true) },
            { label: 'Create account', active: !isLoginTab, onClick: () => handleTabSwitch(false) },
          ].map(({ label, active, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              className="flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200"
              style={active ? {
                background: 'rgba(129,140,248,0.1)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(129,140,248,0.15)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              } : {
                background: 'transparent',
                color: 'var(--text-tertiary)',
                border: '1px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Error */}
        {errorText && (
          <div
            className="flex gap-2.5 px-3.5 py-3 rounded-xl mb-5 text-xs animate-slide-up"
            style={{
              background: 'rgba(248,113,113,0.06)',
              border: '1px solid rgba(248,113,113,0.2)',
              color: 'var(--danger)',
            }}
          >
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorText}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Signup-only fields */}
          {!isLoginTab && (
            <div className="grid grid-cols-2 gap-3 animate-slide-up">
              <div>
                <label className={labelCls} htmlFor="first-name">First name</label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="Jane"
                  disabled={isLoading}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input-base disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="last-name">Last name</label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Smith"
                  disabled={isLoading}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-base disabled:opacity-50"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className={labelCls} htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              placeholder="you@company.com"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base disabled:opacity-50"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls} htmlFor="password-input" style={{ marginBottom: 0 }}>Password</label>
              {isLoginTab && (
                <button
                  type="button"
                  onClick={() => alert('Password reset not yet implemented.')}
                  className="font-mono text-[10px] text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  Forgot?
                </button>
              )}
            </div>
            <input
              id="password-input"
              type="password"
              placeholder="••••••••"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base disabled:opacity-50"
              required
            />
          </div>

          {/* Confirm password */}
          {!isLoginTab && (
            <div className="animate-slide-up">
              <label className={labelCls} htmlFor="confirm-password-input">Confirm password</label>
              <input
                id="confirm-password-input"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-base disabled:opacity-50"
                required
              />
            </div>
          )}

          {/* Submit */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isLoading ? 'var(--surface-muted)' : 'var(--accent)',
              color: 'white',
              boxShadow: isLoading ? 'none' : '0 0 20px rgba(129,140,248,0.2)',
            }}
          >
            {isLoading ? (
              <><Spinner size="sm" color="white" /><span>Verifying…</span></>
            ) : (
              <span>{isLoginTab ? 'Sign in' : 'Create account'}</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] font-mono text-text-tertiary mt-6">
        Secured by end-to-end encryption
      </p>
    </div>
  );
};
