"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, Shield, Palette, Wallet, Github, Twitter, Save, Upload, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function SettingsPage() {
  const { user } = useAuth()
  const [showApiKey, setShowApiKey] = useState(false)
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: user?.displayName || "",
    bio: user?.profile?.bio || "",
    website: user?.profile?.website || "",
    location: "",

    // Notification settings
    emailNotifications: true,
    bountyUpdates: true,
    projectUpdates: true,
    grantUpdates: true,
    ideaFeedback: true,
    weeklyDigest: true,

    // Privacy settings
    profileVisibility: "public",
    showEmail: false,
    showWallet: false,
    showStats: true,

    // Appearance settings
    theme: "system",
    language: "en",
    timezone: "UTC",

    // Security settings
    twoFactorEnabled: false,
    sessionTimeout: "24h",
  })

  const handleSave = (section: string) => {
    console.log(`Saving ${section} settings:`, settings)
    // Handle save logic here
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle avatar upload
      console.log("Uploading avatar:", e.target.files[0])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information and social connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="Profile" />
                    <AvatarFallback className="text-lg">{settings.displayName?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Change Avatar
                        </span>
                      </Button>
                    </Label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Your display name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={settings.location}
                      onChange={(e) => setSettings((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => setSettings((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={settings.website}
                    onChange={(e) => setSettings((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Social Connections */}
                <div className="space-y-4">
                  <Label>Social Connections</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Github className="h-5 w-5" />
                        <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-muted-foreground">
                            {user?.verified.github ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user?.verified.github && <Badge variant="secondary">Verified</Badge>}
                        <Button variant="outline" size="sm">
                          {user?.verified.github ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Twitter className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Twitter</p>
                          <p className="text-sm text-muted-foreground">
                            {user?.verified.twitter ? "Connected" : "Not connected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user?.verified.twitter && <Badge variant="secondary">Verified</Badge>}
                        <Button variant="outline" size="sm">
                          {user?.verified.twitter ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave("profile")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Bounty Updates</Label>
                      <p className="text-sm text-muted-foreground">Updates on bounties you've applied to</p>
                    </div>
                    <Switch
                      checked={settings.bountyUpdates}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, bountyUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Project Updates</Label>
                      <p className="text-sm text-muted-foreground">Updates on projects you're involved in</p>
                    </div>
                    <Switch
                      checked={settings.projectUpdates}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, projectUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Grant Updates</Label>
                      <p className="text-sm text-muted-foreground">Updates on grant applications</p>
                    </div>
                    <Switch
                      checked={settings.grantUpdates}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, grantUpdates: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Idea Feedback</Label>
                      <p className="text-sm text-muted-foreground">Feedback and votes on your ideas</p>
                    </div>
                    <Switch
                      checked={settings.ideaFeedback}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, ideaFeedback: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary of platform activity</p>
                    </div>
                    <Switch
                      checked={settings.weeklyDigest}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, weeklyDigest: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("notifications")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control what information is visible to others</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, profileVisibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can see</SelectItem>
                        <SelectItem value="verified">Verified Users Only</SelectItem>
                        <SelectItem value="private">Private - Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">Display your email on your profile</p>
                    </div>
                    <Switch
                      checked={settings.showEmail}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showEmail: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Wallet Address</Label>
                      <p className="text-sm text-muted-foreground">Display your wallet address on your profile</p>
                    </div>
                    <Switch
                      checked={settings.showWallet}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showWallet: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Statistics</Label>
                      <p className="text-sm text-muted-foreground">Display your activity stats and achievements</p>
                    </div>
                    <Switch
                      checked={settings.showStats}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showStats: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("privacy")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the platform looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, theme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="CET">Central European Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={() => handleSave("appearance")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Appearance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wallet Info */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Wallet className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Connected Wallet</p>
                      <p className="text-sm text-muted-foreground font-mono">{user?.address}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Wallet
                  </Button>
                </div>

                {/* API Key */}
                <div className="space-y-3">
                  <Label>API Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showApiKey ? "text" : "password"}
                      value="sk_live_1234567890abcdef"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">Use this key to access the Stacks Hub API</p>
                </div>

                {/* Security Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorEnabled}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, twoFactorEnabled: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout</Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, sessionTimeout: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="8h">8 hours</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                        <SelectItem value="7d">7 days</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={() => handleSave("security")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
