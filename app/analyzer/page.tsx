"use client"

import { useState } from "react"
import { Search, AlertCircle, Shield, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"

// Mock security data for demonstration
const MOCK_SECURITY_DATA = {
  safe: {
    is_open_source: 1,
    is_proxy: 0,
    is_mintable: 0,
    owner_address: "0x0000000000000000000000000000000000000000",
    can_take_back_ownership: 0,
    owner_change_balance: 0,
    hidden_owner: 0,
    selfdestruct: 0,
    external_call: 0,
    is_honeypot: 0,
    transfer_pausable: 0,
    cannot_sell_all: 0,
    is_blacklisted: 0,
    is_whitelisted: 0,
    is_in_dex: 1,
    is_anti_whale: 0,
    anti_whale_modifiable: 0,
    trading_cooldown: 0,
    personal_slippage_modifiable: 0,
    buy_tax: 0,
    sell_tax: 0,
    trust_list: 1,
  },
  risky: {
    is_open_source: 0,
    is_proxy: 1,
    is_mintable: 1,
    owner_address: "0x123456789abcdef123456789abcdef123456789a",
    can_take_back_ownership: 1,
    owner_change_balance: 1,
    hidden_owner: 1,
    selfdestruct: 1,
    external_call: 1,
    is_honeypot: 1,
    transfer_pausable: 1,
    cannot_sell_all: 1,
    is_blacklisted: 1,
    is_whitelisted: 1,
    is_in_dex: 0,
    is_anti_whale: 1,
    anti_whale_modifiable: 1,
    trading_cooldown: 1,
    personal_slippage_modifiable: 1,
    buy_tax: 15,
    sell_tax: 25,
    trust_list: 0,
  },
  medium: {
    is_open_source: 1,
    is_proxy: 0,
    is_mintable: 1,
    owner_address: "0x123456789abcdef123456789abcdef123456789a",
    can_take_back_ownership: 0,
    owner_change_balance: 0,
    hidden_owner: 0,
    selfdestruct: 0,
    external_call: 1,
    is_honeypot: 0,
    transfer_pausable: 1,
    cannot_sell_all: 0,
    is_blacklisted: 0,
    is_whitelisted: 1,
    is_in_dex: 1,
    is_anti_whale: 1,
    anti_whale_modifiable: 0,
    trading_cooldown: 1,
    personal_slippage_modifiable: 0,
    buy_tax: 5,
    sell_tax: 5,
    trust_list: 0,
  },
}

// Chain options
const CHAIN_OPTIONS = [
  { id: "1", name: "Ethereum", icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { id: "56", name: "BNB Chain", icon: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png" },
  { id: "137", name: "Polygon", icon: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png" },
  { id: "42161", name: "Arbitrum", icon: "https://assets.coingecko.com/coins/images/16547/small/arbitrum.png" },
  {
    id: "43114",
    name: "Avalanche",
    icon: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  },
  { id: "solana", name: "Solana", icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
  { id: "10", name: "Optimism", icon: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png" },
  { id: "8453", name: "Base", icon: "https://assets.coingecko.com/coins/images/28368/small/base.png" },
]

// Risk level colors
const getRiskColor = (level) => {
  switch (level) {
    case "High":
      return "text-red-500 bg-red-500/10"
    case "Medium":
      return "text-yellow-500 bg-yellow-500/10"
    case "Low":
      return "text-green-500 bg-green-500/10"
    default:
      return "text-gray-500 bg-gray-500/10"
  }
}

// Function to get the correct explorer link based on chain
const getExplorerLink = (chainId, address) => {
  switch (chainId) {
    case "1":
      return `https://etherscan.io/address/${address}`
    case "56":
      return `https://bscscan.com/address/${address}`
    case "137":
      return `https://polygonscan.com/address/${address}`
    case "42161":
      return `https://arbiscan.io/address/${address}`
    case "43114":
      return `https://snowtrace.io/address/${address}`
    case "solana":
      return `https://solscan.io/token/${address}`
    case "10":
      return `https://optimistic.etherscan.io/address/${address}`
    case "8453":
      return `https://basescan.org/address/${address}`
    default:
      return `https://etherscan.io/address/${address}`
  }
}

export default function TokenAnalyzer() {
  const [tokenAddress, setTokenAddress] = useState("")
  const [selectedChain, setSelectedChain] = useState(CHAIN_OPTIONS[0])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [securityData, setSecurityData] = useState(null)
  const [tokenInfo, setTokenInfo] = useState(null)
  const [riskLevel, setRiskLevel] = useState(null)
  const [showChainDropdown, setShowChainDropdown] = useState(false)
  const [error, setError] = useState(null)

  // Function to analyze token
  const analyzeToken = async () => {
    if (!tokenAddress || tokenAddress.length < 10) {
      setError("Please enter a valid token address")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setSecurityData(null)
    setTokenInfo(null)
    setRiskLevel(null)

    try {
      // In a real implementation, you would call your API here
      // const response = await axios.get(`/api/token-security?chainId=${selectedChain.id}&address=${tokenAddress}`)

      // For demo purposes, we'll use mock data with a random selection
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay

      // Randomly select one of the mock security profiles
      const mockProfiles = ["safe", "risky", "medium"]
      const selectedProfile = mockProfiles[Math.floor(Math.random() * mockProfiles.length)]
      const mockData = MOCK_SECURITY_DATA[selectedProfile]

      // Set security data
      setSecurityData(mockData)

      // Set token info (mock data) - Customize based on selected chain
      const chainSymbol = selectedChain.name.split(" ")[0].toUpperCase()
      setTokenInfo({
        name:
          selectedProfile === "safe"
            ? `Safe ${chainSymbol} Token`
            : selectedProfile === "risky"
              ? `Risky ${chainSymbol} Token`
              : `Medium Risk ${chainSymbol} Token`,
        symbol:
          selectedProfile === "safe"
            ? `S${chainSymbol}`
            : selectedProfile === "risky"
              ? `R${chainSymbol}`
              : `M${chainSymbol}`,
        decimals: selectedChain.id === "solana" ? 9 : 18,
        totalSupply: selectedChain.id === "solana" ? "1000000000" : "1000000000000000000000000",
        holders: selectedProfile === "safe" ? 12500 : selectedProfile === "risky" ? 250 : 1800,
        verified: selectedProfile === "safe" ? true : selectedProfile === "risky" ? false : true,
        chain: selectedChain,
      })

      // Set risk level based on profile
      setRiskLevel(selectedProfile === "safe" ? "Low" : selectedProfile === "risky" ? "High" : "Medium")
    } catch (err) {
      console.error("Error analyzing token:", err)
      setError("Failed to analyze token. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Function to get risk score (0-100)
  const getRiskScore = () => {
    if (!securityData) return 0

    // In a real implementation, you would calculate this based on actual security data
    if (riskLevel === "Low") return 15
    if (riskLevel === "Medium") return 55
    if (riskLevel === "High") return 85
    return 0
  }

  return (
    <div className="flex min-h-screen bg-[#0a0b14] flex-col">
      {/* Header */}
      <Header />

      <div className="flex pt-24">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 relative">
          {/* Background elements */}
          <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Glowing orbs */}
            <div className="absolute top-[20%] left-[15%] w-[300px] h-[300px] rounded-full bg-[#3b52b4]/10 blur-[120px] animate-pulse-slow"></div>
            <div
              className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-[#7b52ff]/5 blur-[150px] animate-pulse-slow"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute top-[60%] right-[30%] w-[200px] h-[200px] rounded-full bg-[#52a5ff]/10 blur-[100px] animate-pulse-slow"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Geometric shapes */}
            <div className="absolute top-[15%] right-[20%] w-[250px] h-[60px] rounded-full bg-gradient-to-r from-[#3b52b4]/8 to-transparent rotate-12 blur-sm"></div>
            <div className="absolute bottom-[25%] left-[10%] w-[300px] h-[80px] rounded-full bg-gradient-to-r from-[#3b52b4]/8 to-transparent -rotate-15 blur-sm"></div>
            <div className="absolute top-[40%] left-[25%] w-[200px] h-[50px] rounded-full bg-gradient-to-r from-[#3b9bd9]/8 to-transparent rotate-45 blur-sm"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Crypto Analyzer</h1>
              <p className="text-gray-400">Analyze any token for security risks and potential scams before trading</p>
            </div>

            {/* Token Analyzer Card - Enhanced with better visuals */}
            <div className="bg-gradient-to-br from-[#0c0c14] to-[#131326] rounded-2xl border border-[#1e2033] p-6 mb-8 shadow-lg relative overflow-hidden group">
              {/* Animated background elements */}
              <div className="absolute -right-20 top-0 w-[250px] h-[250px] bg-[#3b52b4]/10 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"></div>
              <div
                className="absolute -left-20 bottom-0 w-[250px] h-[250px] bg-[#3b52b4]/5 rounded-full blur-[80px] pointer-events-none animate-pulse-slow"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Top edge highlight */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#3b52b4]/40 to-transparent"></div>

              {/* Bottom edge highlight */}
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#3b52b4]/40 to-transparent"></div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Chain Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowChainDropdown(!showChainDropdown)}
                      className="flex items-center space-x-2 bg-[#1a1a2e] hover:bg-[#1e2033] px-4 py-3 rounded-xl transition-colors border border-[#3b52b4]/20 w-full md:w-auto group-hover:border-[#3b52b4]/40 transition-all duration-300"
                    >
                      <img
                        src={selectedChain.icon || "/placeholder.svg"}
                        alt={selectedChain.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="font-medium text-white">{selectedChain.name}</span>
                      <svg
                        className={`h-4 w-4 text-gray-400 transition-transform ${showChainDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showChainDropdown && (
                      <div className="absolute left-0 mt-2 w-full md:w-64 bg-[#0f0f1a] border border-[#1e2033] rounded-xl shadow-xl z-30">
                        <div className="p-2 max-h-[300px] overflow-y-auto">
                          {CHAIN_OPTIONS.map((chain) => (
                            <button
                              key={chain.id}
                              className="flex items-center w-full p-2 hover:bg-[#1a1a2e] rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedChain(chain)
                                setShowChainDropdown(false)
                                // Reset analysis when changing chains
                                setSecurityData(null)
                                setTokenInfo(null)
                                setRiskLevel(null)
                              }}
                            >
                              <img
                                src={chain.icon || "/placeholder.svg"}
                                alt={chain.name}
                                className="w-5 h-5 rounded-full mr-2"
                              />
                              <span className="font-medium text-white">{chain.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Token Address Input */}
                  <div className="relative flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={
                          selectedChain.id === "solana"
                            ? "Enter token address (e.g., EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)"
                            : "Enter token contract address (0x...)"
                        }
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                        className="w-full bg-[#0f0f1a] border border-[#1e2033] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors pl-10 group-hover:border-[#3b52b4]/30 transition-all duration-300"
                      />
                      <Search className="absolute left-3 top-3.5 text-gray-500 h-5 w-5" />
                    </div>
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={analyzeToken}
                    disabled={isAnalyzing}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isAnalyzing
                        ? "bg-[#1e2033] cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 cursor-pointer shadow-md hover:shadow-lg"
                    }`}
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Analyzing...
                      </div>
                    ) : (
                      "Analyze Token"
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 px-4 py-3 bg-red-500/10 text-red-400 text-sm rounded-xl flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Analysis Results */}
                {securityData && (
                  <div className="mt-6">
                    {/* Token Info */}
                    <div className="mb-6 p-4 bg-[#0f0f1a] rounded-xl border border-[#1e2033]">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#2a2a45] flex items-center justify-center mr-3 shadow-md">
                            <span className="text-lg font-bold text-white">{tokenInfo?.symbol?.charAt(0) || "?"}</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{tokenInfo?.name || "Unknown Token"}</h3>
                            <div className="flex items-center">
                              <p className="text-gray-400 text-sm">{tokenInfo?.symbol || "???"}</p>
                              <div className="ml-2 px-2 py-0.5 rounded-full bg-[#1e2033] text-xs text-gray-300 flex items-center">
                                <img
                                  src={tokenInfo?.chain?.icon || selectedChain.icon}
                                  alt={tokenInfo?.chain?.name || selectedChain.name}
                                  className="w-3 h-3 mr-1 rounded-full"
                                />
                                {tokenInfo?.chain?.name || selectedChain.name}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(riskLevel)}`}>
                          {riskLevel} Risk
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs mb-1">Contract</p>
                        <div className="flex items-center">
                          <p className="text-white text-sm font-mono truncate">
                            {tokenAddress.substring(0, 6)}...{tokenAddress.substring(tokenAddress.length - 4)}
                          </p>
                          <a
                            href={getExplorerLink(selectedChain.id, tokenAddress)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Holders</p>
                        <p className="text-white text-sm">{tokenInfo?.holders?.toLocaleString() || "Unknown"}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Verified</p>
                        <div className="flex items-center">
                          {tokenInfo?.verified ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-500 text-sm">Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-500 text-sm">Not Verified</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Risk Score */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium text-white">Risk Score</h3>
                        <div className="text-white font-bold">{getRiskScore()}/100</div>
                      </div>
                      <div className="h-2 w-full bg-[#1e2033] rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            riskLevel === "Low"
                              ? "bg-green-500"
                              : riskLevel === "Medium"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${getRiskScore()}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Security Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Contract Security</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Open Source</span>
                            </div>
                            <div>
                              {securityData.is_open_source ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Proxy Contract</span>
                            </div>
                            <div>
                              {securityData.is_proxy ? (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Mintable</span>
                            </div>
                            <div>
                              {securityData.is_mintable ? (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Owner Can Change Balance</span>
                            </div>
                            <div>
                              {securityData.owner_change_balance ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Hidden Owner</span>
                            </div>
                            <div>
                              {securityData.hidden_owner ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Self Destruct</span>
                            </div>
                            <div>
                              {securityData.selfdestruct ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Trading Security</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Honeypot</span>
                            </div>
                            <div>
                              {securityData.is_honeypot ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Transfer Pausable</span>
                            </div>
                            <div>
                              {securityData.transfer_pausable ? (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Cannot Sell All</span>
                            </div>
                            <div>
                              {securityData.cannot_sell_all ? (
                                <XCircle className="h-5 w-5 text-red-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Trading Cooldown</span>
                            </div>
                            <div>
                              {securityData.trading_cooldown ? (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Buy Tax</span>
                            </div>
                            <div className="text-white">
                              {securityData.buy_tax}%
                              {securityData.buy_tax > 10 && (
                                <AlertCircle className="inline-block h-4 w-4 text-red-500 ml-1" />
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-[#0f0f1a] rounded-lg">
                            <div className="flex items-center">
                              <Shield className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-white">Sell Tax</span>
                            </div>
                            <div className="text-white">
                              {securityData.sell_tax}%
                              {securityData.sell_tax > 10 && (
                                <AlertCircle className="inline-block h-4 w-4 text-red-500 ml-1" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Summary */}
                    {riskLevel && (
                      <div className="mt-6 p-4 rounded-xl border border-[#1e2033] bg-[#0f0f1a]">
                        <h3 className="text-lg font-medium text-white mb-2">Risk Summary</h3>
                        <div
                          className={`p-3 rounded-lg ${
                            riskLevel === "Low"
                              ? "bg-green-500/10 text-green-400"
                              : riskLevel === "Medium"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {riskLevel === "Low" ? (
                            <div className="flex items-start">
                              <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium">Low Risk Token</p>
                                <p className="text-sm mt-1">
                                  This token appears to have good security practices and low trading risks. As always,
                                  do your own research before investing.
                                </p>
                              </div>
                            </div>
                          ) : riskLevel === "Medium" ? (
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium">Medium Risk Token</p>
                                <p className="text-sm mt-1">
                                  This token has some potential risk factors. Be cautious and research thoroughly before
                                  trading.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start">
                              <XCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium">High Risk Token</p>
                                <p className="text-sm mt-1">
                                  This token has multiple high-risk indicators and may be unsafe to trade. Trading is
                                  not recommended.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Initial State - No Analysis Yet */}
                {!securityData && !isAnalyzing && !error && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#1a1a2e] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Token Security Analyzer</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Enter a token contract address and select a blockchain to analyze the token for potential security
                      risks and scams.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Information Section */}
            <div className="bg-[#0c0c14] rounded-2xl border border-[#1e2033] p-6 shadow-lg">
              <h3 className="text-lg font-medium text-white mb-4">About Token Security Analysis</h3>
              <div className="space-y-4 text-gray-400 text-sm">
                <p>
                  Our token analyzer helps you identify potential security risks and scams before trading. We check for
                  common vulnerabilities and red flags in token contracts.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-[#0f0f1a] rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-red-400 mr-2" />
                      <h4 className="text-white font-medium">Honeypot Detection</h4>
                    </div>
                    <p className="text-xs">
                      Identifies tokens that allow buying but prevent selling, trapping investors' funds.
                    </p>
                  </div>
                  <div className="p-3 bg-[#0f0f1a] rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-yellow-400 mr-2" />
                      <h4 className="text-white font-medium">Tax Analysis</h4>
                    </div>
                    <p className="text-xs">
                      Checks for excessive buy/sell taxes that may indicate a potential scam or rug pull.
                    </p>
                  </div>
                  <div className="p-3 bg-[#0f0f1a] rounded-lg">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 text-green-400 mr-2" />
                      <h4 className="text-white font-medium">Contract Verification</h4>
                    </div>
                    <p className="text-xs">
                      Verifies if the contract code is open source and has been verified on the blockchain explorer.
                    </p>
                  </div>
                </div>
                <p className="text-xs italic mt-4">
                  Disclaimer: This tool provides information for educational purposes only. Always do your own research
                  (DYOR) before trading any cryptocurrency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
