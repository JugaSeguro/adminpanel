import React from 'react'
import { Loader2 } from 'lucide-react'
import useAppStore from '../../store/useStore'

const LoadingOverlay = () => {
  const { loadingMessage } = useAppStore()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-700 text-center font-medium">
            {loadingMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay
