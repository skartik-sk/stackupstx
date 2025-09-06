"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "./auth-provider"
import { Github, Twitter, Check, Loader2 } from "lucide-react"

interface UserProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserProfileDialog({ open, onOpenChange }: UserProfileDialogProps) {
  const { user, updateProfile, verifyGithub, verifyTwitter } = useAuth()
  const [isVerifying, setIsVerifying] = useState<"github" | "twitter" | null>(null)
  const [formData, setFormData] = useState({
    bio: user?.profile.bio || "",
    website: user?.profile.website || "",
  })

  const handleSave = () => {
    updateProfile(formData)
    onOpenChange(false)
  }

  const handleVerifyGithub = async () => {
    setIsVerifying("github")
    await verifyGithub()
    setIsVerifying(null)
  }

  const handleVerifyTwitter = async () => {
    setIsVerifying("twitter")
    await verifyTwitter()
    setIsVerifying(null)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>Manage your profile and verify your accounts</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user.displayName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold">{user.displayName || "Anonymous"}</h3>
              <p className="text-sm text-muted-foreground font-mono">{user.address}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  Wallet Verified
                </Badge>
              </div>
            </div>
          </div>

          {/* Application Limits */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Monthly Application Limits</h4>
            <div className="flex items-center justify-between text-sm">
              <span>Applications used this month:</span>
              <span className="font-medium">
                {user.applicationCount}/4 ({4 - user.applicationCount} remaining)
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(user.applicationCount / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://your-website.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>
          </div>

          {/* Social Verification */}
          <div className="space-y-4">
            <h4 className="font-medium">Social Verification</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5" />
                  <div>
                    <div className="font-medium">GitHub</div>
                    <div className="text-xs text-muted-foreground">
                      {user.verified.github ? `@${user.profile.github}` : "Not verified"}
                    </div>
                  </div>
                </div>
                <Button
                  variant={user.verified.github ? "secondary" : "outline"}
                  size="sm"
                  onClick={handleVerifyGithub}
                  disabled={isVerifying === "github"}
                >
                  {isVerifying === "github" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : user.verified.github ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Twitter className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Twitter</div>
                    <div className="text-xs text-muted-foreground">
                      {user.verified.twitter ? user.profile.twitter : "Not verified"}
                    </div>
                  </div>
                </div>
                <Button
                  variant={user.verified.twitter ? "secondary" : "outline"}
                  size="sm"
                  onClick={handleVerifyTwitter}
                  disabled={isVerifying === "twitter"}
                >
                  {isVerifying === "twitter" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : user.verified.twitter ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <h4 className="font-medium">Activity Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{user.stats.bountiesCompleted}</div>
                <div className="text-xs text-muted-foreground">Bounties Completed</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{user.stats.projectsFunded}</div>
                <div className="text-xs text-muted-foreground">Projects Funded</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{user.stats.grantsReceived}</div>
                <div className="text-xs text-muted-foreground">Grants Received</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{user.stats.ideasSubmitted}</div>
                <div className="text-xs text-muted-foreground">Ideas Submitted</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
