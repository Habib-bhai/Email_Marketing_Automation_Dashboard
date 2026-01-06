/**
 * Logger utility for consistent logging across the application
 * Supports different log levels and structured logging
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * Namespaced loggers using getters to avoid TDZ errors
   */
  get ingestion() {
    return ingestionLogger
  }

  get api() {
    return apiLogger
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context))
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context))
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = error
      ? { ...context, error: error.message, stack: error.stack }
      : context
    console.error(this.formatMessage('error', message, errorContext))
  }

  /**
   * Log API request/response (for ingestion endpoint)
   */
  apiLog(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    this.info(`${method} ${path} ${statusCode} ${duration}ms`, context)
  }
}

export const logger = new Logger()

// Ingestion-specific logging (from Phase 3)
export const ingestionLogger = {
  success: (type: string, id: string, duration: number) => {
    console.log(JSON.stringify({
      event: 'ingestion.success',
      type,
      id,
      duration,
      timestamp: new Date().toISOString()
    }))
  },
  failure: (type: string, error: string, reason: string) => {
    console.error(JSON.stringify({
      event: 'ingestion.failure',
      type,
      error,
      reason,
      timestamp: new Date().toISOString()
    }))
  }
}

// API-specific logging (for Phase 4)
export const apiLogger = {
  error: (message: string, error: any) => {
    console.error(JSON.stringify({
      event: 'api.error',
      message,
      error: error?.message || String(error),
      stack: error?.stack,
      timestamp: new Date().toISOString()
    }))
  },
  success: (endpoint: string, duration: number) => {
    console.log(JSON.stringify({
      event: 'api.success',
      endpoint,
      duration,
      timestamp: new Date().toISOString()
    }))
  }
}

// Namespaced loggers are bound in Logger constructor
