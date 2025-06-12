// This is the new ProfileModal component.
// Ensure this file is created with the following content.
// The full code for this was provided in the previous response.
// For brevity, I'm showing a placeholder here.
// If you need the full code for profile-modal.tsx again, please let me know.
"use client"

import { cn } from "@/lib/utils"

import { useEffect, useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { UserCircle, Edit3, Save, X, ExternalLink, CopyIcon, CheckCircle, Info } from "lucide-react"
import type { ProfileSettings, DeployedProtocol } from "@/types/profile" // Ensure this path is correct

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  walletAddress: string
}

// Mock function to get protocols - replace with actual localStorage logic
const getMockProtocols = (walletAddr: string): DeployedProtocol[] => {
  // In a real app, this would fetch from localStorage or a backend
  // For now, returning some mock data based on walletAddress to show variance
  if (walletAddr.endsWith("123")) {
    return [
      {
        id: "1",
        title: "My First Staking Pool",
        promptSnippet: "Create a staking pool with 8% APR...",
        type: "Staking",
        chain: "Solana",
        dateGenerated: new Date().toISOString(),
        tags: ["Staking", "Solana", "DeFi"],
        isPremium: true,
        contractAddress: "SoLStakePooLAddressXXX",
      },
      {
        id: "2",
        title: "Cool DAO Token",
        promptSnippet: "Launch a DAO token for governance...",
        type: "DAO",
        chain: "Base",
        dateGenerated: new Date(Date.now() - 86400000 * 2).toISOString(),
        tags: ["DAO", "Base", "Governance", "AI Integrated"],
        isPremium: true,
        contractAddress: "0xBaseDAOTokenAddressYYY",
      },
    ]
  }
  return [
    {
      id: "3",
      title: "Vesting Contract Alpha",
      promptSnippet: "Token vesting with 1yr cliff...",
      type: "Vesting",
      chain: "Solana",
      dateGenerated: new Date(Date.now() - 86400000 * 5).toISOString(),
      tags: ["Vesting", "Solana", "Tokens"],
      isPremium: false,
      contractAddress: "SoLVestContractAddressZZZ",
    },
  ]
}

