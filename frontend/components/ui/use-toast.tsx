"use client"
import * as React from "react"

type Toast = {
  title: string
  description?: string
  duration?: number
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback(({ title, description, duration = 4000, variant }: Toast) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { title, description, duration, variant }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== t))
    }, duration)
  }, [])

  const ToastContainer = (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {toasts.map((t, i) => (
        <div
          key={i}
          className={`px-4 py-2 rounded shadow-md ${
            t.variant === "destructive" ? "bg-red-600 text-white" : "bg-gray-800 text-white"
          }`}
        >
          <div className="font-bold">{t.title}</div>
          {t.description && <div className="text-sm">{t.description}</div>}
        </div>
      ))}
    </div>
  )

  return { toast, ToastContainer }
}
