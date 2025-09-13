import React from 'react'

const SkeletonLoader = ({ 
  variant = 'default',
  className = '',
  count = 1,
  height = 'h-4',
  width = 'w-full'
}) => {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded'
  
  const variants = {
    default: `${height} ${width}`,
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    button: 'h-10 w-24',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-32 w-full rounded-lg',
    image: 'h-48 w-full rounded-lg'
  }

  const skeletonClass = `${baseClasses} ${variants[variant]} ${className}`

  if (count === 1) {
    return <div className={skeletonClass}></div>
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass}></div>
      ))}
    </div>
  )
}

// Skeleton para tarjetas de sitios
export const SiteCardSkeleton = () => (
  <div className="sites-card p-4 md:p-6 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <SkeletonLoader variant="avatar" className="w-8 h-8" />
        <div className="space-y-2">
          <SkeletonLoader variant="title" className="w-32" />
          <SkeletonLoader variant="text" className="w-24" />
        </div>
      </div>
      <SkeletonLoader variant="button" className="w-16 h-6" />
    </div>
    
    <div className="space-y-3">
      <div className="flex justify-between">
        <SkeletonLoader variant="text" className="w-20" />
        <SkeletonLoader variant="text" className="w-16" />
      </div>
      <div className="flex justify-between">
        <SkeletonLoader variant="text" className="w-24" />
        <SkeletonLoader variant="text" className="w-20" />
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-gray-200">
      <SkeletonLoader variant="button" className="w-full h-10" />
    </div>
  </div>
)

// Skeleton para formularios
export const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <SkeletonLoader variant="text" className="w-24 h-4" />
      <SkeletonLoader variant="default" className="w-full h-10" />
    </div>
    <div className="space-y-2">
      <SkeletonLoader variant="text" className="w-32 h-4" />
      <SkeletonLoader variant="default" className="w-full h-10" />
    </div>
    <div className="space-y-2">
      <SkeletonLoader variant="text" className="w-28 h-4" />
      <SkeletonLoader variant="default" className="w-full h-24" />
    </div>
    <SkeletonLoader variant="button" className="w-32 h-10" />
  </div>
)

// Skeleton para estadísticas
export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonLoader variant="text" className="w-16 h-4" />
            <SkeletonLoader variant="title" className="w-12 h-8" />
          </div>
          <SkeletonLoader variant="avatar" className="w-12 h-12" />
        </div>
      </div>
    ))}
  </div>
)

export default SkeletonLoader