export function ProfileModal({ isOpen, onClose, walletAddress }: ProfileModalProps) {
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    displayName: "",
    bio: "",
    isPublic: false,
  })
  const [deployedProtocols, setDeployedProtocols] = useState<DeployedProtocol[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const loadProfileData = useCallback(() => {
    setIsLoading(true)
    // Load settings
    const storedSettings = localStorage.getItem(`synthfi-profile-${walletAddress}`)
    if (storedSettings) {
      setProfileSettings(JSON.parse(storedSettings))
    } else {
      // Default settings if none found
      setProfileSettings({ displayName: "", bio: "", isPublic: false })
    }

    // Load protocols (replace with actual logic for your app)
    // For now, using mock data. In a real app, you'd fetch from localStorage or backend.
    // const storedProtocols = localStorage.getItem(`synthfi-protocols-${walletAddress}`);
    // if (storedProtocols) {
    //   setDeployedProtocols(JSON.parse(storedProtocols));
    // } else {
    //   setDeployedProtocols([]);
    // }
    setDeployedProtocols(getMockProtocols(walletAddress)) // Using mock for now
    setIsLoading(false)
  }, [walletAddress])

  useEffect(() => {
    if (isOpen && walletAddress) {
      loadProfileData()
    }
  }, [isOpen, walletAddress, loadProfileData])

  const handleSaveSettings = () => {
    localStorage.setItem(`synthfi-profile-${walletAddress}`, JSON.stringify(profileSettings))
    setIsEditing(false)
    toast({ title: "Profile Updated", description: "Your profile settings have been saved." })
  }

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: `${type} Copied!`, description: text, duration: 3000 })
  }

  const getBlockExplorerLink = (protocol: DeployedProtocol) => {
    if (!protocol.contractAddress) return "#"
    if (protocol.chain.toLowerCase() === "solana") {
      return `https://solscan.io/account/${protocol.contractAddress}`
    }
    if (protocol.chain.toLowerCase() === "base") {
      return `https://basescan.org/address/${protocol.contractAddress}`
    }
    return "#"
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#18181b] border-zinc-700 text-white sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 border-b border-zinc-700">
          <DialogTitle className="text-2xl font-semibold flex items-center">
            <UserCircle className="h-8 w-8 mr-3 text-purple-400" />
            User Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            View and manage your SynthFi profile and deployed protocols.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-grow flex items-center justify-center p-6">
            <p className="text-gray-400">Loading profile...</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
            {/* Profile Overview Section */}
            <Card className="bg-zinc-800/50 border-zinc-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-gray-200">Profile Overview</CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="border-purple-500 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
                    >
                      <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>
                <CardDescription className="text-sm text-gray-400">
                  Your connected wallet:{" "}
                  <span className="font-mono text-purple-300">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="displayName" className="text-sm font-medium text-gray-300">
                    Display Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="displayName"
                      value={profileSettings.displayName}
                      onChange={(e) => setProfileSettings({ ...profileSettings, displayName: e.target.value })}
                      className="mt-1 bg-zinc-700 border-zinc-600 text-white focus:ring-purple-500"
                      placeholder="Your awesome builder name"
                    />
                  ) : (
                    <p className="mt-1 text-gray-200">
                      {profileSettings.displayName || <span className="text-gray-500 italic">Not set</span>}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-300">
                    Short Bio (Max 140 chars)
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profileSettings.bio}
                      onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value.slice(0, 140) })}
                      maxLength={140}
                      className="mt-1 bg-zinc-700 border-zinc-600 text-white focus:ring-purple-500 min-h-[80px]"
                      placeholder="Tell us a bit about yourself or your projects"
                    />
                  ) : (
                    <p className="mt-1 text-gray-200 whitespace-pre-wrap">
                      {profileSettings.bio || <span className="text-gray-500 italic">Not set</span>}
                    </p>
                  )}
                  {isEditing && (
                    <p className="text-xs text-right text-gray-500 mt-1">{profileSettings.bio.length}/140</p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublic"
                      checked={profileSettings.isPublic}
                      onCheckedChange={(checked) => setProfileSettings({ ...profileSettings, isPublic: checked })}
                      disabled={!isEditing && !profileSettings.isPublic} // Allow toggling off if public and not editing
                      className="data-[state=checked]:bg-purple-500"
                    />
                    <Label htmlFor="isPublic" className="text-sm text-gray-300">
                      Make Profile Public
                    </Label>
                  </div>
                  {profileSettings.isPublic && !isEditing && (
                    <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/10">
                      <CheckCircle className="h-3 w-3 mr-1.5" /> Public
                    </Badge>
                  )}
                  {!profileSettings.isPublic && !isEditing && (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400 bg-yellow-500/10">
                      <Info className="h-3 w-3 mr-1.5" /> Private
                    </Badge>
                  )}
                </div>
                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false)
                        loadProfileData()
                      }}
                      className="text-gray-300 hover:bg-zinc-700"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSettings} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deployed Protocols Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-3">
                Deployed Protocols ({deployedProtocols.length})
              </h3>
              {deployedProtocols.length > 0 ? (
                <div className="space-y-4">
                  {deployedProtocols.map((protocol) => (
                    <Card key={protocol.id} className="bg-zinc-800/50 border-zinc-700 overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-purple-300 hover:text-purple-200 cursor-pointer">
                              {protocol.title}
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500">
                              Generated: {new Date(protocol.dateGenerated).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            variant={protocol.chain.toLowerCase() === "solana" ? "secondary" : "default"}
                            className={cn(
                              "text-xs",
                              protocol.chain.toLowerCase() === "solana"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/30",
                            )}
                          >
                            {protocol.chain}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p className="text-gray-400 italic">"{protocol.promptSnippet}"</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-xs">Type:</span>
                          <Badge variant="outline" className="border-zinc-600 text-gray-300">
                            {protocol.type}
                          </Badge>
                        </div>
                        {protocol.contractAddress && (
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-gray-500">Address:</span>
                            <span
                              className="font-mono text-gray-400 hover:text-gray-200 truncate"
                              title={protocol.contractAddress}
                            >
                              {protocol.contractAddress.substring(0, 8)}...
                              {protocol.contractAddress.substring(protocol.contractAddress.length - 6)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-500 hover:text-purple-300"
                              onClick={() => handleCopyToClipboard(protocol.contractAddress!, "Contract Address")}
                            >
                              <CopyIcon className="h-3.5 w-3.5" />
                            </Button>
                            <a
                              href={getBlockExplorerLink(protocol)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 hover:underline inline-flex items-center"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {protocol.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-zinc-600 text-gray-400">
                              {tag}
                            </Badge>
                          ))}
                          {protocol.isPremium && (
                            <Badge className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                              ✨ Premium Feature
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic text-center py-4">No protocols deployed or generated yet.</p>
              )}
            </div>
          </div>
        )}
        <DialogFooter className="p-4 border-t border-zinc-700">
          <Button variant="outline" onClick={onClose} className="text-gray-300 border-zinc-600 hover:bg-zinc-700">
            <X className="h-4 w-4 mr-2" /> Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
