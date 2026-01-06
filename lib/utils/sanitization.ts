/**
 * Input Sanitization and Validation Utilities
 * 
 * Provides comprehensive input sanitization to prevent XSS, SQL injection,
 * and other security vulnerabilities. All user inputs should be sanitized
 * before processing or storing.
 * 
 * @module lib/utils/sanitization
 */

import DOMPurify from 'isomorphic-dompurify'
import validator from 'validator'

/**
 * Sanitization options
 */
export interface SanitizeOptions {
  /**
   * Allow HTML tags (use with caution)
   * @default false
   */
  allowHtml?: boolean
  
  /**
   * Allowed HTML tags (only if allowHtml is true)
   * @default ['p', 'br', 'strong', 'em', 'u', 'a']
   */
  allowedTags?: string[]
  
  /**
   * Maximum string length
   * @default undefined (no limit)
   */
  maxLength?: number
  
  /**
   * Trim whitespace
   * @default true
   */
  trim?: boolean
  
  /**
   * Convert to lowercase
   * @default false
   */
  toLowerCase?: boolean
  
  /**
   * Remove non-alphanumeric characters
   * @default false
   */
  alphanumericOnly?: boolean
}

/**
 * Default sanitization options
 */
const defaultOptions: Required<SanitizeOptions> = {
  allowHtml: false,
  allowedTags: ['p', 'br', 'strong', 'em', 'u', 'a'],
  maxLength: 10000,
  trim: true,
  toLowerCase: false,
  alphanumericOnly: false,
}

/**
 * Sanitize a string input
 * Removes potentially dangerous characters and HTML
 * 
 * @param input - Raw user input
 * @param options - Sanitization options
 * @returns Sanitized string
 * 
 * @example
 * ```typescript
 * const name = sanitizeString('<script>alert("xss")</script>John Doe')
 * // Returns: 'John Doe'
 * 
 * const bio = sanitizeString('<p>Hello <strong>world</strong></p>', { allowHtml: true })
 * // Returns: '<p>Hello <strong>world</strong></p>'
 * ```
 */
export function sanitizeString(
  input: string | null | undefined,
  options?: SanitizeOptions
): string {
  if (!input || typeof input !== 'string') return ''
  
  const opts = { ...defaultOptions, ...options }
  let sanitized = input
  
  // Trim whitespace
  if (opts.trim) {
    sanitized = sanitized.trim()
  }
  
  // Remove or allow HTML
  if (opts.allowHtml) {
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: opts.allowedTags,
      ALLOWED_ATTR: ['href', 'title', 'target'],
      ALLOW_DATA_ATTR: false,
    })
  } else {
    // Strip all HTML tags
    sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [] })
  }
  
  // Convert to lowercase
  if (opts.toLowerCase) {
    sanitized = sanitized.toLowerCase()
  }
  
  // Remove non-alphanumeric (except spaces)
  if (opts.alphanumericOnly) {
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s]/g, '')
  }
  
  // Enforce max length
  if (opts.maxLength && sanitized.length > opts.maxLength) {
    sanitized = sanitized.substring(0, opts.maxLength)
  }
  
  return sanitized
}

/**
 * Sanitize an email address
 * Validates and normalizes email format
 * 
 * @param email - Raw email input
 * @returns Sanitized email or empty string if invalid
 * 
 * @example
 * ```typescript
 * const email = sanitizeEmail('  JOHN@EXAMPLE.COM  ')
 * // Returns: 'john@example.com'
 * 
 * const invalid = sanitizeEmail('not-an-email')
 * // Returns: ''
 * ```
 */
export function sanitizeEmail(email: string | null | undefined): string {
  if (!email || typeof email !== 'string') return ''
  
  const trimmed = email.trim().toLowerCase()
  
  // Validate email format
  if (!validator.isEmail(trimmed)) return ''
  
  // Normalize email (lowercase, remove dots in Gmail)
  return validator.normalizeEmail(trimmed) || trimmed
}

/**
 * Sanitize a URL
 * Validates and ensures URL is safe (http/https only)
 * 
 * @param url - Raw URL input
 * @param allowedProtocols - Allowed protocols (default: http, https)
 * @returns Sanitized URL or empty string if invalid
 * 
 * @example
 * ```typescript
 * const url = sanitizeUrl('https://example.com')
 * // Returns: 'https://example.com'
 * 
 * const dangerous = sanitizeUrl('javascript:alert("xss")')
 * // Returns: ''
 * ```
 */
export function sanitizeUrl(
  url: string | null | undefined,
  allowedProtocols: string[] = ['http', 'https']
): string {
  if (!url || typeof url !== 'string') return ''
  
  const trimmed = url.trim()
  
  // Validate URL format
  if (!validator.isURL(trimmed, { protocols: allowedProtocols, require_protocol: true })) {
    return ''
  }
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  if (dangerousProtocols.some(protocol => trimmed.toLowerCase().startsWith(protocol))) {
    return ''
  }
  
  return trimmed
}

