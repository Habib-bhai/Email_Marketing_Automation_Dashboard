// Components/aceternity/Timeline/Timeline.tsx
'use client'
import React from 'react'

/** T139 - Timeline component placeholder from Aceternity UI */
export interface TimelineProps {
  data: Array<{ title: string; content: React.ReactNode }>
  className?: string
}

export function Timeline({ data, className = '' }: TimelineProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {data.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm">
            {index + 1}
          </div>
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <div className="mt-2">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
