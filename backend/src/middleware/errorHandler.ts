import { Request, Response, NextFunction } from 'express'

interface ErrorWithStatus extends Error {
  status?: number
  statusCode?: number
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Log error for debugging (in production, use proper logging service)
  console.error(`Error ${status}: ${message}`)
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  res.status(status).json({
    success: false,
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  })
}
