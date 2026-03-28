interface Profile {
  id: string
  name: string
  age: number
  weight: number
  height: number
  gender: "male" | "female"
  activityLevel: string
  dietaryPreference: string
  goal: string
  avatar?: string
  createdAt: string
}

const PROFILES_KEY = "nutritrack-profiles"
const CURRENT_PROFILE_KEY = "nutritrack-current-profile"

export function getUserProfiles(): Profile[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(PROFILES_KEY)
    return stored ? JSON.parse(stored) : getDefaultProfiles()
  } catch (error) {
    console.error("Error loading profiles:", error)
    return getDefaultProfiles()
  }
}

export function saveUserProfiles(profiles: Profile[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
  } catch (error) {
    console.error("Error saving profiles:", error)
  }
}

export function getCurrentProfile(): Profile | null {
  if (typeof window === "undefined") return null
  
  try {
    const currentId = localStorage.getItem(CURRENT_PROFILE_KEY)
    if (currentId) {
      const profiles = getUserProfiles()
      return profiles.find(p => p.id === currentId) || profiles[0] || null
    }
    return getUserProfiles()[0] || null
  } catch (error) {
    console.error("Error loading current profile:", error)
    return null
  }
}

export function setCurrentProfile(profile: Profile): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(CURRENT_PROFILE_KEY, profile.id)
  } catch (error) {
    console.error("Error setting current profile:", error)
  }
}

function getDefaultProfiles(): Profile[] {
  return [
    {
      id: "default-profile",
      name: "John Doe",
      age: 30,
      weight: 70,
      height: 170,
      gender: "male",
      activityLevel: "moderate",
      dietaryPreference: "standard",
      goal: "maintenance",
      createdAt: new Date().toISOString()
    }
  ]
}
