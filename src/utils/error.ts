/** Extracts a human-readable message from an unknown thrown value. */
export const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);