/**
 * Sanitize a phone number
 * Removes non-numeric characters and validates format
 * 
 * @param phone - Raw phone input
 * @returns Sanitized phone or empty string if invalid
 * 
 * @example
 * ```typescript
 * const phone = sanitizePhone('+1 (555) 123-4567')
 * // Returns: '+15551234567'
 * 
 * const invalid = sanitizePhone('not-a-phone')
 * // Returns: ''
 * ```
 */
export function sanitizePhone(phone: string | null | undefined): string {
  if (!phone || typeof phone !== 'string') return ''
  
  // Remove all non-numeric characters except + at start
  const sanitized = phone.trim().replace(/[^\d+]/g, '')
  
  // Validate phone format (10-15 digits)
  if (!validator.isMobilePhone(sanitized, 'any', { strictMode: false })) {
    return ''
  }
  
  return sanitized
}

/**
 * Sanitize a UUID
 * Validates UUID format
 * 
 * @param uuid - Raw UUID input
 * @returns Sanitized UUID or empty string if invalid
 * 
 * @example
 * ```typescript
 * const id = sanitizeUuid('550e8400-e29b-41d4-a716-446655440000')
 * // Returns: '550e8400-e29b-41d4-a716-446655440000'
 * 
 * const invalid = sanitizeUuid('not-a-uuid')
 * // Returns: ''
 * ```
 */
export function sanitizeUuid(uuid: string | null | undefined): string {
  if (!uuid || typeof uuid !== 'string') return ''
  
  const trimmed = uuid.trim().toLowerCase()
  
  if (!validator.isUUID(trimmed)) return ''
  
  return trimmed
}

/**
 * Sanitize a number
 * Parses and validates numeric input
 * 
 * @param input - Raw numeric input
 * @param options - Validation options
 * @returns Sanitized number or null if invalid
 * 
 * @example
 * ```typescript
 * const age = sanitizeNumber('25')
 * // Returns: 25
 * 
 * const price = sanitizeNumber('19.99', { min: 0, max: 1000 })
 * // Returns: 19.99
 * ```
 */
export function sanitizeNumber(
  input: string | number | null | undefined,
  options?: { min?: number; max?: number; integer?: boolean }
): number | null {
  if (input === null || input === undefined) return null
  
  const num = typeof input === 'string' ? parseFloat(input) : input
  
  if (isNaN(num) || !isFinite(num)) return null
  
  // Validate integer
  if (options?.integer && !Number.isInteger(num)) return null
  
  // Validate range
  if (options?.min !== undefined && num < options.min) return null
  if (options?.max !== undefined && num > options.max) return null
  
  return num
}

/**
 * Sanitize a boolean
 * Parses various truthy/falsy inputs
 * 
 * @param input - Raw boolean input
 * @returns Boolean value
 * 
 * @example
 * ```typescript
 * sanitizeBoolean('true')    // Returns: true
 * sanitizeBoolean('1')       // Returns: true
 * sanitizeBoolean('false')   // Returns: false
 * sanitizeBoolean('0')       // Returns: false
 * sanitizeBoolean(undefined) // Returns: false
 * ```
 */
export function sanitizeBoolean(input: string | boolean | number | null | undefined): boolean {
  if (typeof input === 'boolean') return input
  if (!input) return false
  
  const str = String(input).toLowerCase().trim()
  
  return ['true', '1', 'yes', 'on'].includes(str)
}

/**
 * Sanitize a JSON object
 * Recursively sanitizes all string values in an object
 * 
 * @param obj - Raw object input
 * @param options - Sanitization options
 * @returns Sanitized object
 * 
 * @example
 * ```typescript
 * const data = sanitizeObject({
 *   name: '<script>alert("xss")</script>John',
 *   bio: '<p>Hello</p>',
 *   age: '25'
 * })
 * // Returns: { name: 'John', bio: 'Hello', age: '25' }
 * ```
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T | null | undefined,
  options?: SanitizeOptions
): T {
  if (!obj || typeof obj !== 'object') return {} as T
  
  const sanitized: any = Array.isArray(obj) ? [] : {}
  
  for (const key in obj) {
    const value = obj[key]
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value, options)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value, options)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
}

/**
 * Sanitize filename
 * Removes dangerous characters from filenames
 * 
 * @param filename - Raw filename input
 * @returns Sanitized filename
 * 
 * @example
 * ```typescript
 * const file = sanitizeFilename('../../../etc/passwd')
 * // Returns: 'etcpasswd'
 * 
 * const safe = sanitizeFilename('My Document (2024).pdf')
 * // Returns: 'My_Document_2024.pdf'
 * ```
 */
