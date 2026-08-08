"use client"

import { create } from "zustand"
import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Info, AlertTriangle } from "lucide-react"

interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, { ...toast, id: Math.random().toString(36).slice(2) }] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function toast(message: string, type: Toast["type"] = "info") {
  useToastStore.getState().addToast({ message, type, duration: 3000 })
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()
  useEffect(() => {
    toasts.forEach((t) => { if (t.duration) setTimeout(() => removeToast(t.id), t.duration) })
  }, [toasts, removeToast])
  const icons = {
    success: <Check size={16} className="text-green-400" aria-hidden="true" />,
    error: <X size={16} className="text-red-400" aria-hidden="true" />,
    info: <Info size={16} className="text-blue-400" aria-hidden="true" />,
    warning: <AlertTriangle size={16} className="text-yellow-400" aria-hidden="true" />,
  }
  return (
    <div className="fixed right-4 top-4 z-[200] flex flex-col gap-2" role="status" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-surface/95 px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            {icons[t.type]}
            <span className="text-sm text-white/90">{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="ml-1 text-white/40 hover:text-white" aria-label="Dismiss notification"><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
