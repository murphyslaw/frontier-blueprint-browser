/**
 * Converts a given string into a URL-friendly anchor format.
 *
 * The function transforms the input string to lowercase, replaces any sequence of non-alphanumeric
 * characters with a single hyphen, and trims leading or trailing hyphens.
 *
 * @param name - The input string to be anchorized.
 * @returns The anchorized, URL-friendly version of the input string.
 */
export function anchorize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
