"use client"

import { useEffect, useState } from "react"
import { getRecentBuilds, type RemixableBuild } from "@/lib/history-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ListRestart, History } from "lucide-react" // Added Trash2 for potential delete later

interface RecentBuildsSectionProps {
  onRemix: (prompt: string) => void
}

export function RecentBuildsSection({ onRemix }: RecentBuildsSectionProps) {
  const [builds, setBuilds] = useState<RemixableBuild[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ensure this runs only client-side
    if (typeof window !== "undefined") {
      setBuilds(getRecentBuilds())
      setIsLoading(false)
    }
  }, [])

  const handleRemixClick = (build: RemixableBuild) => {
    onRemix(build.customizedPrompt)
  }

  // Optional: Implement delete functionality if needed in the future
  // const handleDeleteBuild = (buildId: string) => {
  //   // Logic to remove from localStorage and update state
  //   // This would require a new function in history-manager.ts
  //   console.log("Delete build:", buildId);
  //   // setBuilds(updatedBuilds);
  // };

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-[#0A0D14] text-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center">
            <History className="mr-3 h-7 w-7 text-purple-400" /> Your Recent Builds
          </h2>
          <p className="text-center text-gray-400">Loading recent builds...</p>
        </div>
      </section>
    )
  }

  if (builds.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-[#0A0D14] text-white">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center">
            <History className="mr-3 h-7 w-7 text-purple-400" /> Your Recent Builds
          </h2>
          <p className="text-center text-gray-400">No recent builds found. Start creating to see your history here!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-[#0A0D14] text-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10 flex items-center justify-center">
          <History className="mr-3 h-7 w-7 text-purple-400" /> Your Recent Builds
        </h2>
        <ScrollArea className="h-[400px] w-full rounded-md border border-zinc-700 bg-[#0D111C] p-1">
          <div className="p-4 space-y-4">
            {builds.map((build) => (
              <Card
                key={build.id}
                className="bg-[#131A2C] border-zinc-600 shadow-lg hover:shadow-purple-500/20 transition-shadow"
              >
                <CardHeader className="pb-3 pt-4 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-semibold text-purple-300">
                        {build.projectName || build.tokenName || "Untitled Build"}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-400 mt-1">
                        {new Date(build.timestamp).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemixClick(build)}
                      className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500 text-xs px-3 py-1"
                    >
                      <ListRestart className="mr-1.5 h-3.5 w-3.5" />
                      Remix
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-sm text-gray-300 line-clamp-2">
                    <span className="font-medium text-gray-400">Prompt: </span>
                    {build.customizedPrompt || build.originalPrompt}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    ID: {build.id} | Type: {build.type}
                  </div>
                </CardContent>
                {/* Optional: Delete button
                <CardFooter className="p-2 border-t border-zinc-700/50">
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-900/30 w-full justify-start text-xs" onClick={() => handleDeleteBuild(build.id)}>
                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete from History
                  </Button>
                </CardFooter>
                */}
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  )
}
