"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import { supabase } from "@/lib/supabase"
import { Users, Calendar, Mail, MapPin } from "lucide-react"

interface ProfileData {
  id: string
  user_id: string
  name: string
  age: number
  weight: number
  height: number
  gender: 'male' | 'female'
  activity_level: string
  dietary_preference: string
  goal: string
  created_at: string
  updated_at: string
}

export default function DataViewerPage() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<ProfileData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProfiles(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profiles')
      } finally {
        setLoading(false)
      }
    }

    fetchProfiles()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view data.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-8 w-8 text-green-600" />
              User Database
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View all user profiles stored in the database
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {profiles.length} Users
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Profiles</CardTitle>
            <CardDescription>
              Complete list of all registered users and their profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {profiles.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found in the database</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Height</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Diet</TableHead>
                      <TableHead>Goal</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>{profile.age}</TableCell>
                        <TableCell>
                          <Badge variant={profile.gender === 'male' ? 'default' : 'secondary'}>
                            {profile.gender}
                          </Badge>
                        </TableCell>
                        <TableCell>{profile.weight}kg</TableCell>
                        <TableCell>{profile.height}cm</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {profile.activity_level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {profile.dietary_preference}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={profile.goal === 'weight-loss' ? 'destructive' : 
                                   profile.goal === 'muscle-gain' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {profile.goal}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{profiles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="h-8 w-8 text-green-600">👨</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Male Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profiles.filter(p => p.gender === 'male').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="fles items-center">
                <div className="h-8 w-8 text-pink-600">👩</div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Female Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profiles.filter(p => p.gender === 'female').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {profiles.filter(p => 
                      new Date(p.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
