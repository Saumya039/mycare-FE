import { NextResponse } from "next/server"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: string = "INTERNAL_ERROR"
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = "Authentication required") {
    super(401, message, "AUTHENTICATION_ERROR")
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = "Access denied") {
    super(403, message, "AUTHORIZATION_ERROR")
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string = "Validation failed",
    public details?: any
  ) {
    super(422, message, "VALIDATION_ERROR")
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(404, message, "NOT_FOUND")
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Resource conflict") {
    super(409, message, "CONFLICT")
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Internal server error", originalError?: Error) {
    super(500, message, "INTERNAL_SERVER_ERROR")
    console.error("Internal server error:", originalError)
  }
}

/**
 * Handle API errors and return appropriate JSON response
 */
export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    const response: any = {
      error: error.message,
      code: error.code,
    }

    // Add details if it's a ValidationError
    if (error instanceof ValidationError && error.details) {
      response.details = error.details
    }

    return NextResponse.json(response, { status: error.statusCode })
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      error: "Unknown error occurred",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 }
  )
}

/**
 * Wrap API route handler with error handling
 */
export function withErrorHandling<T extends Record<string, any>>(
  handler: (req: any, params?: any) => Promise<NextResponse<T> | Response>
) {
  return async (req: any, params?: any) => {
    try {
      return await handler(req, params)
    } catch (error) {
      return handleApiError(error)
    }
  }
}
