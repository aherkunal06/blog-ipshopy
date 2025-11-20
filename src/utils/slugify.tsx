

/**
 * Converts a given text string into an SEO-friendly URL slug.
 * This function performs the following operations:
 * 1. Converts the text to a string.
 * 2. Normalizes Unicode characters (e.g., accents).
 * 3. Removes diacritic marks.
 * 4. Converts the text to lowercase.
 * 5. Trims leading/trailing whitespace.
 * 6. Replaces spaces with hyphens.
 * 7. Removes all non-word characters (excluding hyphens).
 * 8. Replaces multiple consecutive hyphens with a single hyphen.
 *
 * @param text The input string to convert into a slug.
 * @returns The SEO-friendly slug string.
 */
export function slugify(text: string): string {
  return text
    .toString()                     // Ensure it's a string
    .normalize('NFD')               // Normalize Unicode (e.g., 'é' -> 'e' + '́')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritic marks (the '́' part)
    .toLowerCase()                  // Convert to lowercase
    .trim()                         // Trim leading/trailing whitespace
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')       // Remove all non-word characters (keep hyphens)
    .replace(/--+/g, '-');          // Replace multiple hyphens with a single hyphen
}

