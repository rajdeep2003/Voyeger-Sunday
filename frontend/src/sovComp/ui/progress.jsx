"use client"

export function Progress({ value, max = 100, className = "", showValue = false }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && <div className="text-sm text-gray-600 mt-1 text-right">{Math.round(percentage)}%</div>}
    </div>
  )
}

export function StepProgress({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isUpcoming = index > currentStep

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isCompleted
                    ? "bg-green-600 text-white"
                    : isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span className={`text-xs mt-1 ${isCurrent ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${isCompleted ? "bg-green-600" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
