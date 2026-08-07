/**
 * action-utils.ts
 *
 * Provides utilities for wrapping Server Actions in Next.js.
 *
 * Clean Code & Safety:
 * - Standardizes the response of all server actions so they always return a predictable object.
 * - Prevents raw errors, stack traces, and database internals from leaking to the frontend.
 * - Makes it easier for React components to display meaningful error messages without having
 *   to rely on generic boundary catches.
 */

export type SafeActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Wraps an async function (e.g., a database query) and catches any thrown errors.
 * Returns a standardized SafeActionResponse object.
 *
 * @param action - The async function to execute.
 * @param errorMessage - An optional custom error message to display if the action fails.
 */
export async function withSafeAction<T>(
  action: () => Promise<T>,
  errorMessage: string = "Um erro ocorreu ao processar sua requisição.",
): Promise<SafeActionResponse<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    // We log the real error on the server for debugging
    console.error("[SafeActionError]:", error);

    // We return a sanitized, safe error message to the client
    // If the error is an instance of Error and we want to expose some of its message,
    // we could add custom logic here, but returning a generic/parameterized string is safer.
    return { success: false, error: errorMessage };
  }
}
