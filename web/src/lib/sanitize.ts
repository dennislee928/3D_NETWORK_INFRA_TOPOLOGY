import DOMPurify from "dompurify"

export function sanitizeLabel(label: string): string {
  if (typeof label !== "string") return ""
  return DOMPurify.sanitize(label, { ALLOWED_TAGS: [] })
}
