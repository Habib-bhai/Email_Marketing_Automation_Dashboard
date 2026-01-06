'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-gray-900 border-l border-gray-800 animate-slide-in-right p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav className="mt-16 flex flex-col gap-6">
          <a
            href="#features"
            className="text-xl text-gray-300 hover:text-white transition-colors"
            onClick={onClose}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-xl text-gray-300 hover:text-white transition-colors"
            onClick={onClose}
          >
            How It Works
          </a>
          <a
            href="#testimonials"
            className="text-xl text-gray-300 hover:text-white transition-colors"
            onClick={onClose}
          >
            Testimonials
          </a>
          <a
            href="#integrations"
            className="text-xl text-gray-300 hover:text-white transition-colors"
            onClick={onClose}
          >
            Integrations
          </a>
          <a
            href="/dashboard"
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg text-center"
            onClick={onClose}
          >
            View Dashboard
          </a>
        </nav>
      </div>
    </div>
  )
}
