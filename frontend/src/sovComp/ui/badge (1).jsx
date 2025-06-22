"use client"

import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react"

const alertTypes = {
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800",
  },
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800",
  },
  warning: {
    icon: AlertCircle,
    className: "bg-yellow-50 border-yellow-200 text-yellow-800",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800",
  },
}

export function Alert({ type = "info", title, children, dismissible = false, onDismiss }) {
  const { icon: Icon, className } = alertTypes[type]

  return (
    <div className={`p-4 rounded-lg border ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <button onClick={onDismiss} className="p-1 hover:bg-black/10 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
