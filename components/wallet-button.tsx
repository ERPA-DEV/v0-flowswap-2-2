"use client"

import { useState, useEffect } from "react"
import { ChevronDown, LogOut, Copy, ExternalLink, Wallet, RefreshCw } from "lucide-react"

const WalletButton = ({ wallet, onDisconnect, balances, onRefreshBalances }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mainBalance, setMainBalance] = useState("0.00")

  useEffect(() => {
    // Set the main balance (ETH/native token)
    if (balances && balances.main) {
      setMainBalance(balances.main)
    }
  }, [balances])

  const formatAddress = (address) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
      // Could add a toast notification here
    }
    setShowDropdown(false)
  }

  const viewOnExplorer = () => {
    if (wallet?.address) {
      window.open(`https://etherscan.io/address/${wallet.address}`, "_blank")
    }
    setShowDropdown(false)
  }

  const handleDisconnect = () => {
    onDisconnect()
    setShowDropdown(false)
  }

  const handleRefreshBalances = async () => {
    setIsRefreshing(true)
    try {
      await onRefreshBalances()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-[#252542]/80 rounded-full pl-3 pr-4 py-2 hover:bg-[#2a2a4a] transition-all duration-300 border border-gray-700/30 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.2)]"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="flex flex-col items-start">
          <span className="font-medium">{formatAddress(wallet?.address)}</span>
          <span className="text-xs text-blue-400">{mainBalance} ETH</span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-[#1a1a2e] rounded-xl border border-gray-700/30 shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-700/30">
            <p className="text-sm text-gray-400">Connected with {wallet?.walletName}</p>
            <p className="font-medium">{formatAddress(wallet?.address)}</p>
          </div>

          {/* Wallet Balance Section */}
          <div className="p-3 border-b border-gray-700/30">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Wallet Balance</p>
              <button
                className={`text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center ${isRefreshing ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleRefreshBalances}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="space-y-2">
              {/* Main Balance */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                    <Wallet className="h-3 w-3 text-gray-300" />
                  </div>
                  <span>ETH</span>
                </div>
                <span className="font-medium">{balances?.main || "0.00"}</span>
              </div>

              {/* Token Balances */}
              {balances &&
                Object.entries(balances)
                  .filter(([key]) => key !== "main")
                  .map(([token, amount]) => (
                    <div key={token} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          src={`https://assets.coingecko.com/coins/images/${token === "btc" || token === "wbtc" ? "1" : token === "eth" ? "279" : token === "usdt" ? "325" : "1"}/small/${token === "btc" || token === "wbtc" ? "bitcoin" : token === "eth" ? "ethereum" : token === "usdt" ? "tether" : "bitcoin"}.png`}
                          alt={token.toUpperCase()}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        <span>{token.toUpperCase()}</span>
                      </div>
                      <span className="font-medium">{amount}</span>
                    </div>
                  ))}
            </div>
          </div>

          <div className="p-1">
            <button
              onClick={copyAddress}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-[#252542] rounded-lg transition-colors"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Address
            </button>

            <button
              onClick={viewOnExplorer}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-[#252542] rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </button>

            <button
              onClick={handleDisconnect}
              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default WalletButton
