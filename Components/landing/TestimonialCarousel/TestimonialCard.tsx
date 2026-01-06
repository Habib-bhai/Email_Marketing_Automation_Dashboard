'use client'

import React from 'react'
import { OptimizedImage } from '@/Components/ui/OptimizedImage'
import { cn } from '@/lib/utils/cn'

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  company: string
  avatar?: string
  rating?: number
  className?: string
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  company,
  avatar,
  rating = 5,
  className
}) => {
  return (
    <div
      className={cn(
        'relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 hover:border-gray-600 hover:shadow-2xl hover:shadow-purple-500/10',
        className
      )}
    >
      {/* Quote icon */}
      <div className="absolute top-6 right-6 text-purple-500/20">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-200 text-lg leading-relaxed mb-6">
        "{quote}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {avatar ? (
            <OptimizedImage
              src={avatar}
              alt={`${author} profile picture`}
              width={48}
              height={48}
              rounded="full"
              border="border-2 border-purple-500/30"
              className="object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              {author.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <div className="font-semibold text-white">{author}</div>
          <div className="text-sm text-gray-400">{role} at {company}</div>
        </div>
      </div>
    </div>
  )
}
