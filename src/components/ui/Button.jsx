import React from 'react'
import LoadingSpinner from './LoadingSpinner'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  loadingText = null,
  icon = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-xl hover:scale-105',
    secondary: 'bg-white/80 backdrop-blur-sm border border-white/30 text-slate-700 hover:bg-white/90 hover:scale-105 focus:ring-blue-500 shadow-lg',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500 shadow-lg hover:shadow-xl hover:scale-105',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-lg hover:shadow-xl hover:scale-105',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 focus:ring-yellow-500 shadow-lg hover:shadow-xl hover:scale-105',
    ghost: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 focus:ring-slate-500',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500'
  }
  
  const sizes = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3',
    xl: 'px-8 py-4 text-xl gap-3'
  }
  
  const isDisabled = disabled || isLoading
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  const handleClick = (e) => {
    if (!isDisabled && onClick) {
      onClick(e)
    }
  }
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner 
            size={size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : 'md'} 
            color="white" 
          />
          {loadingText || 'Cargando...'}
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

// Variantes específicas para casos comunes
export const PrimaryButton = (props) => <Button variant="primary" {...props} />
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />
export const SuccessButton = (props) => <Button variant="success" {...props} />
export const DangerButton = (props) => <Button variant="danger" {...props} />
export const WarningButton = (props) => <Button variant="warning" {...props} />
export const GhostButton = (props) => <Button variant="ghost" {...props} />
export const OutlineButton = (props) => <Button variant="outline" {...props} />

export default Button