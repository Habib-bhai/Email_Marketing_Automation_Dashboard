'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { CodeBlock } from '@/Components/enhanced/CodeBlock'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'

interface IntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  integration: {
    name: string
    description: string
    icon: React.ReactNode
    features: string[]
    codeExample: string
  }
  className?: string
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  integration,
  className
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus trap for keyboard accessibility
  useFocusTrap(modalRef, isOpen, {
    initialFocus: true,
    returnFocus: true,
  })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className={cn(
          'relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl animate-scale-in',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all z-10"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              {integration.icon}
            </div>
            <div className="flex-1">
              <h2 id="modal-title" className="text-3xl font-bold text-white mb-3">{integration.name}</h2>
              <p id="modal-description" className="text-lg text-gray-300">{integration.description}</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {integration.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Integration Example</h3>
            <CodeBlock language="json" code={integration.codeExample} className="rounded-xl" />
          </div>

          {/* CTA */}
          <div className="mt-8 flex gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all">
              Get Started
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-700 transition-all">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
