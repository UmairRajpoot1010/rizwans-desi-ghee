import { useEffect } from 'react'
import { useApp } from '@/app/context/app-context'
import { authApi } from '@/lib/api'

export default function GoogleCallbackPage() {
  const { setCurrentPage } = useApp() as any

  useEffect(() => {
    const hash = window.location.hash || window.location.search
    // try both fragment and query
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
    const idToken = params.get('id_token') || params.get('idtoken')
    if (!idToken) {
      // try extracting from location.search
      const q = new URLSearchParams(window.location.search)
      const t = q.get('id_token') || q.get('idtoken')
      if (t) {
        handleToken(t)
        return
      }
      // nothing
      setCurrentPage('home')
      return
    }

    async function handleToken(token) {
      try {
        const res = await authApi.google(token)
        const payload = res.data
        if (payload?.success && payload?.data) {
          const { token: jwt, user } = payload.data
          localStorage.setItem('rdg_token', jwt)
          localStorage.setItem('rdg_user', JSON.stringify({ id: user.id, name: user.name, email: user.email }))
          setCurrentPage('home')
          window.location.href = '/'
        } else {
          setCurrentPage('home')
        }
      } catch (_) {
        setCurrentPage('home')
      }
    }

    handleToken(idToken)
  }, [setCurrentPage])

  return <div className="py-20 text-center">Signing you in…</div>
}
