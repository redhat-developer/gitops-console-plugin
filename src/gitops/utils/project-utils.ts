/**
 * Utility functions for AppProject components
 */

/**
 * Checks if a string value represents a deny rule (starts with '!')
 */
export const isDenyRule = (value: string | undefined): boolean => {
  return value?.startsWith('!') || false;
};

/**
 * Gets the display value from a string, removing the '!' prefix if present
 */
export const getDisplayValue = (value: string | undefined): string => {
  if (!value) return '-';
  return isDenyRule(value) ? value.substring(1) : value;
};
