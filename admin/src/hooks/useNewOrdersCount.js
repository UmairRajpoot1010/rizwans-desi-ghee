'use client'

import { useState, useEffect, useRef } from 'react'
import { adminApi } from '@/lib/api'

const POLL_INTERVAL_MS = 20000 // Poll every 20 seconds

/**
 * Polls for pending orders count and detects when new orders are placed.
 * @returns {{ pendingCount: number, showNewOrderToast: boolean, dismissToast: () => void }}
 */
export function useNewOrdersCount() {
  const [pendingCount, setPendingCount] = useState(0)
  const [showNewOrderToast, setShowNewOrderToast] = useState(false)
  const previousCountRef = useRef(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    const fetchPendingCount = async () => {
      try {
        const res = await adminApi.getOrders({
          status: 'pending',
          limit: 1,
          page: 1,
        })
        const meta = res?.data?.meta
        const total = meta?.total ?? 0

        if (!isMountedRef.current) return

        const prev = previousCountRef.current
        previousCountRef.current = total
        setPendingCount(total)

        // Show toast when new orders appear (not on first load)
        if (prev !== null && total > prev) {
          setShowNewOrderToast(true)
          // Auto-dismiss after 6 seconds
          setTimeout(() => setShowNewOrderToast(false), 6000)
        }
      } catch {
        // Ignore errors (e.g. auth, network)
      }
    }

    fetchPendingCount()
    const interval = setInterval(fetchPendingCount, POLL_INTERVAL_MS)
    return () => {
      isMountedRef.current = false
      clearInterval(interval)
    }
  }, [])

  const dismissToast = () => setShowNewOrderToast(false)

  return { pendingCount, showNewOrderToast, dismissToast }
}
