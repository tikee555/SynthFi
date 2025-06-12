"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface TokenDetailsStepProps {
  contractData: {
    name: string
    symbol: string
    description: string
    image: string
    website: string
    twitter: string
    telegram: string
    documentation: string
  }
  onContinue: (details: any) => void
}

export function TokenDetailsStep({ contractData, onContinue }: TokenDetailsStepProps) {
  const [tokenDetails, setTokenDetails] = useState({
    name: contractData.name || "",
    symbol: contractData.symbol || "",
    description: contractData.description || "",
    image: contractData.image || "",
    website: contractData.website || "",
    twitter: contractData.twitter || "",
    telegram: contractData.telegram || "",
    documentation: contractData.documentation || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTokenDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload the file to a server
      // For now, we'll just use a placeholder
      setTokenDetails((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!tokenDetails.name.trim()) {
      newErrors.name = "Token name is required"
    }

    if (!tokenDetails.symbol.trim()) {
      newErrors.symbol = "Token symbol is required"
    } else if (tokenDetails.symbol.length > 5) {
      newErrors.symbol = "Symbol should be 5 characters or less"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onContinue(tokenDetails)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-[#0f172a] rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-6">Define Token Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Token Name*
              </label>
              <Input
                id="name"
                name="name"
                value={tokenDetails.name}
                onChange={handleChange}
                placeholder="e.g. Stake Token"
                className="bg-[#1e293b] border-zinc-700 text-white"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-400 mb-1">
                Token Symbol*
              </label>
              <Input
                id="symbol"
                name="symbol"
                value={tokenDetails.symbol}
                onChange={handleChange}
                placeholder="e.g. STK"
                className="bg-[#1e293b] border-zinc-700 text-white"
              />
              {errors.symbol && <p className="mt-1 text-sm text-red-500">{errors.symbol}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={tokenDetails.description}
                onChange={handleChange}
                placeholder="Describe your token and its purpose"
                className="bg-[#1e293b] border-zinc-700 text-white min-h-[100px]"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Token Image</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-[#1e293b] border border-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {tokenDetails.image ? (
                    <img
                      src={tokenDetails.image || "/placeholder.svg?height=80&width=80&text=" + (tokenDetails.symbol || "TOKEN")}
                      alt="Token"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-3 py-2 rounded-md inline-block"
                  >
                    Upload Image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 512x512px PNG</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Social Links</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <Input
                    name="website"
                    value={tokenDetails.website}
                    onChange={handleChange}
                    placeholder="Website URL"
                    className="bg-[#1e293b] border-zinc-700 text-white"
                  />
                </div>
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  </div>
                  <Input
                    name="twitter"
                    value={tokenDetails.twitter}
                    onChange={handleChange}
                    placeholder="X / Twitter URL"
                    className="bg-[#1e293b] border-zinc-700 text-white"
                  />
                </div>
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <Input
                    name="telegram"
                    value={tokenDetails.telegram}
                    onChange={handleChange}
                    placeholder="Telegram URL"
                    className="bg-[#1e293b] border-zinc-700 text-white"
                  />
                </div>
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <Input
                    name="documentation"
                    value={tokenDetails.documentation}
                    onChange={handleChange}
                    placeholder="Documentation URL"
                    className="bg-[#1e293b] border-zinc-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
