import { z, ZodSchema, ZodError } from "zod"
import { NextResponse } from "next/server"

/**
 * Parse and validate request body with Zod schema
 * Returns parsed data or sends 422 validation error response
 */
export async function parseRequest<T>(request: Request, schema: ZodSchema): Promise<T | null> {
  try {
    const body = await request.json()
    const validated = schema.parse(body)
    return validated as T
  } catch (error) {
    return null
  }
}

/**
 * Get validation error response
 */
export function validationErrorResponse(error: ZodError | any) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
          code: e.code,
        })),
      },
      { status: 422 }
    )
  }

  // Handle generic error object
  return NextResponse.json(
    {
      error: "Validation failed",
      details: [
        {
          field: "unknown",
          message: error?.message || "Invalid request",
        },
      ],
    },
    { status: 422 }
  )
}

/**
 * Safely parse request body and handle validation errors
 */
export async function validateRequest<T>(request: Request, schema: ZodSchema) {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)

    if (!result.success) {
      return {
        success: false,
        data: null,
        errors: result.error,
      }
    }

    return {
      success: true,
      data: result.data as T,
      errors: null,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: {
        message: "Invalid JSON",
      },
    }
  }
}

