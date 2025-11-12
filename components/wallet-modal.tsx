"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    description: "Connect to your MetaMask Wallet",
    installed: false,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "https://1000logos.net/wp-content/uploads/2023/01/WalletConnect-logo.png",
    description: "Scan with WalletConnect to connect",
    installed: true,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "https://seeklogo.com/images/C/coinbase-coin-logo-C86F46D7B8-seeklogo.com.png",
    description: "Connect to your Coinbase Wallet",
    installed: false,
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "https://trustwallet.com/assets/images/media/assets/TWT.png",
    description: "Connect to your Trust Wallet",
    installed: false,
  },
]

const WalletModal = ({ onClose, onConnect }) => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState("")

  useEffect(() => {
    // Check if MetaMask is installed
    const checkMetaMask = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        setIsMetaMaskInstalled(true)
        wallets[0].installed = true
      }
    }

    checkMetaMask()
  }, [])

  const connectWallet = async (walletId) => {
    setIsConnecting(true)
    setConnectionError("")

    try {
      if (walletId === "metamask" && window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts.length > 0) {
          onConnect({
            address: accounts[0],
            walletId: walletId,
            walletName: "MetaMask",
          })
          onClose()
        }
      } else {
        // Simulate connection for other wallets
        setTimeout(() => {
          const mockAddress =
            "0x" +
            Array(40)
              .fill(0)
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join("")

          onConnect({
            address: mockAddress,
            walletId: walletId,
            walletName: wallets.find((w) => w.id === walletId)?.name || "Wallet",
          })
          onClose()
        }, 1000)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setConnectionError(error.message || "Failed to connect wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-[#1a1a2e] text-white p-8 rounded-2xl w-full max-w-md mx-auto border border-gray-800/30 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Connect Wallet</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {connectionError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
              {connectionError}
            </div>
          )}

          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => connectWallet(wallet.id)}
                disabled={isConnecting}
                className="w-full flex items-center p-4 bg-[#252542] hover:bg-[#2a2a4a] border border-gray-700/30 rounded-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img
                  src={wallet.icon || "/placeholder.svg"}
                  alt={wallet.name}
                  className="w-10 h-10 mr-4 rounded-full bg-white p-1"
                />
                <div className="flex-1 text-left">
                  <div className="font-medium flex items-center">
                    {wallet.name}
                    {wallet.id === "metamask" && !isMetaMaskInstalled && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full">
                        Not detected
                      </span>
                    )}
                    {wallet.installed && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full">
                        Detected
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{wallet.description}</p>
                </div>
                <div className="ml-2 w-6 h-6 rounded-full border border-gray-600 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-blue-500 transition-colors"></div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>
              By connecting your wallet, you agree to our{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-400 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletModal
