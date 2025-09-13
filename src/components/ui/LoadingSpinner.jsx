import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'blue', 
  text = null, 
  className = '',
  variant = 'default'
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    white: 'text-white',
    gray: 'text-gray-500'
  }

  const variants = {
    default: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce'
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        {text && <span className="ml-2 text-sm font-medium text-gray-600">{text}</span>}
      </div>
    )
  }

  if (variant === 'bars') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <div className={`w-1 ${sizeClasses[size].split(' ')[1]} ${colorClasses[color]} animate-pulse`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-1 ${sizeClasses[size].split(' ')[1]} ${colorClasses[color]} animate-pulse`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-1 ${sizeClasses[size].split(' ')[1]} ${colorClasses[color]} animate-pulse`} style={{ animationDelay: '300ms' }}></div>
        <div className={`w-1 ${sizeClasses[size].split(' ')[1]} ${colorClasses[color]} animate-pulse`} style={{ animationDelay: '450ms' }}></div>
        {text && <span className="ml-2 text-sm font-medium text-gray-600">{text}</span>}
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} ${variants[variant]}`} />
      {text && <span className="ml-2 text-sm font-medium text-gray-600">{text}</span>}
    </div>
  )
}

export default LoadingSpinner