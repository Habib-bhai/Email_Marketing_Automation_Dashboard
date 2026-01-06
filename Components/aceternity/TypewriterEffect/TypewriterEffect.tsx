// Components/aceternity/TypewriterEffect/TypewriterEffect.tsx
'use client'

import React, { useState, useEffect } from 'react'

/**
 * T138 - Typewriter Effect component from Aceternity UI
 * Animated typing effect for text
 *
 * TODO: Install from ui.aceternity.com/components/typewriter-effect
 * This is a placeholder - replace with actual component from Aceternity
 */

export interface TypewriterEffectProps {
  words: Array<{
    text: string
    className?: string
  }>
  className?: string
  cursorClassName?: string
}

export function TypewriterEffect({
  words,
  className = '',
  cursorClassName = ''
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[currentWordIndex]?.text || ''

    const timeout = setTimeout(() => {
      if (!isDeleting && currentText.length < currentWord.length) {
        setCurrentText(currentWord.slice(0, currentText.length + 1))
      } else if (isDeleting && currentText.length > 0) {
        setCurrentText(currentText.slice(0, -1))
      } else if (!isDeleting && currentText.length === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 2000)
      } else if (isDeleting && currentText.length === 0) {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentWordIndex, words])

  return (
    <span className={className} data-testid="typewriter">
      {currentText}
      <span className={`animate-blink ${cursorClassName}`}>|</span>
    </span>
  )
}
