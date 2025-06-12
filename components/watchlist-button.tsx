"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

interface WatchlistButtonProps {
  tokenId: string
  tokenName: string
}

export function WatchlistButton({ tokenId, tokenName }: WatchlistButtonProps) {
  const [isWatched, setIsWatched] = useState(false)

  useEffect(() => {
    const watchlist = JSON.parse(localStorage.getItem("tokenWatchlist") || "[]")
    setIsWatched(watchlist.includes(tokenId))
  }, [tokenId])

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("tokenWatchlist") || "[]")

    if (isWatched) {
      const newWatchlist = watchlist.filter((id: string) => id !== tokenId)
      localStorage.setItem("tokenWatchlist", JSON.stringify(newWatchlist))
      setIsWatched(false)
    } else {
      watchlist.push(tokenId)
      localStorage.setItem("tokenWatchlist", JSON.stringify(watchlist))
      setIsWatched(true)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleWatchlist}
      className={`border-zinc-700 ${
        isWatched
          ? "bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/30 border-yellow-700"
          : "text-gray-300 hover:bg-[#1e293b] hover:text-white"
      }`}
    >
      <Star className={`w-4 h-4 mr-2 ${isWatched ? "fill-current" : ""}`} />
      {isWatched ? "Watching" : "Watch"}
    </Button>
  )
}
