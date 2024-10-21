let currentId = 0;

/**
 * Generates a unique employee ID.
 * Format: EMP000001, EMP000002, etc.
 */
export function getUniqueId(): string {
  currentId += 1;
  return `EMP${currentId.toString().padStart(6, '0')}`;
}

/**
 * Resets the ID counter.
 * Useful for testing or restarting simulations.
 */
export function resetUniqueId() {
  currentId = 0;
}