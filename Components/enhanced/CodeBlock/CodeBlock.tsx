// Components/enhanced/CodeBlock/CodeBlock.tsx
// T150 - Code block component with copy functionality
'use client'

import React, { useState } from 'react'
import { Card } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip'
import { cn } from '@/lib/utils/cn'
import styles from './codeBlock.module.css'

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Code content to display
   */
  code: string

  /**
   * Programming language for syntax highlighting
   * @default 'typescript'
   */
  language?: string

  /**
   * Show line numbers
   * @default true
   */
  showLineNumbers?: boolean

  /**
   * Enable copy to clipboard button
   * @default true
   */
  showCopyButton?: boolean

  /**
   * Title/filename to display in header
   */
  title?: string

  /**
   * Highlight specific lines (1-indexed)
   * @example [1, 3, 5]
   */
  highlightLines?: number[]

  /**
   * Maximum height before scrolling
   */
  maxHeight?: string

  /**
   * Additional CSS class for code container
   */
  codeClassName?: string

  /**
   * Theme variant
   * @default 'dark'
   */
  theme?: 'dark' | 'light'
}

/**
 * CodeBlock - Syntax-highlighted code block with copy functionality
 *
 * Features:
 * - Clean code presentation
 * - Copy to clipboard
 * - Optional line numbers
 * - Line highlighting
 * - Filename/title header
 * - Dark/light theme
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code={`const hello = 'world';`}
 *   language="typescript"
 *   title="example.ts"
 *   highlightLines={[1]}
 * />
 * ```
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  showLineNumbers = true,
  showCopyButton = true,
  title,
  highlightLines = [],
  maxHeight,
  codeClassName,
  theme = 'dark',
  className,
  ...props
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const lines = code.split('\n')

  return (
    <Card
      className={cn(
        styles.codeBlock,
        styles[theme],
        className
      )}
      {...props}
    >
      {/* Header */}
      {(title || showCopyButton) && (
        <div className={styles.header}>
          {title && (
            <div className={styles.title}>
              <span className={styles.icon}>📄</span>
              <span className={styles.filename}>{title}</span>
              {language && (
                <span className={styles.language}>{language}</span>
              )}
            </div>
          )}
          {showCopyButton && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className={styles.copyButton}
                  aria-label="Copy code to clipboard"
                >
                  {copied ? (
                    <svg
                      className={styles.icon}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      className={styles.icon}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  <span className={styles.copyText}>
                    {copied ? 'Copied' : 'Copy'}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {copied ? 'Copied!' : 'Copy code'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      {/* Code content */}
      <div
        className={cn(styles.codeWrapper, codeClassName)}
        style={{ maxHeight }}
      >
        <pre className={styles.pre}>
          <code className={cn(styles.code, `language-${language}`)}>
            {lines.map((line, index) => {
              const lineNumber = index + 1
              const isHighlighted = highlightLines.includes(lineNumber)

              return (
                <div
                  key={index}
                  className={cn(
                    styles.line,
                    isHighlighted && styles.highlighted
                  )}
                >
                  {showLineNumbers && (
                    <span className={styles.lineNumber} aria-hidden="true">
                      {lineNumber}
                    </span>
                  )}
                  <span className={styles.lineContent}>
                    {line || '\n'}
                  </span>
                </div>
              )
            })}
          </code>
        </pre>
      </div>
    </Card>
  )
}

CodeBlock.displayName = 'CodeBlock'
