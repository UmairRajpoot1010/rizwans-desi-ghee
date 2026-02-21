'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '@/app/context/app-context';
import { authApi } from '@/lib/api';

type Mode = 'login' | 'signup';

type Props = {
  open: boolean;
  mode: Mode;
  onClose: () => void;
  onModeChange: (mode: Mode) => void;
};

function getFocusableElements(root: HTMLElement | null) {
  if (!root) return [];
  const nodes = root.querySelectorAll<HTMLElement>(
    [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')
  );
  return Array.from(nodes).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

export function AuthPanel({ open, mode, onClose, onModeChange }: Props) {
  const { login, signup } = useApp();

  const panelRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup fields
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const title = mode === 'login' ? 'LOGIN' : 'SIGN UP';

  const resetErrors = () => setFormError(null);

  const closeAndRestoreFocus = () => {
    onClose();
    // Restore focus to the previously focused element (accessibility).
    window.setTimeout(() => lastActiveElementRef.current?.focus(), 0);
  };

  // Capture last focused element and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Autofocus email when panel opens.
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => emailRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open, mode]);

  // Focus trap + ESC close.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeAndRestoreFocus();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusables = getFocusableElements(panelRef.current);
      if (focusables.length === 0) return;

      const active = document.activeElement as HTMLElement | null;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (!active) return;

      // If focus is outside the panel, bring it back in.
      if (!panelRef.current?.contains(active)) {
        first.focus();
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        if (active === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (active === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Clear error when switching modes
  useEffect(() => {
    resetErrors();
  }, [mode]);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (mode === 'login') return !!email.trim() && !!password;
    return !!name.trim() && !!email.trim() && !!password && !!confirmPassword;
  }, [confirmPassword, email, loading, mode, name, password]);

  const validate = (): string | null => {
    if (!email.trim()) return 'Email is required.';
    if (!password) return 'Password is required.';
    if (mode === 'signup') {
      if (!name.trim()) return 'Name is required.';
      if (!confirmPassword) return 'Confirm password is required.';
      if (password !== confirmPassword) return 'Passwords do not match.';
    }
    return null;
  };

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    resetErrors();
    const validation = validate();
    if (validation) {
      setFormError(validation);
      return;
    }

    setLoading(true);
    try {
      const res =
        mode === 'login'
          ? await login(email.trim(), password)
          : await signup(name.trim(), email.trim(), password);

      if (!res.ok) {
        setFormError('Authentication failed. Please try again.');
        return;
      }

      // Success: close panel and keep user logged in via AppContext/session.
      closeAndRestoreFocus();
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      setFormError('Google sign-in is not configured')
      return
    }
    const redirectUri = `${window.location.origin}/google-callback`
    const nonce = Math.random().toString(36).slice(2)
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=${encodeURIComponent(
      'openid email profile'
    )}&nonce=${nonce}&prompt=select_account`
    window.open(url, '_self')
  }

  return (
    <div
      className={[
        'fixed inset-0 z-[60]',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      ].join(' ')}
      aria-hidden={!open}
    >
      {/* Overlay (click outside closes) */}
      <button
        type="button"
        aria-label="Close authentication panel"
        onClick={closeAndRestoreFocus}
        className={[
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        tabIndex={open ? 0 : -1}
      />

      {/* Panel */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          'auth-panel absolute right-0 top-0 h-full w-[420px] max-w-[92vw] bg-white shadow-2xl',
          'transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
            <div className="text-lg font-semibold tracking-wide text-neutral-900">
              {title}
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={closeAndRestoreFocus}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="flex-1 overflow-auto px-6 py-6">
            <div className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-900">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-300"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-900">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  ref={emailRef}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-300"
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-300"
                  placeholder="Enter password"
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-900">
                    Confirm Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-300"
                    placeholder="Confirm password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="auth-secondary-link text-sm font-medium"
                    onClick={() => setFormError('Password reset is not implemented yet.')}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className={[
                  'auth-primary-button mt-2 w-full px-5 py-3 text-sm font-semibold',
                  !canSubmit ? '' : '',
                ].join(' ')}
              >
                {mode === 'login' ? (loading ? 'Signing In…' : 'Sign In') : loading ? 'Creating…' : 'Create Account'}
              </button>

              {mode === 'login' && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={onGoogleSignIn}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm bg-white"
                  >
                    <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-white text-sm font-bold">G</span>
                    Continue with Google
                  </button>
                </div>
              )}

              <div className="pt-4 text-center text-sm text-neutral-700">
                {mode === 'login' ? (
                  <>
                    New customer?{' '}
                    <button
                      type="button"
                      className="auth-primary-link font-semibold"
                      onClick={() => onModeChange('signup')}
                    >
                      Create your account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="auth-primary-link font-semibold"
                      onClick={() => onModeChange('login')}
                    >
                      Login
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
}

