"use client"

import { useState, useEffect } from "react"
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react"

const toastTypes = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800",
  },
  warning: {
    icon: AlertCircle,
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800",
  },
}

export function Toast({ type = "info", message, isVisible, onClose, duration = 5000 }) {
  const { icon: Icon, className } = toastTypes[type]

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg flex items-center gap-3 min-w-80 ${className}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState({ isVisible: false, type: "info", message: "" })

  const showToast = (type, message, duration = 5000) => {
    setToast({ isVisible: true, type, message, duration })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  return {
    toast,
    showToast,
    hideToast,
    ToastComponent: () => (
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
    ),
  }
}
