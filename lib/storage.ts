/**
 * Save user profile to local storage
 */
export function saveUserProfile(profile: any): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userProfile", JSON.stringify(profile))
  }
}

/**
 * Get user profile from local storage
 */
export function getUserProfile(): any {
  if (typeof window === "undefined") {
    return null
  }
  const profile = localStorage.getItem("userProfile")
  return profile ? JSON.parse(profile) : null
}

/**
 * Save food entry to local storage
 * Entries are stored by date in the format YYYY-MM-DD
 */
export function saveFoodEntry(date: string, entry: any): void {
  if (typeof window !== "undefined") {
    const entries = getFoodEntries(date) || []
    entries.push(entry)
    localStorage.setItem(`foodEntries:${date}`, JSON.stringify(entries))
  }
}

/**
 * Get food entries for a specific date
 */
export function getFoodEntries(date: string): any[] {
  if (typeof window === "undefined") {
    return []
  }
  const entries = localStorage.getItem(`foodEntries:${date}`)
  return entries ? JSON.parse(entries) : []
}

/**
 * Delete a food entry
 */
export function deleteFoodEntry(date: string, index: number): void {
  if (typeof window !== "undefined") {
    const entries = getFoodEntries(date)
    if (entries && entries.length > index) {
      entries.splice(index, 1)
      localStorage.setItem(`foodEntries:${date}`, JSON.stringify(entries))
    }
  }
}

