'use client'

import { useEffect, useState } from 'react'

type Notification = {
  id: number
  type: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

const POLL_INTERVAL_MS = 30_000

export const NotificationsHeader = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const res = await fetch('/api/notifications')
      if (!res.ok || cancelled) return
      const data = await res.json()
      if (cancelled) return
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    }

    void load()
    const interval = setInterval(() => void load(), POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const markRead = async (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
  }

  return (
    <div style={{ position: 'relative', marginRight: '1rem' }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          fontSize: '1.1rem',
        }}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: '#d0021b',
              color: '#fff',
              borderRadius: '999px',
              fontSize: '0.65rem',
              lineHeight: 1,
              padding: '2px 5px',
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            background: 'var(--theme-elevation-0, #fff)',
            border: '1px solid var(--theme-elevation-150, #ccc)',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 100,
          }}
        >
          {notifications.length === 0 && (
            <div style={{ padding: '1rem', fontSize: '0.85rem' }}>No notifications.</div>
          )}
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => !n.read && markRead(n.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                border: 'none',
                borderBottom: '1px solid var(--theme-elevation-100, #eee)',
                background: n.read ? 'transparent' : 'var(--theme-elevation-50, #f5f5f5)',
                cursor: n.read ? 'default' : 'pointer',
              }}
            >
              <div style={{ fontWeight: n.read ? 400 : 600, fontSize: '0.85rem' }}>{n.title}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.75 }}>{n.message}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
