"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Plus, Settings, LogOut, Edit2, Check, X, Camera, LayoutDashboard } from "lucide-react"
import { useProfileContext } from "@/components/profile-context"
import { saveUserProfiles } from "@/lib/profile-storage"
import { useRouter } from "next/navigation"

export function ProfileDropdown() {
  const router = useRouter()
  const { 
    currentProfile, 
    profiles, 
    updateCurrentProfile, 
    updateProfiles, 
    switchProfile, 
    setActiveTab,
    profileAvatar,
    setProfileAvatar 
  } = useProfileContext()
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [newProfileName, setNewProfileName] = useState("")
  const [editProfileName, setEditProfileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createProfile = () => {
    if (!newProfileName.trim()) return

    const newProfile = {
      id: Date.now().toString(),
      name: newProfileName,
      age: 30,
      weight: 70,
      height: 170,
      gender: "male" as const,
      activityLevel: "moderate",
      dietaryPreference: "standard",
      goal: "maintenance",
      createdAt: new Date().toISOString()
    }

    const updatedProfiles = [...profiles, newProfile]
    updateProfiles(updatedProfiles)
    switchProfile(newProfile)
    setNewProfileName("")
    setIsCreateDialogOpen(false)
  }

  const updateProfile = () => {
    if (!editingProfile || !editProfileName.trim()) return

    const updatedProfile = { ...editingProfile, name: editProfileName }
    updateCurrentProfile(updatedProfile)

    setEditProfileName("")
    setEditingProfile(null)
    setIsEditDialogOpen(false)
  }

  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return

    const updatedProfiles = profiles.filter(p => p.id !== profileId)
    updateProfiles(updatedProfiles)

    if (currentProfile?.id === profileId) {
      switchProfile(updatedProfiles[0])
    }
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setProfileAvatar(base64)
    }
    reader.readAsDataURL(file)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-pink-400 to-pink-600",
      "bg-gradient-to-br from-purple-400 to-purple-600", 
      "bg-gradient-to-br from-blue-400 to-blue-600",
      "bg-gradient-to-br from-green-400 to-green-600",
      "bg-gradient-to-br from-yellow-400 to-yellow-600",
      "bg-gradient-to-br from-red-400 to-red-600",
      "bg-gradient-to-br from-indigo-400 to-indigo-600",
      "bg-gradient-to-br from-teal-400 to-teal-600"
    ]
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  const handleSettingsClick = () => {
    setActiveTab("profile")
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="relative overflow-hidden rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileAvatar || currentProfile?.avatar} />
              <AvatarFallback className={`${getAvatarColor(currentProfile?.name || "User")} text-white font-semibold text-sm`}>
                {getInitials(currentProfile?.name || "User")}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-80 bg-background/95 backdrop-blur-xl border-primary/20">
          <DropdownMenuLabel className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileAvatar || currentProfile?.avatar} />
              <AvatarFallback className={`${getAvatarColor(currentProfile?.name || "User")} text-white font-semibold`}>
                {getInitials(currentProfile?.name || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{currentProfile?.name || "Guest User"}</span>
              <span className="text-xs text-muted-foreground">Current Profile</span>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />

          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            Change Profile Picture
          </DropdownMenuItem>

          {profileAvatar && (
            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer text-destructive"
              onClick={() => setProfileAvatar(null)}
            >
              <X className="h-4 w-4" />
              Remove Profile Picture
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/home')}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <div className="max-h-60 overflow-y-auto">
            {profiles.map((profile) => (
              <DropdownMenuItem 
                key={profile.id} 
                className="flex items-center justify-between p-3 cursor-pointer"
                onClick={() => switchProfile(profile)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className={getAvatarColor(profile.name)}>
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{profile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {profile.age}y, {profile.goal}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {currentProfile?.id === profile.id && (
                    <Badge variant="secondary" className="text-xs">Active</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingProfile(profile)
                      setEditProfileName(profile.name)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  {profiles.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-destructive/10 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteProfile(profile.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer"
                onSelect={(e) => e.preventDefault()}
              >
                <Plus className="h-4 w-4" />
                Create New Profile
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="bg-background/95 backdrop-blur-xl border-primary/20">
              <DialogHeader>
                <DialogTitle>Create New Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profile-name">Profile Name</Label>
                  <Input
                    id="profile-name"
                    placeholder="Enter profile name"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createProfile} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      setNewProfileName("")
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-background/95 backdrop-blur-xl border-primary/20">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-profile-name">Profile Name</Label>
                  <Input
                    id="edit-profile-name"
                    placeholder="Enter profile name"
                    value={editProfileName}
                    onChange={(e) => setEditProfileName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateProfile} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Update
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setEditProfileName("")
                      setEditingProfile(null)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleSettingsClick}
          >
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
