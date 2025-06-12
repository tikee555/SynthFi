"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { X, PlusCircle, Percent, BarChart2, Brain, Receipt, Flame, TrendingUp } from "lucide-react"

interface DistributionEntry {
  id: string
  category: string
  percentage: number
  isVested: boolean
  vestingKey?: string
}

interface VestingScheduleEntry {
  id: string
  key: string
  cliffMonths: number
  vestingMonths: number
  vestingType: "linear" | "gradual"
}

interface TokenomicsEditorProps {
  isVisible: boolean
  onApplyTokenomics: (tokenomicsString: string) => void
  currentPrompt?: string
}

const defaultCategories = [
  "Team",
  "Treasury",
  "Public Sale",
  "Advisors",
  "Community Rewards",
  "Liquidity Pool",
  "Marketing",
]

export function TokenomicsEditor({ isVisible, onApplyTokenomics, currentPrompt }: TokenomicsEditorProps) {
  const [totalSupply, setTotalSupply] = useState<string>("1000000")
  const [distribution, setDistribution] = useState<DistributionEntry[]>([
    { id: "dist-1", category: "Team", percentage: 20, isVested: true, vestingKey: "vest-team-1" },
    { id: "dist-2", category: "Treasury", percentage: 30, isVested: false },
    { id: "dist-3", category: "Public Sale", percentage: 50, isVested: false },
  ])
  const [vestingSchedules, setVestingSchedules] = useState<VestingScheduleEntry[]>([
    { id: "vest-team-1", key: "vest-team-1", cliffMonths: 6, vestingMonths: 24, vestingType: "linear" },
  ])

  // Transfer Rules State
  const [enableBuyTax, setEnableBuyTax] = useState<boolean>(false)
  const [buyTaxPercentage, setBuyTaxPercentage] = useState<string>("")
  const [buyTaxDestinationWallet, setBuyTaxDestinationWallet] = useState<string>("")

  const [enableSellTax, setEnableSellTax] = useState<boolean>(false)
  const [sellTaxPercentage, setSellTaxPercentage] = useState<string>("")
  const [sellTaxDestinationWallet, setSellTaxDestinationWallet] = useState<string>("")

  const [enableBurnOnTransfer, setEnableBurnOnTransfer] = useState<boolean>(false)
  const [burnOnTransferPercentage, setBurnOnTransferPercentage] = useState<string>("")

  // Staking State
  const [stakingAPR, setStakingAPR] = useState<string>("0")
  const [earlyWithdrawalPenalty, setEarlyWithdrawalPenalty] = useState<boolean>(false)
  const [showStakingOptions, setShowStakingOptions] = useState<boolean>(false)

  // AI Enhancement State
  const [letAiEnhance, setLetAiEnhance] = useState<boolean>(false)

  useEffect(() => {
    if (currentPrompt?.toLowerCase().includes("staking") || currentPrompt?.toLowerCase().includes("stake")) {
      setShowStakingOptions(true)
    } else {
      setShowStakingOptions(false)
    }
  }, [currentPrompt])

  const handleAddDistributionEntry = () => {
    const newId = `dist-${Date.now()}`
    setDistribution([...distribution, { id: newId, category: "", percentage: 0, isVested: false }])
  }

  const handleRemoveDistributionEntry = (id: string) => {
    const entryToRemove = distribution.find((d) => d.id === id)
    setDistribution(distribution.filter((d) => d.id !== id))
    if (entryToRemove?.vestingKey) {
      setVestingSchedules(vestingSchedules.filter((vs) => vs.key !== entryToRemove.vestingKey))
    }
  }

  const updateDistribution = (id: string, field: keyof DistributionEntry, value: any) => {
    setDistribution(
      distribution.map((d) => {
        if (d.id === id) {
          const updatedEntry = { ...d, [field]: value }
          if (field === "isVested") {
            if (value === true && !updatedEntry.vestingKey) {
              const newVestingKey = `vest-${id}-${Date.now()}`
              updatedEntry.vestingKey = newVestingKey
              setVestingSchedules([
                ...vestingSchedules,
                { id: newVestingKey, key: newVestingKey, cliffMonths: 6, vestingMonths: 12, vestingType: "linear" },
              ])
            } else if (value === false && updatedEntry.vestingKey) {
              setVestingSchedules(vestingSchedules.filter((vs) => vs.key !== updatedEntry.vestingKey))
              updatedEntry.vestingKey = undefined
            }
          }
          return updatedEntry
        }
        return d
      }),
    )
  }

  const updateVestingSchedule = (key: string, field: keyof VestingScheduleEntry, value: any) => {
    setVestingSchedules(vestingSchedules.map((vs) => (vs.key === key ? { ...vs, [field]: value } : vs)))
  }

  const totalPercentage = distribution.reduce((sum, d) => sum + Number(d.percentage || 0), 0)

  const generateTokenomicsString = useCallback(() => {
    let str = `The tokenomics are as follows: Total supply of ${Number(totalSupply).toLocaleString()} tokens. `

    str += "Initial distribution: "
    distribution.forEach((d, index) => {
      if (d.category && d.percentage > 0) {
        str += `${d.percentage}% to ${d.category}`
        if (d.isVested && d.vestingKey) {
          const vs = vestingSchedules.find((v) => v.key === d.vestingKey)
          if (vs) {
            str += ` (vested over ${vs.vestingMonths} months with a ${vs.cliffMonths}-month cliff, ${vs.vestingType} unlocking)`
          }
        }
        str += index === distribution.filter((dist) => dist.category && dist.percentage > 0).length - 1 ? ". " : ", "
      }
    })

    if (enableBuyTax && buyTaxPercentage) {
      str += `A buy tax of ${buyTaxPercentage}% applies`
      if (buyTaxDestinationWallet) str += ` (sent to ${buyTaxDestinationWallet})`
      str += ". "
    }
    if (enableSellTax && sellTaxPercentage) {
      str += `A sell tax of ${sellTaxPercentage}% applies`
      if (sellTaxDestinationWallet) str += ` (sent to ${sellTaxDestinationWallet})`
      str += ". "
    }
    if (enableBurnOnTransfer && burnOnTransferPercentage) {
      str += `${burnOnTransferPercentage}% of each transfer is burned. `
    }

    if (showStakingOptions && Number(stakingAPR) > 0) {
      str += `Staking offers an APR of ${stakingAPR}%. `
      if (earlyWithdrawalPenalty) {
        str += "An early withdrawal penalty applies. "
      }
    }

    if (letAiEnhance) {
      str +=
        "Please review these tokenomics, ensure they are robustly implemented, and suggest any improvements or critical considerations. "
    }
    return str.trim()
  }, [
    totalSupply,
    distribution,
    vestingSchedules,
    enableBuyTax,
    buyTaxPercentage,
    buyTaxDestinationWallet,
    enableSellTax,
    sellTaxPercentage,
    sellTaxDestinationWallet,
    enableBurnOnTransfer,
    burnOnTransferPercentage,
    stakingAPR,
    earlyWithdrawalPenalty,
    showStakingOptions,
    letAiEnhance,
  ])

  const handleApply = () => {
    if (totalPercentage !== 100 && distribution.length > 0 && distribution.some((d) => d.percentage > 0)) {
      alert("Total distribution percentage must be 100% if any distribution is specified. Please adjust.")
      return
    }
    onApplyTokenomics(generateTokenomicsString())
  }

  if (!isVisible) return null

  const barColors = [
    "bg-purple-500",
    "bg-pink-500",
    "bg-sky-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
  ]

  return (
    <Card className="w-full bg-[#131A2C] border-zinc-700 mt-6 mb-4">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <BarChart2 className="mr-2 h-6 w-6 text-purple-400" />
          Custom Tokenomics Editor
        </CardTitle>
        <CardDescription className="text-gray-400">
          Configure your token's supply, distribution, transfer rules, vesting, and staking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Supply Section */}
        <div className="space-y-3 p-4 bg-[#1A1F30] rounded-lg border border-zinc-600">
          <h4 className="text-lg font-semibold text-gray-200">Supply & Initial Mint</h4>
          <div>
            <Label htmlFor="totalSupply" className="text-gray-300">
              Total Supply
            </Label>
            <Input
              id="totalSupply"
              type="number"
              value={totalSupply}
              onChange={(e) => setTotalSupply(e.target.value)}
              placeholder="e.g., 1000000000"
              className="bg-[#0D111C] border-zinc-500 text-white"
            />
          </div>
        </div>

        {/* Distribution Section */}
        <div className="space-y-3 p-4 bg-[#1A1F30] rounded-lg border border-zinc-600">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-gray-200">Initial Distribution</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddDistributionEntry}
              className="text-purple-400 border-purple-600 hover:bg-purple-700/20"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </div>
          {distribution.map((distEntry) => (
            <div
              key={distEntry.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 items-end p-3 bg-[#0D111C] rounded-md border border-zinc-500"
            >
              <div className="flex-grow">
                <Label htmlFor={`dist-cat-${distEntry.id}`} className="text-gray-400 text-xs">
                  Category Name
                </Label>
                <Input
                  id={`dist-cat-${distEntry.id}`}
                  type="text"
                  value={distEntry.category}
                  onChange={(e) => updateDistribution(distEntry.id, "category", e.target.value)}
                  placeholder="e.g., Team, Treasury"
                  className="bg-[#131A2C] border-zinc-600 text-white w-full"
                  list="category-suggestions"
                />
                <datalist id="category-suggestions">
                  {defaultCategories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
              <div className="w-full md:w-28">
                <Label htmlFor={`dist-perc-${distEntry.id}`} className="text-gray-400 text-xs">
                  Percentage
                </Label>
                <div className="relative">
                  <Input
                    id={`dist-perc-${distEntry.id}`}
                    type="number"
                    value={distEntry.percentage}
                    onChange={(e) =>
                      updateDistribution(distEntry.id, "percentage", Number.parseFloat(e.target.value) || 0)
                    }
                    className="bg-[#131A2C] border-zinc-600 text-white pr-7"
                    min="0"
                    max="100"
                  />
                  <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id={`dist-vested-${distEntry.id}`}
                  checked={distEntry.isVested}
                  onCheckedChange={(checked) => updateDistribution(distEntry.id, "isVested", checked)}
                  className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-zinc-700"
                />
                <Label htmlFor={`dist-vested-${distEntry.id}`} className="text-gray-300 text-sm">
                  Vested?
                </Label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveDistributionEntry(distEntry.id)}
                className="text-red-500 hover:bg-red-700/20 self-end md:self-center mt-2 md:mt-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {totalPercentage !== 100 && distribution.length > 0 && distribution.some((d) => d.percentage > 0) && (
            <p className="text-red-500 text-sm mt-2">Total distribution must be 100%. Current: {totalPercentage}%</p>
          )}
        </div>

        {/* Transfer Rules & Mechanics Section */}
        <div className="space-y-4 p-4 bg-[#1A1F30] rounded-lg border border-zinc-600">
          <h4 className="text-lg font-semibold text-gray-200">Transfer Rules & Mechanics</h4>
          {/* Buy Tax */}
          <div className="space-y-2 p-3 bg-[#0D111C] rounded-md border border-zinc-500">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableBuyTax" className="text-gray-300 flex items-center">
                <Receipt className="mr-2 h-5 w-5 text-purple-400" /> Enable Buy Tax
              </Label>
              <Switch
                id="enableBuyTax"
                checked={enableBuyTax}
                onCheckedChange={setEnableBuyTax}
                className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-zinc-700"
              />
            </div>
            {enableBuyTax && (
              <div className="space-y-3 pt-2 pl-7">
                <div>
                  <Label htmlFor="buyTaxPercentage" className="text-gray-400 text-xs">
                    Buy Tax Percentage (%)
                  </Label>
                  <Input
                    id="buyTaxPercentage"
                    type="number"
                    value={buyTaxPercentage}
                    onChange={(e) => setBuyTaxPercentage(e.target.value)}
                    placeholder="e.g., 1.5"
                    className="bg-[#131A2C] border-zinc-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="buyTaxDestinationWallet" className="text-gray-400 text-xs">
                    Optional: Destination Wallet
                  </Label>
                  <Input
                    id="buyTaxDestinationWallet"
                    type="text"
                    value={buyTaxDestinationWallet}
                    onChange={(e) => setBuyTaxDestinationWallet(e.target.value)}
                    placeholder="e.g., Treasury wallet address"
                    className="bg-[#131A2C] border-zinc-600 text-white"
                  />
                </div>
              </div>
            )}
          </div>
          {/* Sell Tax */}
          <div className="space-y-2 p-3 bg-[#0D111C] rounded-md border border-zinc-500">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableSellTax" className="text-gray-300 flex items-center">
                <Receipt className="mr-2 h-5 w-5 text-pink-400" /> Enable Sell Tax
              </Label>
              <Switch
                id="enableSellTax"
                checked={enableSellTax}
                onCheckedChange={setEnableSellTax}
                className="data-[state=checked]:bg-pink-600 data-[state=unchecked]:bg-zinc-700"
              />
            </div>
            {enableSellTax && (
              <div className="space-y-3 pt-2 pl-7">
                <div>
                  <Label htmlFor="sellTaxPercentage" className="text-gray-400 text-xs">
                    Sell Tax Percentage (%)
                  </Label>
                  <Input
                    id="sellTaxPercentage"
                    type="number"
                    value={sellTaxPercentage}
                    onChange={(e) => setSellTaxPercentage(e.target.value)}
                    placeholder="e.g., 2.0"
                    className="bg-[#131A2C] border-zinc-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="sellTaxDestinationWallet" className="text-gray-400 text-xs">
                    Optional: Destination Wallet
                  </Label>
                  <Input
                    id="sellTaxDestinationWallet"
                    type="text"
                    value={sellTaxDestinationWallet}
                    onChange={(e) => setSellTaxDestinationWallet(e.target.value)}
                    placeholder="e.g., Marketing wallet address"
                    className="bg-[#131A2C] border-zinc-600 text-white"
                  />
                </div>
              </div>
            )}
          </div>
          {/* Burn on Transfer */}
          <div className="space-y-2 p-3 bg-[#0D111C] rounded-md border border-zinc-500">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableBurnOnTransfer" className="text-gray-300 flex items-center">
                <Flame className="mr-2 h-5 w-5 text-orange-400" /> Burn on Transfer
              </Label>
              <Switch
                id="enableBurnOnTransfer"
                checked={enableBurnOnTransfer}
                onCheckedChange={setEnableBurnOnTransfer}
                className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-zinc-700"
              />
            </div>
            {enableBurnOnTransfer && (
              <div className="space-y-3 pt-2 pl-7">
                <div>
                  <Label htmlFor="burnOnTransferPercentage" className="text-gray-400 text-xs">
                    Burn Percentage (%)
                  </Label>
                  <Input
                    id="burnOnTransferPercentage"
                    type="number"
                    value={burnOnTransferPercentage}
                    onChange={(e) => setBurnOnTransferPercentage(e.target.value)}
                    placeholder="e.g., 0.5"
                    className="bg-[#131A2C] border-zinc-600 text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This amount is sent to the burn address on each transfer.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vesting Schedules Section (Conditional) */}
        {distribution.some((d) => d.isVested && d.vestingKey) && (
          <div className="space-y-3 p-4 bg-[#1A1F30] rounded-lg border border-zinc-600">
            <h4 className="text-lg font-semibold text-gray-200">Vesting Schedules</h4>
            {distribution
              .filter((d) => d.isVested && d.vestingKey)
              .map((distEntry) => {
                const vs = vestingSchedules.find((v) => v.key === distEntry.vestingKey)
                if (!vs) return null
                return (
                  <div key={vs.id} className="p-3 bg-[#0D111C] rounded-md border border-zinc-500">
                    <p className="text-md font-medium text-purple-400 mb-2">
                      Vesting for: {distEntry.category || "Uncategorized"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`vs-cliff-${vs.id}`} className="text-gray-300">
                          Cliff Duration (Months)
                        </Label>
                        <Input
                          id={`vs-cliff-${vs.id}`}
                          type="number"
                          value={vs.cliffMonths}
                          onChange={(e) =>
                            updateVestingSchedule(vs.key, "cliffMonths", Number.parseInt(e.target.value) || 0)
                          }
                          className="bg-[#131A2C] border-zinc-500 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`vs-duration-${vs.id}`} className="text-gray-300">
                          Total Vesting (Months)
                        </Label>
                        <Input
                          id={`vs-duration-${vs.id}`}
                          type="number"
                          value={vs.vestingMonths}
                          onChange={(e) =>
                            updateVestingSchedule(vs.key, "vestingMonths", Number.parseInt(e.target.value) || 0)
                          }
                          className="bg-[#131A2C] border-zinc-500 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`vs-type-${vs.id}`} className="text-gray-300">
                          Vesting Type
                        </Label>
                        <select
                          id={`vs-type-${vs.id}`}
                          value={vs.vestingType}
                          onChange={(e) =>
                            updateVestingSchedule(vs.key, "vestingType", e.target.value as "linear" | "gradual")
                          }
                          className="w-full p-2 bg-[#131A2C] border border-zinc-500 rounded-md text-white"
                        >
                          <option value="linear">Linear</option>
                          <option value="gradual">Gradual (Monthly)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {/* Staking Options (Conditional) */}
        {showStakingOptions && (
          <div className="space-y-3 p-4 bg-[#1A1F30] rounded-lg border border-zinc-600">
            <h4 className="text-lg font-semibold text-gray-200 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-400" />
              Staking Configuration
            </h4>
            <div>
              <Label htmlFor="stakingAPR" className="text-gray-300">
                Staking APR (%)
              </Label>
              <Input
                id="stakingAPR"
                type="number"
                value={stakingAPR}
                onChange={(e) => setStakingAPR(e.target.value)}
                placeholder="e.g., 5"
                className="bg-[#0D111C] border-zinc-500 text-white"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="earlyWithdrawalPenalty"
                checked={earlyWithdrawalPenalty}
                onCheckedChange={setEarlyWithdrawalPenalty}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-zinc-700"
              />
              <Label htmlFor="earlyWithdrawalPenalty" className="text-gray-300">
                Enable Early Withdrawal Penalty?
              </Label>
            </div>
          </div>
        )}

        {/* Preview Section */}
        <div className="space-y-3 p-4 bg-[#1A1F30] rounded-lg border border-zinc-600">
          <h4 className="text-lg font-semibold text-gray-200">Tokenomics Preview</h4>
          <div className="p-3 bg-[#0D111C] rounded-md border border-zinc-500 text-sm text-gray-300 space-y-1">
            <p>
              <strong>Total Supply:</strong> {Number(totalSupply).toLocaleString()} tokens
            </p>
            {distribution.filter((d) => d.category && d.percentage > 0).length > 0 && (
              <>
                <p>
                  <strong>Distribution:</strong>
                </p>
                <ul className="list-disc list-inside pl-4">
                  {distribution
                    .filter((d) => d.category && d.percentage > 0)
                    .map((d) => (
                      <li key={d.id}>
                        {d.category}: {d.percentage}%
                        {d.isVested &&
                          d.vestingKey &&
                          (() => {
                            const vs = vestingSchedules.find((v) => v.key === d.vestingKey)
                            return vs
                              ? ` (Cliff: ${vs.cliffMonths}mo, Vesting: ${vs.vestingMonths}mo, ${vs.vestingType})`
                              : ""
                          })()}
                      </li>
                    ))}
                </ul>
              </>
            )}
            {(enableBuyTax && buyTaxPercentage) ||
            (enableSellTax && sellTaxPercentage) ||
            (enableBurnOnTransfer && burnOnTransferPercentage) ? (
              <p className="mt-2">
                <strong>Transfer Rules:</strong>
              </p>
            ) : null}
            <ul className="list-disc list-inside pl-4">
              {enableBuyTax && buyTaxPercentage && (
                <li>
                  Buy Tax: {buyTaxPercentage}%{" "}
                  {buyTaxDestinationWallet
                    ? `(to: ${buyTaxDestinationWallet.substring(0, 6)}...${buyTaxDestinationWallet.slice(-4)})`
                    : ""}
                </li>
              )}
              {enableSellTax && sellTaxPercentage && (
                <li>
                  Sell Tax: {sellTaxPercentage}%{" "}
                  {sellTaxDestinationWallet
                    ? `(to: ${sellTaxDestinationWallet.substring(0, 6)}...${sellTaxDestinationWallet.slice(-4)})`
                    : ""}
                </li>
              )}
              {enableBurnOnTransfer && burnOnTransferPercentage && (
                <li>Burn on Transfer: {burnOnTransferPercentage}%</li>
              )}
            </ul>
            {showStakingOptions && Number(stakingAPR) > 0 && (
              <p className="mt-2">
                <strong>Staking APR:</strong> {stakingAPR}%{" "}
                {earlyWithdrawalPenalty ? "(Penalty for early withdrawal)" : ""}
              </p>
            )}
          </div>
          {/* Distribution Chart */}
          {distribution.filter((d) => d.percentage > 0).length > 0 && (
            <div>
              <h5 className="text-md font-semibold text-gray-300 mt-3 mb-2">Distribution Chart:</h5>
              <div className="flex h-8 rounded-md overflow-hidden border border-zinc-500">
                {distribution
                  .filter((d) => d.percentage > 0)
                  .map((d, index) => (
                    <div
                      key={d.id}
                      className={`flex items-center justify-center text-xs font-medium text-white ${barColors[index % barColors.length]}`}
                      style={{ width: `${d.percentage}%` }}
                      title={`${d.category}: ${d.percentage}%`}
                    >
                      {d.percentage >= 10 ? `${d.percentage}%` : ""}
                    </div>
                  ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {distribution
                  .filter((d) => d.percentage > 0)
                  .map((d, index) => (
                    <div key={d.id} className="flex items-center text-xs">
                      <span className={`w-3 h-3 rounded-sm mr-1.5 ${barColors[index % barColors.length]}`}></span>
                      <span className="text-gray-400">
                        {d.category}: {d.percentage}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 border-t border-zinc-700">
        <div className="flex items-center space-x-2">
          <Switch
            id="letAiEnhance"
            checked={letAiEnhance}
            onCheckedChange={setLetAiEnhance}
            className="data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-zinc-700"
          />
          <Label htmlFor="letAiEnhance" className="text-gray-300 flex items-center text-sm">
            <Brain className="h-4 w-4 mr-1.5 text-purple-400" /> Let AI enhance tokenomics
          </Label>
        </div>
        <Button onClick={handleApply} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">
          Apply Tokenomics to Prompt
        </Button>
      </CardFooter>
    </Card>
  )
}
