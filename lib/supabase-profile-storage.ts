import { supabase, Profile } from '@/lib/supabase'

export interface ProfileData {
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

// Convert between database and app types
const toProfileData = (profile: Profile): ProfileData => ({
  id: profile.id,
  name: profile.name,
  age: profile.age,
  weight: profile.weight,
  height: profile.height,
  gender: profile.gender,
  activityLevel: profile.activity_level,
  dietaryPreference: profile.dietary_preference,
  goal: profile.goal,
  avatar: profile.avatar,
  createdAt: profile.created_at,
})

const toProfileInsert = (profile: ProfileData, userId: string) => ({
  user_id: userId,
  name: profile.name,
  age: profile.age,
  weight: profile.weight,
  height: profile.height,
  gender: profile.gender,
  activity_level: profile.activityLevel,
  dietary_preference: profile.dietaryPreference,
  goal: profile.goal,
  avatar: profile.avatar,
})

const toProfileUpdate = (profile: Partial<ProfileData>) => {
  const update: any = {}
  if (profile.name !== undefined) update.name = profile.name
  if (profile.age !== undefined) update.age = profile.age
  if (profile.weight !== undefined) update.weight = profile.weight
  if (profile.height !== undefined) update.height = profile.height
  if (profile.gender !== undefined) update.gender = profile.gender
  if (profile.activityLevel !== undefined) update.activity_level = profile.activityLevel
  if (profile.dietaryPreference !== undefined) update.dietary_preference = profile.dietaryPreference
  if (profile.goal !== undefined) update.goal = profile.goal
  if (profile.avatar !== undefined) update.avatar = profile.avatar
  update.updated_at = new Date().toISOString()
  return update
}

// Profile CRUD operations
export async function getUserProfiles(userId: string): Promise<ProfileData[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data?.map(toProfileData) || []
  } catch (error) {
    console.error('Error fetching user profiles:', error)
    return []
  }
}

export async function createProfile(profile: ProfileData, userId: string): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(toProfileInsert(profile, userId))
      .select()
      .single()

    if (error) throw error
    return toProfileData(data)
  } catch (error) {
    console.error('Error creating profile:', error)
    return null
  }
}

export async function updateProfile(profile: ProfileData): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(toProfileUpdate(profile))
      .eq('id', profile.id)
      .select()
      .single()

    if (error) throw error
    return toProfileData(data)
  } catch (error) {
    console.error('Error updating profile:', error)
    return null
  }
}

export async function deleteProfile(profileId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profileId)

    return !error
  } catch (error) {
    console.error('Error deleting profile:', error)
    return false
  }
}

export async function getProfileById(profileId: string): Promise<ProfileData | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single()

    if (error) throw error
    return toProfileData(data)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

// Current profile management (localStorage for current selection)
export function getCurrentProfile(): ProfileData | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('nutritrack-current-profile')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function setCurrentProfile(profile: ProfileData | null): void {
  if (typeof window === 'undefined') return
  try {
    if (profile) {
      localStorage.setItem('nutritrack-current-profile', JSON.stringify(profile))
    } else {
      localStorage.removeItem('nutritrack-current-profile')
    }
  } catch (error) {
    console.error('Error saving current profile:', error)
  }
}
