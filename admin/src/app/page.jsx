'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (loading) return
    router.replace(isAuthenticated ? '/dashboard' : '/login')
  }, [loading, isAuthenticated, router])

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <p>Loading...</p>
    </main>
  )
}
