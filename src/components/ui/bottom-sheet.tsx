'use client'

import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsDesktop } from '@/lib/hooks/useIsDesktop'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

const mobileMotion = {
  initial: { y: '100%' as const },
  animate: { y: 0 },
  exit: { y: '100%' as const },
  transition: { type: 'spring' as const, damping: 30, stiffness: 300, mass: 0.8 },
}

const desktopMotion = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
  transition: { duration: 0.15 },
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const isDesktop = useIsDesktop()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const motionProps = isDesktop ? desktopMotion : mobileMotion

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Outer positioning wrapper — anchors the sheet/dialog */}
          <div
            className={
              isDesktop
                ? 'pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-6'
                : 'pointer-events-none fixed inset-x-0 bottom-0 z-[60]'
            }
          >
            <motion.div
              {...motionProps}
              style={{ willChange: 'transform' }}
              className={
                isDesktop
                  ? 'pointer-events-auto relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-background'
                  : 'pointer-events-auto relative w-full max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-background pb-safe'
              }
            >
              {/* Header with drag handle (mobile only) + close button */}
              <div className="sticky top-0 z-10 flex items-center justify-between bg-background px-4 pb-2 pt-4">
                <div className="w-10" />
                <div className="h-1 w-10 rounded-full bg-surface-dim lg:invisible" />
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:bg-muted active:text-foreground"
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="px-6 pb-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
