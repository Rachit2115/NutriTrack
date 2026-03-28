/**
 * Format a date to YYYY-MM-DD format for storage
 * or other format for display
 */
export function formatDate(date: Date, format: "default" | "long" | "input" = "default"): string {
  if (format === "long") {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } else if (format === "input") {
    return date.toISOString().split("T")[0]
  } else {
    // Default format: YYYY-MM-DD
    return date.toISOString().split("T")[0]
  }
}

/**
 * Get a range of days (start and end dates)
 */
export function getDayRange(date: Date, days: number, before = true): { startDate: Date; endDate: Date } {
  const result = {
    startDate: new Date(date),
    endDate: new Date(date),
  }

  if (before) {
    result.startDate.setDate(date.getDate() - days)
  } else {
    result.startDate.setDate(date.getDate() - (days - 1))
    result.endDate.setDate(date.getDate() + 1)
  }

  return result
}

