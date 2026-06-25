'use client'

import { useSyncExternalStore } from 'react'

const DESKTOP_QUERY = '(min-width: 1024px)'

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(DESKTOP_QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSnapshot(): boolean {
  return window.matchMedia(DESKTOP_QUERY).matches
}

function getServerSnapshot(): boolean {
  return false
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
