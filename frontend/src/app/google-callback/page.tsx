'use client';

import { useEffect, useState } from 'react';
import { authApi } from '@/lib/api';

/**
 * Google OAuth callback page. Google redirects here with id_token in the URL hash.
 * We read the token, exchange it with our backend, store session, then redirect home.
 */
export default function GoogleCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');
  const [message, setMessage] = useState('Signing you in…');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Google returns id_token in the hash fragment (e.g. #id_token=xxx&...)
    const hash = window.location.hash || '';
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    const idToken = params.get('id_token') || params.get('idtoken');

    if (!idToken) {
      setMessage('No login token received. Redirecting…');
      setStatus('done');
      setTimeout(() => (window.location.href = '/'), 1500);
      return;
    }

    let cancelled = false;

    async function exchangeToken() {
      try {
        const res = await authApi.google(idToken);
        const payload = res?.data;
        if (cancelled) return;
        if (!payload?.success || !payload?.data) {
          setMessage('Login failed. Redirecting…');
          setStatus('error');
          setTimeout(() => (window.location.href = '/'), 2000);
          return;
        }
        const { token: jwt, user } = payload.data;
        const userId = (user as { _id?: string; id?: string })?._id ?? (user as { id?: string })?.id;
        localStorage.setItem('rdg_token', jwt);
        localStorage.setItem(
          'rdg_user',
          JSON.stringify({
            id: userId,
            name: (user as { name?: string }).name,
            email: (user as { email?: string }).email,
          })
        );
        setStatus('done');
        setMessage('Success! Redirecting…');
        window.location.href = '/';
      } catch (err) {
        if (cancelled) return;
        setMessage('Sign-in failed. Redirecting…');
        setStatus('error');
        setTimeout(() => (window.location.href = '/'), 2000);
      }
    }

    exchangeToken();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#E6B65C]/30 border-t-[#5F6B3C] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#6B4A1E] font-medium">{message}</p>
      </div>
    </div>
  );
}