export function sanitizeFilename(filename: string | null | undefined): string {
  if (!filename || typeof filename !== 'string') return ''
  
  let sanitized = filename.trim()
  
  // Remove path traversal attempts
  sanitized = sanitized.replace(/\.\./g, '')
  sanitized = sanitized.replace(/[\/\\]/g, '')
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '')
  
  // Replace spaces and special chars with underscore
  sanitized = sanitized.replace(/[\s()[\]{}]+/g, '_')
  
  // Remove leading/trailing dots and underscores
  sanitized = sanitized.replace(/^[._]+|[._]+$/g, '')
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop() || ''
    const name = sanitized.substring(0, 255 - ext.length - 1)
    sanitized = ext ? `${name}.${ext}` : name
  }
  
  return sanitized || 'untitled'
}

/**
 * Sanitize SQL input (for raw queries - prefer parameterized queries)
 * Escapes dangerous SQL characters
 * 
 * @param input - Raw SQL input
 * @returns Escaped SQL string
 * 
 * @warning This is a fallback. ALWAYS use parameterized queries with ORMs
 * 
 * @example
 * ```typescript
 * const search = sanitizeSql("'; DROP TABLE users; --")
 * // Returns: "\\'; DROP TABLE users; --" (escaped)
 * ```
 */
export function sanitizeSql(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return ''
  
  // Escape single quotes
  let sanitized = input.replace(/'/g, "''")
  
  // Remove SQL comment markers
  sanitized = sanitized.replace(/--/g, '')
  sanitized = sanitized.replace(/\/\*/g, '')
  sanitized = sanitized.replace(/\*\//g, '')
  
  // Remove dangerous keywords at start
  const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'EXEC', 'EXECUTE']
  const upperInput = sanitized.trim().toUpperCase()
  
  for (const keyword of dangerousKeywords) {
    if (upperInput.startsWith(keyword)) {
      console.warn(`⚠️  Potential SQL injection attempt blocked: ${keyword}`)
      return ''
    }
  }
  
  return sanitized
}

/**
 * Validate and sanitize request body
 * Type-safe validation with automatic sanitization
 * 
 * @param body - Raw request body
 * @param schema - Validation schema
 * @returns Validated and sanitized data
 * 
 * @example
 * ```typescript
 * const data = await validateRequestBody(request.body, {
 *   name: { type: 'string', required: true, maxLength: 100 },
 *   email: { type: 'email', required: true },
 *   age: { type: 'number', min: 0, max: 150 },
 *   website: { type: 'url' }
 * })
 * ```
 */
export interface ValidationSchema {
  [key: string]: {
    type: 'string' | 'email' | 'url' | 'uuid' | 'number' | 'boolean' | 'phone'
    required?: boolean
    maxLength?: number
    min?: number
    max?: number
    allowHtml?: boolean
  }
}

export function validateRequestBody<T extends Record<string, any>>(
  body: any,
  schema: ValidationSchema
): { valid: boolean; data: Partial<T>; errors: string[] } {
  const errors: string[] = []
  const data: any = {}
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = body[key]
    
    // Check required
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`)
      continue
    }
    
    // Skip optional fields
    if (!rules.required && (value === undefined || value === null)) {
      continue
    }
    
    // Sanitize based on type
    switch (rules.type) {
      case 'string':
        data[key] = sanitizeString(value, { 
          maxLength: rules.maxLength,
          allowHtml: rules.allowHtml 
        })
        if (!data[key] && rules.required) {
          errors.push(`${key} is invalid`)
        }
        break
        
      case 'email':
        data[key] = sanitizeEmail(value)
        if (!data[key] && rules.required) {
          errors.push(`${key} must be a valid email`)
        }
        break
        
      case 'url':
        data[key] = sanitizeUrl(value)
        if (!data[key] && rules.required) {
          errors.push(`${key} must be a valid URL`)
        }
        break
        
      case 'uuid':
        data[key] = sanitizeUuid(value)
        if (!data[key] && rules.required) {
          errors.push(`${key} must be a valid UUID`)
        }
        break
        
      case 'phone':
        data[key] = sanitizePhone(value)
        if (!data[key] && rules.required) {
          errors.push(`${key} must be a valid phone number`)
        }
        break
        
      case 'number':
        data[key] = sanitizeNumber(value, { min: rules.min, max: rules.max })
        if (data[key] === null && rules.required) {
          errors.push(`${key} must be a valid number`)
        }
        break
        
      case 'boolean':
        data[key] = sanitizeBoolean(value)
        break
    }
  }
  
  return {
    valid: errors.length === 0,
    data: data as Partial<T>,
    errors,
  }
}

/**
 * Rate limiting helper (basic implementation)
 * Prevents brute force attacks
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(
  identifier: string,
  maxAttempts: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  // Reset if window expired
  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })
    return { allowed: true, remaining: maxAttempts - 1, resetAt: now + windowMs }
  }
  
  // Increment count
  record.count++
  
  // Check if limit exceeded
  const allowed = record.count <= maxAttempts
  const remaining = Math.max(0, maxAttempts - record.count)
  
  return { allowed, remaining, resetAt: record.resetAt }
}

/**
 * Clean rate limit cache periodically
 */
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key)
      }
    }
  }, 60000) // Clean every minute
}
