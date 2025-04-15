import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
  showDismiss?: boolean
}

export default function ErrorMessage({ message, onDismiss, showDismiss = true }: ErrorMessageProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) onDismiss()
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-red-800">Error</p>
            {showDismiss && (
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100 inline-flex h-6 w-6 items-center justify-center"
                onClick={handleDismiss}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
      </div>
    </div>
  )
} 