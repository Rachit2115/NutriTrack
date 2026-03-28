"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-context"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function AuthTestPage() {
  const { user, session, loading, signIn, signUp, signOut } = useAuth()
  const [testResults, setTestResults] = useState<{[key: string]: 'pending' | 'success' | 'error'}>({})
  const [testError, setTestError] = useState<string | null>(null)
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')

  const runAuthTests = async () => {
    setTestResults({})
    setTestError(null)

    // Test 1: Check if user is loaded
    setTestResults(prev => ({ ...prev, userLoad: 'pending' }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setTestResults(prev => ({ ...prev, userLoad: loading ? 'error' : 'success' }))

    // Test 2: Check session
    setTestResults(prev => ({ ...prev, sessionCheck: 'pending' }))
    await new Promise(resolve => setTimeout(resolve, 500))
    setTestResults(prev => ({ ...prev, sessionCheck: session ? 'success' : 'error' }))

    // Test 3: Test signup (if email provided)
    if (testEmail && testPassword) {
      setTestResults(prev => ({ ...prev, signup: 'pending' }))
      const testUserEmail = `test${Date.now()}@example.com`
      const { error: signupError } = await signUp(testUserEmail, testPassword, 'Test User')
      setTestResults(prev => ({ ...prev, signup: signupError ? 'error' : 'success' }))
      
      if (!signupError) {
        // Test 4: Test signin with new account
        setTestResults(prev => ({ ...prev, signin: 'pending' }))
        const { error: signinError } = await signIn(testUserEmail, testPassword)
        setTestResults(prev => ({ ...prev, signin: signinError ? 'error' : 'success' }))
      }
    }

    // Test 5: Test signout (if user is logged in)
    if (user) {
      setTestResults(prev => ({ ...prev, signout: 'pending' }))
      const { error: signoutError } = await signOut()
      setTestResults(prev => ({ ...prev, signout: signoutError ? 'error' : 'success' }))
    }
  }

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusText = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return 'Running...'
      case 'success':
        return 'Passed'
      case 'error':
        return 'Failed'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication System Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your Supabase authentication setup
          </p>
        </div>

        {/* Current Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Authentication Status</CardTitle>
            <CardDescription>Real-time authentication state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Loading Status</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {loading ? 'Loading...' : 'Loaded'}
                </p>
              </div>
              <div>
                <Label>User Status</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user ? `Logged in as ${user.email}` : 'Not logged in'}
                </p>
              </div>
              <div>
                <Label>Session Status</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session ? 'Active session' : 'No session'}
                </p>
              </div>
              <div>
                <Label>User ID</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.id || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Tests</CardTitle>
            <CardDescription>Run comprehensive tests on your auth system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="test-email">Test Email (optional)</Label>
                <Input
                  id="test-email"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="test-password">Test Password (optional)</Label>
                <Input
                  id="test-password"
                  type="password"
                  placeholder="password123"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                />
              </div>
            </div>
            
            <Button onClick={runAuthTests} className="w-full">
              Run Authentication Tests
            </Button>

            {testError && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {testError}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Results of authentication tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">User Load Test</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.userLoad || 'pending')}
                    <span>{getStatusText(testResults.userLoad || 'pending')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="font-medium">Session Check Test</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(testResults.sessionCheck || 'pending')}
                    <span>{getStatusText(testResults.sessionCheck || 'pending')}</span>
                  </div>
                </div>

                {testResults.signup && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium">Signup Test</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.signup)}
                      <span>{getStatusText(testResults.signup)}</span>
                    </div>
                  </div>
                )}

                {testResults.signin && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium">Signin Test</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.signin)}
                      <span>{getStatusText(testResults.signin)}</span>
                    </div>
                  </div>
                )}

                {testResults.signout && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium">Signout Test</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(testResults.signout)}
                      <span>{getStatusText(testResults.signout)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Test */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Authentication Test</CardTitle>
            <CardDescription>Test signup and signin manually</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-2">To test authentication manually:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to the home page (/home)</li>
                <li>Try to create a new account with valid email and password</li>
                <li>Check your email for verification (if enabled)</li>
                <li>Try to sign in with your credentials</li>
                <li>Verify you can access the dashboard</li>
                <li>Test sign out functionality</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
