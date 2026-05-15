import { ValidationError } from "../../lib/creator/validation.js";

export function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export function handleApiError(error) {
  const status = error?.status || (error instanceof ValidationError ? 400 : 500);
  const message = status >= 500 ? "Internal server error" : error.message;
  return json({
    error: {
      message,
      details: error?.details || [],
    },
  }, status);
}
